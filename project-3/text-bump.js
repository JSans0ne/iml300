// Simple mouse-bump logic (no extra visuals)
const screen = document.getElementById('screen');
const paragraphs = screen.querySelectorAll('p');
const words = [];

// Wrap each word in a span so it can move
paragraphs.forEach(p => {
  const text = p.textContent.split(' ');
  p.innerHTML = text.map(w => `<span class="word">${w}</span>`).join(' ');
  words.push(...p.querySelectorAll('.word'));
});

document.addEventListener('mousemove', e => {
  words.forEach(word => {
    const rect = word.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      const offsetX = (Math.random() - 0.5) * window.innerWidth * 1.5;
      const offsetY = (Math.random() - 0.5) * window.innerHeight * 1.5;
      const rot = (Math.random() - 0.5) * 20;
      word.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rot}deg)`;

      clearTimeout(word.resetTimer);
      word.resetTimer = setTimeout(() => {
        word.style.transform = 'translate(0,0) rotate(0deg)';
      }, 2000);
    }
  });
});
