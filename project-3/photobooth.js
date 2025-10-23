// ========== CAT PHOTO BOOTH (aligned live + photo) ==========

// Grab elements
const video = document.getElementById('cameraFeed');
const catOverlay = document.getElementById('catOverlay');
const curtainOverlay = document.getElementById('curtainOverlay');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const flashFrame = document.getElementById('flashFrame');
const photoPreview = document.getElementById('photoPreview');
const photoResult = document.getElementById('photoResult');
const downloadBtn = document.getElementById('downloadBtn');
const retakeBtn = document.getElementById('retakeBtn');
const snapshotCanvas = document.getElementById('snapshotCanvas');
// global offset for cat alignment (same for preview + saved photo)
const CAT_OFFSET_X = 50; // move right by 50px (tweak this number)


let currentCat = null;
let cameraStream = null;

// ======= EASY CAT POSITION CONTROLS =======
const CAT_WIDTH_RATIO = 0.45;   // size relative to video width
const CAT_X_OFFSET = 0.03;      // left offset (0 = flush left)
const CAT_Y_OFFSET = -0.00;     // vertical offset (- = lower)

// ========== 1. START CAMERA ==========
async function startCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    });
    video.srcObject = cameraStream;
  } catch (err) {
    alert('Camera access is required for the Cat Photo Booth.\n\nError: ' + err.message);
  }
}

// ========== 2. SELECT CAT OVERLAY (1–4) ==========
function selectCat(catSrc) {
  currentCat = catSrc;
  catOverlay.src = catSrc;
  catOverlay.style.display = 'block';

  // Position overlay based on the video element’s bounding box
  const rect = video.getBoundingClientRect();
  const catWidth = rect.width * CAT_WIDTH_RATIO;
  const catHeight = catOverlay.naturalHeight * (catWidth / catOverlay.naturalWidth || 1);

  catOverlay.style.position = 'absolute';
  catOverlay.style.width = `${CAT_WIDTH_RATIO * 100}%`;
  catOverlay.style.left = `${CAT_X_OFFSET * 100}%`;
  catOverlay.style.bottom = `${CAT_Y_OFFSET * 100}%`;
  catOverlay.style.objectFit = 'contain';
  catOverlay.style.zIndex = 2;
  catOverlay.style.pointerEvents = 'none';
}

// ========== 3. TAKE PHOTO (FLASH + SNAPSHOT) ==========
function takePhoto() {
  if (!video.videoWidth || !video.videoHeight) return;

  // flash animation
  flashFrame.classList.add('active');
  setTimeout(() => flashFrame.classList.remove('active'), 300);

  const canvas = snapshotCanvas;
  const ctx = canvas.getContext('2d');

  // fixed photo resolution (matches booth preview)
  const w = 1280;
  const h = 720;
  canvas.width = w;
  canvas.height = h;

  // --- Draw mirrored webcam feed WITHOUT stretching (object-fit: cover) ---
  const srcW = video.videoWidth;
  const srcH = video.videoHeight;
  const canvasW = w;
  const canvasH = h;
  const srcAspect = srcW / srcH;
  const canvasAspect = canvasW / canvasH;

  let sx, sy, sWidth, sHeight;

  if (srcAspect > canvasAspect) {
    // video wider → crop sides
    sHeight = srcH;
    sWidth = canvasAspect * sHeight;
    sx = (srcW - sWidth) / 2;
    sy = 0;
  } else {
    // video taller → crop top/bottom
    sWidth = srcW;
    sHeight = sWidth / canvasAspect;
    sx = 0;
    sy = (srcH - sHeight) / 2;
  }

  ctx.save();
  ctx.translate(canvasW, 0);
  ctx.scale(-1, 1); // mirror horizontally
  ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvasW, canvasH);
  ctx.restore();

  // --- Draw cat overlay (matches preview position) ---
  if (currentCat) {
    const catImg = new Image();
    catImg.onload = () => {
      const catWidth = w * CAT_WIDTH_RATIO;
      const catHeight = catImg.height * (catWidth / catImg.width);
      const catX = w * CAT_X_OFFSET + CAT_OFFSET_X; // horizontal offset for match
      const catY = h - catHeight + (h * CAT_Y_OFFSET);
      ctx.drawImage(catImg, catX, catY, catWidth, catHeight);

      drawCurtain(canvas, ctx, w, h);
    };
    catImg.src = currentCat;
  } else {
    drawCurtain(canvas, ctx, w, h);
  }
}

// --- Helper: Draw curtain overlay + show preview ---
function drawCurtain(canvas, ctx, w, h) {
  const curtainImg = new Image();
  curtainImg.onload = () => {
    ctx.drawImage(curtainImg, 0, 0, w, h);
    showPreview(canvas);
  };
  curtainImg.src = curtainOverlay.src;
}


// ========== 4. SHOW PREVIEW ==========
function showPreview(canvas) {
  const dataURL = canvas.toDataURL('image/png');
  photoResult.src = dataURL;
  document.querySelector('.booth-stage').style.display = 'none';
  photoPreview.style.display = 'flex';
}

// ========== 5. RETAKE ==========
function retakePhoto() {
  photoPreview.style.display = 'none';
  document.querySelector('.booth-stage').style.display = 'flex';
}

// ========== 6. DOWNLOAD ==========
function downloadPhoto() {
  const link = document.createElement('a');
  link.download = 'cat-photo.png';
  link.href = photoResult.src;
  document.body.appendChild(link);
  link.click();
  link.remove();
  retakePhoto();
}

// ========== EVENT LISTENERS ==========
takePhotoBtn.addEventListener('click', takePhoto);
retakeBtn.addEventListener('click', retakePhoto);
downloadBtn.addEventListener('click', downloadPhoto);

// Keyboard 1–4 cat selection
window.addEventListener('keydown', (e) => {
  const catMap = {
    '1': 'assets/catbooth1.png',
    '2': 'assets/catbooth2.png',
    '3': 'assets/catbooth3.png',
    '4': 'assets/catbooth4.png'
  };
  if (catMap[e.key]) selectCat(catMap[e.key]);
});

// ========== INIT ==========
startCamera().then(() => {
  catOverlay.style.display = 'none';
});
