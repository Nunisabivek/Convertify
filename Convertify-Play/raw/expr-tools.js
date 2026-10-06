(() => {
  const a = [...document.querySelectorAll("a")].find(e => (e.getAttribute("href")==="/all-tools") && /^Tools$/i.test((e.innerText||"").trim()));
  if (a) { a.click(); return "clicked-tools-nav"; }
  const b = [...document.querySelectorAll("a")].find(e => (e.getAttribute("href")==="/all-tools"));
  if (b) { b.click(); return "clicked-all-tools"; }
  return "not-found";
})()
