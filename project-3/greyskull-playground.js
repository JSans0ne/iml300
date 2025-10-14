// Greyskull Playground
// Mode 1 – Color-changing ball with dreamy trail
// Mode 2 – Paw prints that fade slowly
// (Mode 3 coming soon)

let mode = 1;
let bgColorA, bgColorB;
let t = 0;
let hueShift = 0;
let trail = [];
let pawPrints = [];
let lastPawTime = 0;
let sparkles = [];


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
    fill(ballColor);
    ellipse(mouseX, mouseY, 60, 60);

    // add trail pieces
    trail.push({ x: mouseX, y: mouseY, hue: hueShift, life: 50 });
    for (let i = trail.length - 1; i >= 0; i--) {
      let p = trail[i];
      fill(p.hue, 80, 100, map(p.life, 0, 50, 0, 100));
      ellipse(p.x, p.y, 40, 40);
      p.life--;
      if (p.life <= 0) trail.splice(i, 1);
    }
  }

    // --- Mode 2: Paw prints walking (black, smoother, directional) ---
  if (mode === 2) {
    // measure mouse movement direction
    let dx = mouseX - pmouseX;
    let dy = mouseY - pmouseY;
    let angle = atan2(dy, dx);

    // add a new paw print every 300 ms (slower, steadier)
    if (millis() - lastPawTime > 300) {
      pawPrints.push({
        x: mouseX,
        y: mouseY,
        life: 300, // fade more slowly (~3 sec)
        rotation: angle
      });
      lastPawTime = millis();
    }

    // draw paw prints
    for (let i = pawPrints.length - 1; i >= 0; i--) {
      let p = pawPrints[i];
      push();
      translate(p.x, p.y);
      rotate(p.rotation);
      drawPaw(map(p.life, 0, 300, 0, 100)); // fade alpha
      pop();
      p.life--;
      if (p.life <= 0) pawPrints.splice(i, 1);
    }
  }
     // --- Mode 3: Sparkle bursts on click ---
  if (mode === 3) {
    // create bursts when mouse is pressed
    if (mouseIsPressed) {
      makeSparkleBurst(mouseX, mouseY);
    }

    // draw and update sparkles
    for (let i = sparkles.length - 1; i >= 0; i--) {
      let s = sparkles[i];
      fill(s.hue, 40, 100, map(s.life, 0, 180, 0, 100));
      noStroke();
      ellipse(s.x, s.y, s.size, s.size);
      s.x += s.vx; // move outward
      s.y += s.vy;
      s.vy -= 0.02; // slight float upward over time
      s.size += s.growth; // expand slightly
      s.life--;
      if (s.life <= 0) sparkles.splice(i, 1);
    }
  }
}

// --- simple paw shape made of 5 ellipses ---
function drawPaw(alphaVal) {
  fill(0, 0, 0, alphaVal); // black paw with variable transparency
  noStroke();
  
  // main pad
  ellipse(0, 0, 32, 26);
  
  // toes (slightly repositioned for natural spacing)
  ellipse(-14, -22, 12, 12);
  ellipse(-4, -26, 12, 12);
  ellipse(6, -26, 12, 12);
  ellipse(16, -22, 12, 12);
}

function makeSparkleBurst(x, y) {
  for (let i = 0; i < 20; i++) {
    let angle = random(TWO_PI);
    let speed = random(1, 4);
    sparkles.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(4, 8),
      growth: random(0.1, 0.3),
      life: 180,
      hue: random(200, 320)
    });
  }
}


function keyPressed() {
  if (key === '1') mode = 1;
  else if (key === '2') mode = 2;
  else if (key === '3') mode = 3;
  else mode = 1; // any other key returns to ball mode
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
