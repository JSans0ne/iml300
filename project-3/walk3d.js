/* =========================================================
   3D WALK EXPERIENCE — NATIVE AUDIO, CLEAN VERSION
   ========================================================= */

let walkStarted = false;

let scene, camera, renderer;
let t = -0.2;

const DURATION = 45;
const FPS = 60;
const SPEED_BASE = 1 / (DURATION * FPS);
const totalLength = 1000;

/* =========================================================
   ONE SOUNDTRACK — NATIVE HTML AUDIO
   ========================================================= */

let soundtrack = new Audio("assets/maintrack.mp3");
soundtrack.loop = true;
soundtrack.volume = 1;

/* =========================================================
   TUNNEL COLORS
   ========================================================= */
const sceneColors = [
  0xff0000, 0xff6600, 0xffcc00, 0x66cc00,
  0x00cc66, 0x0099cc, 0x0033cc,
  0x6600cc, 0xcc00cc,
  0xffffff
];

/* =========================================================
   SIMPLE GRADIENT SHADER
   ========================================================= */
const gradientShader = {
  uniforms: {
    u_opacity: { value: 0 },
    u_colorA: { value: new THREE.Color("#ec4513") },
    u_colorB: { value: new THREE.Color("#f7b81d") }
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform float u_opacity;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    varying vec2 vUv;

    void main() {
      vec3 color = mix(u_colorA, u_colorB, vUv.y);
      gl_FragColor = vec4(color, u_opacity);
    }
  `
};

let gradientPlane, gradientMaterial;

/* =========================================================
   INIT
   ========================================================= */
init();
animate();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("walk3d-container").appendChild(renderer.domElement);

  buildTunnel();

  /* GRADIENT PLANE */
  const planeGeo = new THREE.PlaneGeometry(4000, 2000);

  gradientMaterial = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(gradientShader.uniforms),
    vertexShader: gradientShader.vertexShader,
    fragmentShader: gradientShader.fragmentShader,
    transparent: true
  });

  gradientPlane = new THREE.Mesh(planeGeo, gradientMaterial);
  gradientPlane.position.set(0, 0, -(totalLength + 200));
  scene.add(gradientPlane);

  /* EXIT BUTTON */
  document.getElementById("exit-walk-btn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  /* START BUTTON */
  document.getElementById("start-circle").addEventListener("click", () => {

    soundtrack.currentTime = 0;
    soundtrack.play()
      .catch(err => console.log("Audio play blocked until gesture:", err));

    walkStarted = true;

    const overlay = document.getElementById("start-overlay");
    overlay.classList.add("start-hidden");
    overlay.style.pointerEvents = "none";
  });

  window.addEventListener("resize", onWindowResize);
}

/* =========================================================
   ANIMATION LOOP
   ========================================================= */
function animate() {
  requestAnimationFrame(animate);

  if (walkStarted) {

    t += SPEED_BASE;
    if (t > 1) t = 1;

    const camZ = -t * totalLength;
    camera.position.z = camZ;
    camera.lookAt(0, 0, camZ - 1);

    /* GRADIENT FADE (visual only) */
    if (t > 0.93) {
      let fade = (t - 0.93) / 0.07;
      fade = Math.min(Math.max(fade, 0), 1);

      gradientMaterial.uniforms.u_opacity.value = fade;
    }

    /* SOUNDTRACK FADE AFTER GRADIENT */
    if (t > 1.0) {
      let afade = (t - 1.0) / 0.10;
      afade = Math.min(Math.max(afade, 0), 1);

      soundtrack.volume = Math.max(1 - afade, 0);
    }

    /* SHOW END TEXT + BUTTON */
    if (t >= 1.0) {
      const endOverlay = document.getElementById("end-overlay");
      endOverlay.style.opacity = 1;
      endOverlay.style.pointerEvents = "auto";
    }
  }

  renderer.render(scene, camera);
}



/* =========================================================
   TUNNEL BUILDER
   ========================================================= */
function buildTunnel() {
  const sectionLength = totalLength / 10;

  for (let i = 0; i < 10; i++) {
    const zStart = -i * sectionLength;
    const zEnd = -(i + 1) * sectionLength;

    if (i < 4) buildHardShapes(zStart, zEnd, i);
    else if (i < 7) buildComplexShapes(zStart, zEnd, i);
    else if (i < 9) buildSoftShapes(zStart, zEnd, i);
  }
}

/* =========================================================
   HARD SHAPES
   ========================================================= */
function buildHardShapes(zStart, zEnd, sceneIndex) {
  const mat = new THREE.LineBasicMaterial({ color: sceneColors[sceneIndex] });

  for (let z = zStart; z > zEnd; z -= 20) {
    const size = 20;

    const verts = new Float32Array([
      -size, size, z,  size, size, z,
       size, size, z,  size,-size, z,
       size,-size, z, -size,-size, z,
      -size,-size, z, -size, size, z
    ]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));

    scene.add(new THREE.LineSegments(geo, mat));

    const diamond = new THREE.LineSegments(geo.clone(), mat);
    diamond.rotation.z = Math.PI / 4;
    scene.add(diamond);
  }
}

/* =========================================================
   COMPLEX SHAPES
   ========================================================= */
function buildComplexShapes(zStart, zEnd, sceneIndex) {
  const mat = new THREE.LineBasicMaterial({ color: sceneColors[sceneIndex] });

  for (let z = zStart; z > zEnd; z -= 25) {
    const size = 25;
    const inner = size * 0.5;
    const verts = [];

    verts.push(
      -size,size,z, size,size,z,
      size,size,z, size,-size,z,
      size,-size,z, -size,-size,z,
      -size,-size,z, -size,size,z
    );

    verts.push(
      -inner,inner,z, inner,inner,z,
      inner,inner,z, inner,-inner,z,
      inner,-inner,z, -inner,-inner,z,
      -inner,-inner,z, -inner,inner,z
    );

    verts.push(
      -size,-size,z, size,size,z,
      -size,size,z, size,-size,z
    );

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
    scene.add(new THREE.LineSegments(geo, mat));
  }
}

/* =========================================================
   SOFT SHAPES
   ========================================================= */
function buildSoftShapes(zStart, zEnd, sceneIndex) {
  const mat = new THREE.LineBasicMaterial({ color: sceneColors[sceneIndex] });

  for (let z = zStart; z > zEnd; z -= 30) {
    const radius = 20;
    const seg = 64;
    const verts = [];

    for (let i = 0; i < seg; i++) {
      const a1 = (i / seg) * Math.PI * 2;
      const a2 = ((i + 1) / seg) * Math.PI * 2;

      verts.push(
        Math.cos(a1) * radius, Math.sin(a1) * radius, z,
        Math.cos(a2) * radius, Math.sin(a2) * radius, z
      );
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
    scene.add(new THREE.LineSegments(geo, mat));
  }
}

/* =========================================================
   RESIZE HANDLER
   ========================================================= */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
