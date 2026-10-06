(() => {
  const a = [...document.querySelectorAll("a")].find(e => e.getAttribute("href")==="/" && /Home/i.test(e.innerText||""));
  if (a) { a.click(); return "clicked-home"; }
  location.href = "/";
  return "fallback-home";
})()
