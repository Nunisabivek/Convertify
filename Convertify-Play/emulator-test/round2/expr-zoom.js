(() => {
  const dpr = window.devicePixelRatio;
  const out = [];
  const walk = (el) => {
    const txt = (el.innerText || "").trim();
    if (txt === "Zoom and size" || txt === "Make photo" || (el.tagName === "CANVAS") || el.getAttribute("aria-label")) {
      const r = el.getBoundingClientRect();
      out.push({
        tag: el.tagName,
        cls: (el.className || "").toString().slice(0,80),
        text: txt.slice(0,80),
        aria: el.getAttribute("aria-label"),
        x: Math.round((r.left + r.width/2) * dpr),
        y: Math.round((r.top + r.height/2) * dpr),
        t: Math.round(r.top * dpr),
        h: Math.round(r.height * dpr),
        w: Math.round(r.width * dpr),
      });
    }
    [...el.children].forEach(walk);
  };
  walk(document.body);
  const make = [...document.querySelectorAll("button")].find(b => b.innerText.trim() === "Make photo");
  let makeStyle = null;
  if (make) {
    const s = getComputedStyle(make);
    const r = make.getBoundingClientRect();
    makeStyle = {
      position: s.position,
      bottom: s.bottom,
      zIndex: s.zIndex,
      vis: r.bottom <= (window.innerHeight - 80),
      topCss: r.top,
      bottomCss: r.bottom,
      viewportH: window.innerHeight,
    };
  }
  return { href: location.href, makeStyle, out };
})()
