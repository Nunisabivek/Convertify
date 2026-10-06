(() => {
  const dpr = window.devicePixelRatio;
  const items = [];
  document.querySelectorAll("a, button, [role=button]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    items.push({
      tag: el.tagName,
      text: (el.innerText || el.getAttribute("aria-label") || "").trim().replace(/\s+/g," ").slice(0,80),
      href: el.getAttribute("href"),
      x: Math.round((r.left + r.width/2) * dpr),
      y: Math.round((r.top + r.height/2) * dpr),
    });
  });
  return { href: location.href, title: document.title, body: (document.body.innerText||"").slice(0,800), items };
})()
