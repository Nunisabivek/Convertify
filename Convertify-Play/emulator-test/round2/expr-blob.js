(async () => {
  const img = document.querySelector("img");
  let blobSize = null;
  try {
    const b = await fetch(img.src).then(r => r.blob());
    blobSize = b.size;
  } catch (e) { blobSize = String(e); }
  const parent = img ? img.parentElement : null;
  function chain(el) {
    const parts = [];
    while (el && parts.length < 8) {
      parts.push((el.tagName || "") + "." + (el.className || "").toString().slice(0,40));
      el = el.parentElement;
    }
    return parts;
  }
  return {
    blobSize,
    natural: [img.naturalWidth, img.naturalHeight],
    parentChain: chain(parent),
    imgClass: img.className,
    alt: img.alt,
  };
})()
