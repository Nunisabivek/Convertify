(() => {
  const i = document.querySelector('input[type=search]');
  if (!i) return 'no search';
  const set = (v) => {
    const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    proto.set.call(i, v);
    i.dispatchEvent(new Event('input', { bubbles: true }));
    i.dispatchEvent(new Event('change', { bubbles: true }));
  };
  return { value: i.value, placeholder: i.placeholder };
})()
