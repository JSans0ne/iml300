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
let toy = null;
let burstCount = 0; // tracks how many bursts have been made



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

   // --- Mode 2: Three Hanging Cat Toys (short-left, long-center, medium-right) ---
if (mode === 2) {
  if (!this.toys) {
    this.toys = [
      {   // short red — left
        x: width * 0.55,
        y: height * 0.45,
        baseY: height * 0.45,
        color: color(0, 90, 100),
        swingAmp: 60,
        swingSpeed: 0.05,
        sparkCooldown: 0
      },
      {   // long blue — center
        x: width * 0.75,
        y: height * 0.75,
        baseY: height * 0.75,
        color: color(210, 80, 100),
        swingAmp: 100,
        swingSpeed: 0.035,
        sparkCooldown: 0
      },
      {   // medium yellow — right
        x: width * 0.9,
        y: height * 0.6,
        baseY: height * 0.6,
        color: color(50, 100, 100),
        swingAmp: 80,
        swingSpeed: 0.04,
        sparkCooldown: 0
      }
    ];
  }

  for (let toy of this.toys) {
    toy.angle = (toy.angle || 0) + toy.swingSpeed;
    toy.y = toy.baseY + sin(toy.angle * 3) * 20;
    toy.x += sin(toy.angle) * 0.5;

    let d = dist(mouseX, mouseY, toy.x, toy.y);
    if (d < 80 && mouseIsPressed) {
      toy.swingAmp = 100;
      toy.swingSpeed = 0.1;
      toy.sparkCooldown = 5;
    } else {
      toy.swingAmp = lerp(toy.swingAmp, 60, 0.05);
      toy.swingSpeed = lerp(toy.swingSpeed, 0.05, 0.05);
    }

    // string
    stroke(0, 0, 20);
    strokeWeight(2);
    line(toy.x, 0, toy.x, toy.y);

    // ball
    noStroke();
    fill(toy.color);
    ellipse(toy.x, toy.y, 50, 50);

    // sparkles
    if (toy.sparkCooldown > 0) {
      toy.sparkCooldown--;
      for (let i = 0; i < 5; i++) {
        sparkles.push({
          x: toy.x,
          y: toy.y,
          vx: random(-1.5, 1.5),
          vy: random(-1.5, 1.5),
          size: random(3, 5),
          life: 40,
          hue: random(0, 60)
        });
      }
    }
  }

  // sparkle updates
  for (let i = sparkles.length - 1; i >= 0; i--) {
    let s = sparkles[i];
    fill(s.hue, 50, 100, map(s.life, 0, 40, 0, 100));
    noStroke();
    ellipse(s.x, s.y, s.size);
    s.x += s.vx;
    s.y += s.vy;
    s.life--;
    if (s.life <= 0) sparkles.splice(i, 1);
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
  burstCount++; // count each burst
  let warmBurst = burstCount % 2 === 0; // even bursts are warm

  console.log("Burst:", burstCount, warmBurst ? "🔥 Warm" : "❄️ Cool");

  for (let i = 0; i < 20; i++) {
    let angle = random(TWO_PI);
    let speed = random(1, 4);

    // pick hue range based on burst type
    let hueVal = warmBurst ? random(25, 60) : random(200, 320);
    let satVal = warmBurst ? 90 : 50; // warmer bursts are more saturated
    let brightVal = warmBurst ? 100 : 80;

    sparkles.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(4, 8),
      growth: random(0.1, 0.3),
      life: 180,
      hue: hueVal,
      sat: satVal,
      bright: brightVal
    });
  }
}



function keyPressed() {
  console.log("Key pressed:", key, "Mode now =", mode);
  if (key === '1') mode = 1;
  else if (key === '2') {
    mode = 2;
    toy = null;   // reset toy globally
  }
  else if (key === '3') mode = 3;
  else mode = 1;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
