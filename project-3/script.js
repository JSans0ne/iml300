/* =========================================================
   GLOBAL FADE SETTINGS
   ========================================================= */
const fadeTime = 2000; // 2 seconds



/* =========================================================
   INDEX PAGE FADE SEQUENCE — FINAL
   (SAFE FOR index.html, DOES NOTHING ON walk.html)
   ========================================================= */
$(document).ready(function () {

  // Only run on the index page
  if ($("#welcome-page").length) {
    $("#welcome-title").fadeIn(fadeTime);

    $("#welcome-sub")
      .delay(fadeTime * 0.8)
      .fadeIn(fadeTime);

    $("#walk-button-container")
      .delay(fadeTime * 1.6)
      .fadeIn(fadeTime);
  }

  // WALK PAGE LOGIC
  if ($("body").hasClass("walk-page")) {
    initWalkPage();
  }
});



/* =========================================================
   WALK PAGE DETECTION (for p5)
   ========================================================= */
function isWalkPage() {
  return document.body.classList.contains("walk-page");
}



/* =========================================================
   WALK PAGE — INTERSECTION OBSERVER FADE SYSTEM
   ========================================================= */
function initWalkPage() {
  const scenes = document.querySelectorAll(".scene");

  // Scene fade in/out via IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active");
        }
      });
    },
    {
      root: null,
    threshold: 0.05,                // fade starts when 5% of scene is visible
    rootMargin: "0px 0px -40% 0px"  // triggers early for true crossfade
      
    }
  );

  scenes.forEach((scene) => observer.observe(scene));

  // Ensure first scene is visible on initial load
  if (scenes.length > 0) {
    scenes[0].classList.add("active");
  }

  // Final gradient text + button reveal
  $(window).on("scroll", function () {
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    const viewportCenter = scrollTop + windowHeight / 2;

    const $final = $("#final-gradient");
    if ($final.length) {
      const finalTop = $final.offset().top;
      const finalHeight = $final.outerHeight();

      // Reveal when viewport center is in lower ~70% of final section
      if (viewportCenter > finalTop + finalHeight * 0.3) {
        $("body.walk-page").addClass("show-final-text");
      } else {
        $("body.walk-page").removeClass("show-final-text");
      }
    }
  });
}



/* =========================================================
   WALK PAGE — BREATH WIDGET (P5.js)
   ========================================================= */
let isBreathing = false;
let innerSize = 40;
let grow = true;

function setup() {
  if (!isWalkPage()) return;

  const canvas = createCanvas(250, 250);
  canvas.parent("breath-widget");

  textAlign(CENTER, CENTER);
  textSize(20);
}

function draw() {
  if (!isWalkPage()) return;

  // Tie widget opacity to first scene (CITY) and clamp it
  const firstOpacityStr = $(".scene").first().css("opacity");
  const firstOpacity = parseFloat(firstOpacityStr) || 0;

  // Widget stays at least 40% visible, up to 100%
  const widgetOpacity = 0.4 + firstOpacity * 0.6;
  $("#breath-widget-container").css("opacity", widgetOpacity);

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

  // Before click, show simple prompt
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

  const insideCanvas =
    mouseX >= 0 && mouseX <= width &&
    mouseY >= 0 && mouseY <= height;

  if (insideCanvas) {
    isBreathing = true;
  }
}
