(() => {
  const i = document.querySelector('input[type=search]');
  const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  proto.set.call(i, 'compress');
  i.dispatchEvent(new Event('input', { bubbles: true }));
  return { value: i.value, results: document.body.innerText.slice(0, 700) };
})()
