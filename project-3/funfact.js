// ===== FUNFACT RANDOM SCATTER + ENLARGE =====

// CONFIG: how close to stay from edges (in pixels)
const EDGE_MARGIN = 100;

window.addEventListener("DOMContentLoaded", () => {
  const funfacts = document.querySelectorAll(".funfact");
  const positions = [];

  /// ===== RANDOM NON-OVERLAPPING PLACEMENT =====
funfacts.forEach((img) => {
  let x, y, overlap;

  do {
    overlap = false;
    const maxX = window.innerWidth - 180 - EDGE_MARGIN;
    const maxY = window.innerHeight - 180 - EDGE_MARGIN;

    x = EDGE_MARGIN + Math.random() * maxX;
    y = EDGE_MARGIN + Math.random() * maxY;

    for (const p of positions) {
      const dx = p.x - x;
      const dy = p.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 200) {
        overlap = true;
        break;
      }
    }
  } while (overlap);

  positions.push({ x, y });
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;

  // remember original position
  img.dataset.originalLeft = `${x}px`;
  img.dataset.originalTop = `${y}px`;
});


 // ===== CLICK TO ENLARGE (RE-CENTERED) =====
funfacts.forEach((img) => {
  img.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".funfact").forEach((f) => {
      f.classList.remove("active");
      f.style.left = f.dataset.originalLeft; // restore original position
      f.style.top = f.dataset.originalTop;
    });

    // center this clicked image
    img.classList.add("active");
    img.style.left = "50%";
    img.style.top = "50%";
  });
});

  // ===== CLICK OUTSIDE OR ESC TO CLOSE =====
  document.addEventListener("click", () => {
    document.querySelectorAll(".funfact").forEach((f) => f.classList.remove("active"));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".funfact").forEach((f) => f.classList.remove("active"));
    }
  });
});
