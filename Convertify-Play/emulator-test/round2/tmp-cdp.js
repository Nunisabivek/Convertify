const fs = require("fs");
const wsUrl = process.argv[2];
const expr = fs.readFileSync(process.argv[3], "utf8");
const ws = new WebSocket(wsUrl);
let id = 0;
const pending = new Map();
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const i = ++id;
    pending.set(i, { resolve, reject });
    ws.send(JSON.stringify({ id: i, method, params }));
    setTimeout(() => {
      if (pending.has(i)) {
        pending.delete(i);
        reject(new Error("timeout " + method));
      }
    }, 15000);
  });
}
ws.onopen = async () => {
  try {
    await send("Runtime.enable");
    const r = await send("Runtime.evaluate", {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) {
      console.error("EXC", JSON.stringify(r.exceptionDetails, null, 2));
      process.exit(1);
    }
    console.log(JSON.stringify(r.result.value, null, 2));
    ws.close();
  } catch (e) {
    console.error(String(e));
    process.exit(1);
  }
};
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve } = pending.get(msg.id);
    pending.delete(msg.id);
    resolve(msg.result || msg);
  }
};
ws.onerror = (e) => {
  console.error("ws error", e.message || e);
  process.exit(1);
};
