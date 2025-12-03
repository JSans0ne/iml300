console.log("sphere.js loaded");

// =======================
// THREE.JS SETUP
// =======================
const canvas = document.getElementById("sphereCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 3;

const scene = new THREE.Scene();

// LIGHTING
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(2, 2, 2);
scene.add(directional);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// SPHERE
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.2,
  metalness: 0.1
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.y = -0.7;
scene.add(sphere);

// RESIZE
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();

// =======================
// ML5 SENTIMENT MODEL
// =======================
let sentimentModel = null;

window.addEventListener("load", () => {
  ml5.sentiment("MovieReviews").then(model => {
    console.log("Sentiment model loaded");
    sentimentModel = model;
  });
});

// =======================
// KEYWORD FIX
// =======================
const negativeKeywords = [
  "mad", "angry", "sad", "upset", "hurt",
  "overwhelmed", "tired", "stressed", "anxious",
  "frustrated", "depressed", "lonely", "scared",
  "hopeless", "miserable", "awful", "terrible"
];

// =======================
// HIGH-INTENSITY SENTIMENT COLORS
// =======================
const sentimentColors = {
  veryLow:  new THREE.Color("#6A00FF"),  // neon violet
  low:      new THREE.Color("#005CFF"),  // neon blue
  neutral:  new THREE.Color("#FFF95E"),  // bright yellow
  positive: new THREE.Color("#5CFF8A"),  // neon green
  veryHigh: new THREE.Color("#FF4FF8")   // neon pink
};

// =======================
// SENTIMENT MESSAGES
// =======================
const sentimentMessages = {
  veryLow:
    "It sounds like things may feel heavy today.<br><br>What comes next is for you alone.",

  low:
    "There might be a bit on your mind.<br><br>What comes next is for you alone.",

  neutral:
    "You seem to be in a steady place.<br><br>What comes next is for you alone.",

  positive:
    "You seem to be doing well today.<br><br>What comes next is for you alone.",

  veryHigh:
    "You seem to have a lightness with you today.<br><br>What comes next is for you alone."
};

// =======================
// UI ELEMENTS
// =======================
const input = document.getElementById("sentimentInput");
const button = document.getElementById("sentimentBtn");
const box = document.getElementById("responseBox");
const textBox = document.getElementById("responseText");
const portalRing = document.getElementById("portalRingContainer");

// =======================
// SENTIMENT HANDLER
// =======================
button.addEventListener("click", async () => {
  if (!sentimentModel) {
    console.log("Model not ready");
    return;
  }

  const text = input.value.trim();
  if (!text) return;

  // RUN ML5 MODEL
  let result = await sentimentModel.predict(text);
  let score = result.confidence;

  const lower = text.toLowerCase();

  // KEYWORD OVERRIDE
  for (let word of negativeKeywords) {
    if (lower.includes(word)) {
      score = Math.min(score, 0.25);
      break;
    }
  }

  console.log("Adjusted Sentiment Score:", score);

  // DETERMINE CATEGORY
  let chosenColor;
  let chosenMessage;

  if (score <= 0.20) {
    chosenColor = sentimentColors.veryLow;
    chosenMessage = sentimentMessages.veryLow;
  } else if (score <= 0.40) {
    chosenColor = sentimentColors.low;
    chosenMessage = sentimentMessages.low;
  } else if (score <= 0.60) {
    chosenColor = sentimentColors.neutral;
    chosenMessage = sentimentMessages.neutral;
  } else if (score <= 0.80) {
    chosenColor = sentimentColors.positive;
    chosenMessage = sentimentMessages.positive;
  } else {
    chosenColor = sentimentColors.veryHigh;
    chosenMessage = sentimentMessages.veryHigh;
  }

  // APPLY COLOR
  material.color.lerp(chosenColor, 0.5);
  material.emissive.copy(chosenColor);
  material.emissiveIntensity = 1.2;

  // SHOW PROMPT BOX
  textBox.innerHTML = chosenMessage;
  box.classList.remove("hidden");
  requestAnimationFrame(() => {
    box.classList.add("show");
  });

  // SHOW PORTAL RING
 portalRing.classList.remove("hidden");
portalRing.classList.add("show");  // fade in

});

// =======================
// PORTAL RING CLICK → WALK
// =======================
portalRing.onclick = () => {
  window.location.href = "walk3d.html";
};
