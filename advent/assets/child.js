(() => {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  const cards = [...gallery.querySelectorAll('.instruction-card')];
  const current = document.querySelector('[data-current]');
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  const dots = document.querySelector('.dots');
  let index = 0;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to instruction ${i + 1}`);
    dot.addEventListener('click', () => cards[i].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'}));
    dots.appendChild(dot);
  });

  const render = () => {
    current.textContent = String(index + 1);
    prev.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    [...dots.children].forEach((dot, i) => dot.classList.toggle('active', i === index));
  };
  const go = (newIndex) => cards[Math.max(0, Math.min(cards.length - 1, newIndex))].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    index = cards.indexOf(visible.target);
    render();
  }, {root: gallery, threshold: [.55, .75]});
  cards.forEach(card => observer.observe(card));
  render();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('../../sw.js').catch(() => {});
  }
})();
