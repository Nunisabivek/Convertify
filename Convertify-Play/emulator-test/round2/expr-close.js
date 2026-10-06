(() => {
  const b = [...document.querySelectorAll("button")].find(x => x.innerText.trim() === "Close");
  if (b) { b.click(); return "clicked Close"; }
  return "no Close";
})()
