const icon = document.getElementById('icon');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const img3 = document.getElementById('img3');

// step 1: hover over icon -> show img1
icon.addEventListener('mouseenter', () => {
  img1.style.opacity = 1;
});

// step 2: hover over img1 -> show img2
img1.addEventListener('mouseenter', () => {
  img2.style.opacity = 1;
});

// step 3: hover over img2 -> show img3 + flash background
img2.addEventListener('mouseenter', () => {
  img3.style.opacity = 1;
  startFlash();
});

// subtle flashing background
function startFlash() {
  let colors = ['#ff5722', '#ff9800', '#f5e9ff']; // orange, red, calm reset
  let i = 0;
  let flash = setInterval(() => {
    document.body.style.backgroundColor = colors[i % colors.length];
    i++;
    if (i > 6) { // about two cycles then stop
      clearInterval(flash);
      document.body.style.backgroundColor = '#f5e9ff';
    }
  }, 250); // controlled pace (¼ second per change)
}
