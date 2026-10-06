(() => {
  const dpr = window.devicePixelRatio;
  const items = [];
  document.querySelectorAll("a, button, [role=button], input, label, select").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    items.push({
      tag: el.tagName,
      type: el.getAttribute("type"),
      text: (el.innerText || el.getAttribute("aria-label") || el.placeholder || "").trim().slice(0, 120),
      href: el.getAttribute("href"),
      x: Math.round((r.left + r.width/2) * dpr),
      y: Math.round((r.top + r.height/2) * dpr),
      t: Math.round(r.top * dpr),
      h: Math.round(r.height * dpr),
      w: Math.round(r.width * dpr),
    });
  });
  return { href: location.href, title: document.title, body: document.body.innerText.slice(0, 1200), items };
})()
