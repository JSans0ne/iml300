// Cat paw prints only (isolated from greyskull-playground.js)
// Designed for overlay use on the text-bump page.

new p5((p) => {
  let pawPrints = [];
  let lastPawTime = 0;

  p.setup = () => {
    const c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.style("position", "fixed");
    c.style("top", "0");
    c.style("left", "0");
    c.style("z-index", "2");           // above text
    c.style("pointer-events", "none"); // mouse passes through
    p.noStroke();
    p.clear();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.clear(); // transparent background

    // track mouse movement direction
    const dx = p.mouseX - p.pmouseX;
    const dy = p.mouseY - p.pmouseY;
    const angle = Math.atan2(dy, dx);

    // add new paw every 300 ms
    if (p.millis() - lastPawTime > 300) {
      pawPrints.push({
        x: p.mouseX,
        y: p.mouseY,
        life: 180,   // fades in ~3 s
        rotation: angle,
      });
      lastPawTime = p.millis();
    }

    // draw paw prints and fade them out
    for (let i = pawPrints.length - 1; i >= 0; i--) {
      const pPrint = pawPrints[i];
      p.push();
      p.translate(pPrint.x, pPrint.y);
      p.rotate(pPrint.rotation);
      drawPaw(p, p.map(pPrint.life, 0, 180, 0, 255)); // alpha
      p.pop();

      pPrint.life--;
      if (pPrint.life <= 0) pawPrints.splice(i, 1);
    }
  };

  function drawPaw(p, alphaVal) {
    p.fill(0, alphaVal);
    p.noStroke();

    // main pad
    p.ellipse(0, 0, 32, 26);
    // toes
    p.ellipse(-14, -22, 12, 12);
    p.ellipse(-4, -26, 12, 12);
    p.ellipse(6, -26, 12, 12);
    p.ellipse(16, -22, 12, 12);
  }
});
