(() => {
  const html = document.documentElement.innerHTML;
  return {
    href: location.href,
    title: document.title,
    text: document.body.innerText.slice(0, 2500),
    hasLocalhost: /localhost/i.test(html) || /localhost/i.test(document.body.innerText),
    hasCapacitor: /capacitor/i.test(html) || /capacitor/i.test(document.body.innerText),
    hasDebug: /debug/i.test(document.body.innerText),
    has3000: /:3000/.test(html+document.body.innerText),
  };
})()
