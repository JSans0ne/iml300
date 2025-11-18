// ===========================
// SIMPLE BREATH WIDGET - WORKING
// ===========================

let isBreathing = false;
let innerSize = 40;
let grow = true;

function setup() {
  // Make a canvas inside the widget div
  let canvas = createCanvas(250, 250);
  canvas.parent("breath-widget");

  textAlign(CENTER, CENTER);
  textSize(20);
}

function draw() {
  background(255);

  // Outer circle
  noFill();
  stroke(0);
  strokeWeight(2);
  circle(width / 2, height / 2, 200);

  // Inner circle
  fill(200);
  noStroke();
  circle(width / 2, height / 2, innerSize);

  // BEFORE CLICK – show "click"
  if (!isBreathing) {
    fill(0);
    text("click", width / 2, height / 2);
  }

  // AFTER CLICK – pulse animation
  if (isBreathing) {
    if (grow) {
      innerSize += .75;
      if (innerSize >= 180) grow = false;
    } else {
      innerSize -= .75;
      if (innerSize <= 40) grow = true;
    }
  }
}

function mousePressed() {
  // Only activate if clicking inside the widget
  let insideCanvas =
    mouseX >= 0 && mouseX <= width &&
    mouseY >= 0 && mouseY <= height;

  if (insideCanvas) {
    isBreathing = true;
  }
}
window.addEventListener('scroll', () => {
  const start = document.getElementById("start");
  const widget = document.getElementById("breath-widget");

  const rect = start.getBoundingClientRect();

  // When the START section reaches halfway of the screen
  if (rect.top <= window.innerHeight * 0.5) {
    widget.classList.add("fixed");
  }
});
