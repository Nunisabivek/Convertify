(() => {
  const a = [...document.querySelectorAll("a")].find(e => (e.getAttribute("href")==="/compress-pdf"));
  if (a) { a.click(); return "clicked-compress"; }
  return "not-found";
})()
