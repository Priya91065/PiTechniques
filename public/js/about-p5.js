(() => {
  // ------- CONFIG -------
 // Detect if mobile (below 767px)
const isMobileView = window.innerWidth < 767;

// Choose image based on device width
const IMG_PATH =
  (typeof BASE_URL !== 'undefined' ? BASE_URL : '') +
  (isMobileView
    ? 'images/banner-img/about-mobile.jpg'   // 👈 mobile image
    : 'images/banner-img/about-animation-banner.jpg');        // 👈 desktop image

  const DETAIL_LEVEL = 12;    // pixel step (lower = denser)
  const MIN_DOT_RADIUS = 0.1;
  const MAX_DOT_RADIUS = 4;
  const DOT_COLOR = '#F4F4F4';
  const HOVER_COLOR = '#F7941E';
  const DOT_OPACITY = 1;
  const FRAME_RATE = 35;
  const BRIGHTNESS_THRESHOLD = 10;
  // -----------------------

  // --- Minimal Vector Class ---
  class Vec {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    copy() { return new Vec(this.x, this.y); }
    add(v) { this.x += v.x; this.y += v.y; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; return this; }
    mult(n) { this.x *= n; this.y *= n; return this; }
    mag() { return Math.sqrt(this.x*this.x + this.y*this.y); }
    setMag(n) { const m = this.mag() || 0.0001; this.mult(n/m); return this; }
    limit(max){ if(this.mag()>max)this.setMag(max); return this; }
    static dist(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }
    static sub(a,b){ return new Vec(a.x-b.x,a.y-b.y); }
    static add(a,b){ return new Vec(a.x+b.x,a.y+b.y); }
  }

  // --- Helpers ---
  function map(value, inMin, inMax, outMin, outMax) {
    return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin || 1);
  }
  function hexToRgba(hex, alpha = 1) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // --- Canvas Setup ---
  const container = document.getElementById('canvas-container');
  if (!container) {
    console.error('Canvas container not found!');
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'home-imganimation-canvas';
  canvas.style.width = '100%';
  canvas.style.setProperty('height', container.offsetHeight + 'px', 'important');
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });
  let canvasW = container.offsetWidth;
  let canvasH = container.offsetHeight;

  const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
  let DPR = isIOS ? 1 : Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resizeCanvas(w) {
    canvasW = w;
    canvasH = container.offsetHeight;
    DPR = isIOS ? 1 : Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    canvas.width = Math.round(canvasW * DPR);
    canvas.height = Math.round(canvasH * DPR);
    canvas.style.width = canvasW + 'px';
    canvas.style.setProperty('height', canvasH + 'px', 'important');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // --- Dot Class ---
  class Dot {
    constructor(x, y, r) {
      const isMobile = window.innerWidth <= 991;
      this.original = new Vec(x, y);
      this.pos = new Vec(x, y);
      this.vel = new Vec(0, 0);
      this.acc = new Vec(0, 0);
      this.radius = r;
      this.color = DOT_COLOR;
      this.originalColor = DOT_COLOR;
      this.maxspeed = isMobile ? 4 : 10;
      this.maxforce = isMobile ? 0.1 : 0.6;
      this.comfortZone = 80;
    }

    behave(mouse) {
      const mouseVec = new Vec(mouse.x, mouse.y);
      const d = Vec.dist(this.pos, mouseVec);
      if (d < this.comfortZone) {
        this.color = HOVER_COLOR;
        const away = Vec.add(this.pos.copy(), Vec.sub(this.pos.copy(), mouseVec));
        this.seek(away);
      } else {
        this.color = this.originalColor;
        this.seek(this.original);
      }
    }

    seek(target) {
      const desired = Vec.sub(target, this.pos);
      const d = desired.mag();
      desired.setMag(d < 100 ? (d / 100) * this.maxspeed : this.maxspeed);
      const steer = Vec.sub(desired, this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }

    applyForce(force) { this.acc.add(force); }
    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    show(ctx) {
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(this.color, DOT_OPACITY);
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Globals ---
  let dots = [];
  let img = new Image();
  let imgLoaded = false;
  let mouse = { x: -10000, y: -10000 };
  let rafId = null;
  let lastFrame = 0;

  // --- Build dots based on image brightness ---
  function buildDots() {
    if (!imgLoaded) return;
    dots = [];

    const sampleCanvas = document.createElement('canvas');
    const sampleCtx = sampleCanvas.getContext('2d');

    const canvasAspect = canvasW / canvasH;
    const imgAspect = img.width / img.height;
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

    if (canvasAspect > imgAspect) {
      drawWidth = img.width;
      drawHeight = img.width / canvasAspect;
      offsetY = (img.height - drawHeight) / 2;
    } else {
      drawHeight = img.height;
      drawWidth = img.height * canvasAspect;
      offsetX = (img.width - drawWidth) / 2;
    }

    const sampleW = Math.max(200, Math.round(canvasW / 5));
    const ratio = sampleW / canvasW;
    const sampleH = Math.round(canvasH * ratio);

    sampleCanvas.width = sampleW;
    sampleCanvas.height = sampleH;

    sampleCtx.drawImage(
      img,
      offsetX, offsetY, drawWidth, drawHeight,
      0, 0, sampleW, sampleH
    );

    let pixels;
    try {
      pixels = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
    } catch (err) {
      console.warn('⚠️ iOS blocked getImageData (CORS or AVIF issue):', err);
      return;
    }

    const scaleX = canvasW / sampleW;
    const scaleY = canvasH / sampleH;

    for (let sy = 0; sy < sampleH; sy += Math.max(1, Math.round(DETAIL_LEVEL / scaleY))) {
      for (let sx = 0; sx < sampleW; sx += Math.max(1, Math.round(DETAIL_LEVEL / scaleX))) {
        const idx = (sx + sy * sampleW) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const brightness = (r + g + b) / 3;
        if (brightness > BRIGHTNESS_THRESHOLD) {
          const radius = map(brightness, 0, 255, MIN_DOT_RADIUS, MAX_DOT_RADIUS);
          const cx = sx * scaleX;
          const cy = sy * scaleY;
          dots.push(new Dot(cx, cy, radius));
        }
      }
    }
  }

  // --- Draw Loop ---
  function drawFrame(ts) {
    const now = ts || performance.now();
    const elapsed = now - lastFrame;
    const minDelay = 1000 / FRAME_RATE;
    if (elapsed >= minDelay) {
      lastFrame = now - (elapsed % minDelay);
      ctx.clearRect(0, 0, canvasW, canvasH);
      for (let i = 0; i < dots.length; i++) {
        dots[i].behave(mouse);
        dots[i].update();
        dots[i].show(ctx);
      }
    }
    rafId = requestAnimationFrame(drawFrame);
  }

  // --- Touch & Mouse Events ---
  let touchStartY = 0;
  let touchStartX = 0;

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function onTouchStart(e) {
    if (!e.touches.length) return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouse.x = t.clientX - rect.left;
    mouse.y = t.clientY - rect.top;
    touchStartY = t.clientY;
    touchStartX = t.clientX;
  }

  function onTouchMove(e) {
    if (!e.touches.length) return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const deltaY = Math.abs(t.clientY - touchStartY);
    const deltaX = Math.abs(t.clientX - touchStartX);
    if (deltaY < 10 || deltaX > deltaY) {
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
      e.preventDefault();
    }
  }

  function resetMouse() {
    mouse.x = -10000;
    mouse.y = -10000;
  }

  // --- Resize ---
  let resizeTimeout;
  function handleResize() {
    resizeCanvas(container.offsetWidth);
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => { if (imgLoaded) buildDots(); }, 200);
  }

  const observer = new ResizeObserver(() => handleResize());
  observer.observe(container);
  setTimeout(handleResize, 500); // ✅ ensures paint on iOS

  // --- Image load ---
  img.crossOrigin = null; // ✅ avoid CORS tainting for local assets
  img.onload = () => {
    imgLoaded = true;
    resizeCanvas(container.offsetWidth);
    buildDots();

    const loader = document.querySelector('.loader-wrapper');
    if (loader) loader.style.display = 'none';
    const hero = document.getElementById('animate-section');
    if (hero) hero.classList.add('visible');

    lastFrame = performance.now();
    if (!rafId) rafId = requestAnimationFrame(drawFrame);
  };
  img.onerror = err => console.error('❌ Failed to load image:', IMG_PATH, err);
  img.src = IMG_PATH;

  // --- Init Listeners ---
  resizeCanvas(container.offsetWidth);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('mouseleave', resetMouse);
  canvas.addEventListener('touchend', resetMouse);
  canvas.addEventListener('touchcancel', resetMouse);
  window.addEventListener('resize', handleResize);
})();
