(() => {
  const save = [...document.querySelectorAll("button")].find(x => x.innerText.trim() === "Save to Files");
  if (save) { save.click(); return "clicked Save"; }
  return "no Save";
})()
