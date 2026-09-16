import asyncio, json, base64, pathlib, urllib.request
import websockets

HOST = "127.0.0.1:9222"
PDF = pathlib.Path("scripts/fixtures/sample-cad-labels.pdf")

def get_page_ws():
    pages = json.load(urllib.request.urlopen(f"http://{HOST}/json/list"))
    for p in pages:
        if p.get("url", "").startswith("https://localhost"):
            return p["webSocketDebuggerUrl"], p
    raise SystemExit("Convertify page not found")

async def main():
    ws_url, page = get_page_ws()
    print("page", page.get("url"))
    b64 = base64.b64encode(PDF.read_bytes()).decode("ascii")
    async with websockets.connect(ws_url, max_size=8 * 1024 * 1024) as ws:
        n = 1
        async def cdp(method, params=None, timeout=60):
            nonlocal n
            msg = {"id": n, "method": method}
            if params:
                msg["params"] = params
            n += 1
            await ws.send(json.dumps(msg))
            mid = msg["id"]
            while True:
                raw = await asyncio.wait_for(ws.recv(), timeout=timeout)
                data = json.loads(raw)
                if data.get("id") == mid:
                    if "error" in data:
                        raise RuntimeError(f"{method}: {data['error']}")
                    return data.get("result", {})

        async def evaluate(expression, awaitPromise=True):
            r = await cdp("Runtime.evaluate", {
                "expression": expression,
                "awaitPromise": awaitPromise,
                "returnByValue": True,
            })
            if r.get("exceptionDetails"):
                raise RuntimeError(str(r["exceptionDetails"]))
            return r.get("result", {}).get("value")

        await cdp("Runtime.enable")
        await cdp("Page.enable")

        # 1) Tools list includes editor
        await cdp("Page.navigate", {"url": "https://localhost/all-tools/index.html"})
        await asyncio.sleep(2)
        listed = await evaluate("document.body.innerText.includes('Edit PDF text')")
        print("LISTED_ON_TOOLS:", listed)

        # 2) Open editor via hard index.html (Capacitor-safe)
        await cdp("Page.navigate", {"url": "https://localhost/autocad-pdf-editor/index.html"})
        await asyncio.sleep(2.5)
        meta = await evaluate("""JSON.stringify({
          title: (document.querySelector('.mobile-tool-title')||{}).textContent||'',
          eyebrow: (document.querySelector('.mobile-tool-eyebrow')||{}).textContent||'',
          body: !!document.querySelector('.mobile-tool-body'),
          choose: (document.querySelector('.mobile-choose-btn')||{}).textContent||'',
          lead: (document.querySelector('.mobile-tool-lead')||{}).textContent||''
        })""")
        print("EDITOR_META:", meta)
        meta_o = json.loads(meta)
        assert "Edit PDF" in meta_o["title"], meta_o
        assert "Choose PDF" in meta_o["choose"], meta_o
        assert meta_o["body"] and meta_o["eyebrow"], meta_o

        # 3) Inject PDF through hidden file input (react-dropzone change)
        inj = await evaluate(f"""
        (async () => {{
          const b64 = "{b64}";
          const bin = atob(b64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          const file = new File([bytes], "sample-cad-labels.pdf", {{ type: "application/pdf" }});
          const input = document.querySelector("input[type=file]");
          if (!input) return {{ ok:false, err:"no-input" }};
          const dt = new DataTransfer();
          dt.items.add(file);
          input.files = dt.files;
          input.dispatchEvent(new Event("change", {{ bubbles: true }}));
          return {{ ok:true, size: file.size }};
        }})()
        """)
        print("INJECT:", inj)

        ok_edit = False
        last = None
        for i in range(50):
            await asyncio.sleep(0.6)
            state = await evaluate("""
            (() => {
              const text = document.body.innerText;
              return {
                hasCanvas: !!document.querySelector('img[src^="data:image"]'),
                hasSave: !!Array.from(document.querySelectorAll("button")).find(b => /Save edited PDF/i.test(b.textContent||"")),
                hasWork: !!document.querySelector(".mobile-work-bar"),
                hasPage: /Page\\s+\\d+/i.test(text),
                snip: text.slice(0, 220)
              };
            })()
            """)
            last = state
            if i % 5 == 0:
                print(f"wait[{i}]", state)
            if state and state.get("hasCanvas") and (state.get("hasSave") or state.get("hasPage")):
                ok_edit = True
                break
        assert ok_edit, f"never entered editing UI: {last}"
        print("EDIT_UI_OK", last)

        # 4) Click a text region and replace text
        typed = await evaluate("""
        (async () => {
          const candidates = Array.from(document.querySelectorAll("div.absolute")).filter(d => {
            const t = d.getAttribute("title") || "";
            return /edit|Edited|Deleted|"/i.test(t);
          });
          if (!candidates.length) return { ok:false, err:"no-region" };
          candidates[0].dispatchEvent(new MouseEvent("click", { bubbles:true, cancelable:true, view:window }));
          await new Promise(r => setTimeout(r, 500));
          const input = document.querySelector("input[placeholder*='corrected' i], input[placeholder*='replacement' i], input[placeholder*='Type']");
          if (!input) return { ok:false, err:"no-draft", snip: document.body.innerText.slice(0,180) };
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          setter.call(input, "ROOM B-202");
          input.dispatchEvent(new Event("input", { bubbles:true }));
          const saveBtn = Array.from(document.querySelectorAll("button")).find(b => /Save text/i.test(b.textContent||""));
          if (saveBtn) saveBtn.click();
          else input.dispatchEvent(new KeyboardEvent("keydown", { key:"Enter", bubbles:true }));
          await new Promise(r => setTimeout(r, 400));
          const savePdf = Array.from(document.querySelectorAll("button")).find(b => /Save edited PDF/i.test(b.textContent||""));
          return { ok:true, regions: candidates.length, saveEnabled: !!(savePdf && !savePdf.disabled), saveLabel: savePdf && savePdf.textContent };
        })()
        """)
        print("TYPED:", typed)
        assert typed and typed.get("ok"), typed

        # 5) Export / Done sheet
        saved = await evaluate("""
        (async () => {
          const btn = Array.from(document.querySelectorAll("button")).find(b => /Save edited PDF/i.test(b.textContent||""));
          if (!btn) return { ok:false, err:"no-save" };
          if (btn.disabled) return { ok:false, err:"disabled", text: btn.textContent };
          btn.click();
          return { ok:true };
        })()
        """)
        print("SAVE_CLICK:", saved)
        assert saved and saved.get("ok"), saved

        sheet = False
        last = None
        for i in range(50):
            await asyncio.sleep(0.6)
            state = await evaluate("""
            (() => {
              const sheet = !!document.querySelector(".mobile-result-sheet");
              const share = !!Array.from(document.querySelectorAll("button")).find(b => /^Share$/i.test((b.textContent||"").trim()));
              const saveFiles = !!Array.from(document.querySelectorAll("button")).find(b => /Save to Files/i.test(b.textContent||""));
              return { sheet, share, saveFiles, work: !!document.querySelector(".mobile-work-bar"), snip: document.body.innerText.slice(0, 220) };
            })()
            """)
            last = state
            if i % 5 == 0:
                print(f"savewait[{i}]", state)
            if state and state.get("sheet") and state.get("share") and state.get("saveFiles"):
                sheet = True
                break
        print("DONE_SHEET:", sheet, last)
        assert sheet, last
        print("EMULATOR_FLOW_OK")

asyncio.run(main())
