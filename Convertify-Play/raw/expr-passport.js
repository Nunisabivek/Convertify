(() => {
  const a = [...document.querySelectorAll("a")].find(e => (e.getAttribute("href")==="/passport-photo"));
  if (a) { a.click(); return "clicked-passport"; }
  return "not-found";
})()
