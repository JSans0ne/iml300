// Greyskull Playground - Mode 1 Enhanced
// Ball cursor changes color + leaves fading trail

let mode = 1;
let bgColorA, bgColorB;
let t = 0;
let hueShift = 0;
let trail = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  colorMode(HSB, 360, 100, 100);
  bgColorA = color(random(360), 30, 100);
  bgColorB = color(random(360), 30, 100);
}

function draw() {
  // --- smooth pastel background ---
  t += 0.002;
  if (t >= 1) {
    t = 0;
    bgColorA = bgColorB;
    bgColorB = color(random(360), 30, 100);
  }
  let bg = lerpColor(bgColorA, bgColorB, t);
  background(bg);

  // --- Mode 1: Ball cursor toy with trail ---
  if (mode === 1) {
    hueShift = (hueShift + 1) % 360;
    let ballColor = color(hueShift, 80, 100);
    noStroke();

    // draw current ball
    fill(ballColor);
    ellipse(mouseX, mouseY, 60, 60);

    // add to trail
    trail.push({ x: mouseX, y: mouseY, hue: hueShift, life: 50 });

    // draw fading trail
    for (let i = trail.length - 1; i >= 0; i--) {
      let p = trail[i];
      fill(p.hue, 80, 100, map(p.life, 0, 50, 0, 100));
      ellipse(p.x, p.y, 40, 40);
      p.life--;
      if (p.life <= 0) trail.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key === '1') {
    mode = 1; // fun ball mode
  } else if (key === '2') {
    mode = 2; // (we'll add paw prints soon)
  } else if (key === '3') {
    mode = 3; // (we'll add sparkles soon)
  } else {
    mode = 1; // any other key returns to ball mode
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
