(() => {
  const baseInput = document.querySelector('#base-url');
  const grid = document.querySelector('.qr-grid');
  const warning = document.querySelector('#file-warning');
  const printButton = document.querySelector('#print-cards');
  const generateButton = document.querySelector('#generate-cards');
  const deployedBase = 'https://frgnd7nf58-jpg.github.io/positive-pins/advent/';
  const inferred = new URL('../', location.href);
  baseInput.value = location.protocol === 'file:' ? deployedBase : inferred.href;
  if (location.protocol === 'file:') warning.hidden = false;

  function normalize(value) {
    const url = new URL(value);
    if (!url.pathname.endsWith('/')) url.pathname += '/';
    return url.href;
  }
  function generate() {
    let base;
    try { base = normalize(baseInput.value.trim()); }
    catch { baseInput.setCustomValidity('Enter a complete address beginning with https:// or http://'); baseInput.reportValidity(); return; }
    baseInput.setCustomValidity('');
    grid.innerHTML = '';
    window.DAY_LINKS.forEach(item => {
      const url = new URL(`d/${item.slug}/`, base).href;
      const card = document.createElement('article');
      card.className = 'qr-card';
      const title = document.createElement('h2'); title.textContent = `Day ${item.day}`;
      const code = document.createElement('div'); code.className = 'qr-code';
      const label = document.createElement('p'); label.textContent = url;
      card.append(title, code, label); grid.appendChild(card);
      new QRCode(code, {text: url, width: 220, height: 220, colorDark: '#111111', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M});
    });
  }
  generateButton.addEventListener('click', generate);
  printButton.addEventListener('click', () => window.print());
  generate();
})();
