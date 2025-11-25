/* =========================================================
   GLOBAL FADE SETTINGS
   ========================================================= */

const fadeTime = 2000; // 2 seconds – adjust to change overall feel



/* =========================================================
   INDEX PAGE FADE SEQUENCE — FINAL
   ========================================================= */

$(document).ready(function () {

  // Only run on the index page
  if ($("#welcome-page").length) {

    // 1. Fade in WELCOME
    $("#welcome-title").fadeIn(fadeTime);

    // 2. Fade in SUBTITLE
    $("#welcome-sub")
      .delay(fadeTime * 0.8)
      .fadeIn(fadeTime);

    // 3. Fade in BUTTON after subtitle
    $("#walk-button-container")
      .delay(fadeTime * 1.6)
      .fadeIn(fadeTime);
  }

});



/* =========================================================
   WALK PAGE — BREATH WIDGET (P5.js)
   ========================================================= */

function isWalkPage() {
  return window.location.pathname.includes("walk.html");
}

let isBreathing = false;
let innerSize = 40;
let grow = true;

function setup() {
  if (!isWalkPage()) return;

  let canvas = createCanvas(250, 250);
  canvas.parent("breath-widget");

  textAlign(CENTER, CENTER);
  textSize(20);
}

function draw() {
  if (!isWalkPage()) return;

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

  // Before click
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
  if (!isWalkPage()) return;

  let insideCanvas =
    mouseX >= 0 && mouseX <= width &&
    mouseY >= 0 && mouseY <= height;

  if (insideCanvas) {
    isBreathing = true;
  }
}
