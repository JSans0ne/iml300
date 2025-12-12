// ============================================================
// SIMPLE, RELIABLE 8-COLOR GRADIENT BACKGROUND (NO MODULES)
// ============================================================

// Grab container
const container = document.getElementById("bg");

// Scene + camera (fullscreen quad via NDC)
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// ============================================================
// 8-COLOR PALETTE
// ============================================================
const COLORS = [
  new THREE.Color("#ff9a9e"), // pink
  new THREE.Color("#a1c4fd"), // sky blue
  new THREE.Color("#fbc2eb"), // lavender pink
  new THREE.Color("#fad0c4"), // soft orange
  new THREE.Color("#f6d365"), // yellow
  new THREE.Color("#96e6a1"), // green
  new THREE.Color("#84fab0"), // mint
  new THREE.Color("#8fd3f4")  // aqua blue
];

// ============================================================
// SHADER: SIMPLE VERTICAL GRADIENT
// ============================================================
const uniforms = {
  u_topColor:    { value: new THREE.Color("#ff9a9e") },
  u_bottomColor: { value: new THREE.Color("#f6d365") }
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 u_topColor;
  uniform vec3 u_bottomColor;
  varying vec2 vUv;

  void main() {
    vec3 color = mix(u_bottomColor, u_topColor, vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Fullscreen quad
const quad = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  })
);

scene.add(quad);

// ============================================================
// ANIMATION — COLOR CYCLING
// ============================================================
function animate(time) {
  // time is in ms → convert to seconds and scale for speed
  const seconds = time * 0.0003; // increase this for faster shifting

  const total = COLORS.length;

  // Where we are in the palette cycle
  const cycle = seconds % total;
  const indexBase = Math.floor(cycle);
  const indexNext = (indexBase + 1) % total;
  const blend = cycle - indexBase; // 0 → 1 between the two colors

  // Top color: between two palette colors
  const top = COLORS[indexBase].clone().lerp(COLORS[indexNext], blend);

  // Bottom color: darker version of top
  const bottom = top.clone().multiplyScalar(0.5);

  uniforms.u_topColor.value.copy(top);
  uniforms.u_bottomColor.value.copy(bottom);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// ============================================================
// HANDLE RESIZE
// ============================================================
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});
