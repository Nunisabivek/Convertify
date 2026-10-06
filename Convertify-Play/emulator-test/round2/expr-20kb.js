(() => {
  const i = document.querySelector('input[type=search]');
  const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  proto.set.call(i, '20kb');
  i.dispatchEvent(new Event('input', { bubbles: true }));
  i.dispatchEvent(new Event('change', { bubbles: true }));
  return { value: i.value, results: document.body.innerText.slice(0, 500) };
})()
