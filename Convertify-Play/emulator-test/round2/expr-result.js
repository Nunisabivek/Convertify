(() => {
  const imgs = [...document.querySelectorAll("img, canvas")].map(el => {
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      src: (el.src || "").slice(0, 160),
      alt: el.alt,
      naturalW: el.naturalWidth || el.width,
      naturalH: el.naturalHeight || el.height,
      cssW: Math.round(r.width),
      cssH: Math.round(r.height),
      t: Math.round(r.top * devicePixelRatio),
      vis: r.width > 0 && r.height > 0,
    };
  });
  return { imgs, text: document.body.innerText.slice(0, 700), url: location.href };
})()
