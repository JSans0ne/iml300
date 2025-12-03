console.log("sphere_after.js loaded");

// ============================
//        THREE.JS SETUP
// ============================
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

// LIGHTS
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(2, 2, 2);
scene.add(directional);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// SPHERE
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.15,
  metalness: 0.1
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.y = -0.4;
scene.add(sphere);

// RESIZE
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ANIMATE
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.0045;
  renderer.render(scene, camera);
}
animate();

// ============================
//        UI ELEMENTS
// ============================
const followUpText = document.getElementById("followUpText");
const followUpBtn = document.getElementById("followUpBtn");
const followUpBtnText = document.getElementById("followUpBtnText");

// Colors for transitions
const colorYes = new THREE.Color("#fff44f");  // bright yellow
const colorNo  = new THREE.Color("#9fd2ff");  // soft blue

// ============================
//          YES BUTTON
// ============================
document.getElementById("betterYesBtn").onclick = () => {
  material.color.lerp(colorYes, 0.6);

  followUpText.classList.remove("hidden");
  followUpText.innerHTML =
    "I’m really glad to hear that.<br><br>Would you like to return home?";

  followUpBtnText.textContent = "Return home";
  followUpBtn.classList.remove("hidden");

  followUpBtn.onclick = () => {
    window.location.href = "index.html";
  };
};

// ============================
//          NO BUTTON
// ============================
document.getElementById("betterNoBtn").onclick = () => {
  material.color.lerp(colorNo, 0.6);

  followUpText.classList.remove("hidden");
  followUpText.innerHTML =
    "Thank you for being honest.<br><br>Would you like to take the walk again?";

  followUpBtnText.textContent = "Take the walk again";
  followUpBtn.classList.remove("hidden");

  followUpBtn.onclick = () => {
    window.location.href = "walk3d.html";
  };
};
