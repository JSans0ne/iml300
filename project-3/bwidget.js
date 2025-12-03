/* =========================================================
   WALK PAGE — BREATH WIDGET (P5.js)
   ========================================================= */

// This flag is provided by walk3d.html
// If it's missing, default to false to avoid errors
let isWalkPageActive = (typeof isWalkPage !== "undefined") ? isWalkPage : false;

let isBreathing = false;
let innerSize = 40;
let grow = true;

function setup() {
  if (!isWalkPageActive) return;

  // Attach canvas to the CORRECT container
  const canvas = createCanvas(250, 250);
  canvas.parent("breathing-widget-container");

  textAlign(CENTER, CENTER);
  textSize(20);
}

function draw() {
  if (!isWalkPageActive) return;

  // For now, keep widget fully visible
  document.getElementById("breathing-widget-container").style.opacity = 1;

  background(255);

  // Outer circle
  noFill();
  stroke(0);
  strokeWeight(2);
  circle(width / 2, height / 2, 200);

  // Inner circle (breathing pulse)
  fill(200);
  noStroke();
  circle(width / 2, height / 2, innerSize);

  // Before click, show "click"
  if (!isBreathing) {
    fill(0);
    text("click", width / 2, height / 2);
  }

  // Pulse animation
  if (isBreathing) {
    if (grow) {
      innerSize += 0.75;
      if (innerSize >= 180) grow = false;
    } else {
      innerSize -= 0.75;
      if (innerSize <= 40) grow = true;
    }
  }
}

function mousePressed() {
  if (!isWalkPageActive) return;

  // Only activate if click is inside the widget canvas
  if (mouseX >= 0 && mouseX <= width &&
      mouseY >= 0 && mouseY <= height) {
    isBreathing = true;
  }
}
