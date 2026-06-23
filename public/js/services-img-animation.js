(() => {
  let img;
  let dots = [];
  let detailLevel = 12; // Reduced dot count for performance
  let minDotRadius = 0.1;
  let maxDotRadius = 4;
  let dotColor = '#F4F4F4';
  let hoverColor = '#F7941E';
  let canvasW, canvasH;
  let mouse = { x: -1000, y: -1000 };
  let imgLoaded = false;

  function setup() {
    const container = document.getElementById('canvas-container');
    if (!container) {
      console.error('Canvas container not found!');
      return;
    }

    canvasW = container.offsetWidth;
    canvasH = window.innerHeight;

    let cnv = createCanvas(canvasW, canvasH);
    cnv.parent('canvas-container');
    pixelDensity(1);
    frameRate(30); // Limit FPS for smoother performance

    img = loadImage(
      BASE_URL + 'images/banner-img/services-animation-banner.avif',
      () => {
        img.resize(200, 0); // Resize image before pixel processing
        imgLoaded = true;
        buildDots(); // ✅ build dots once loaded

        const hero = document.getElementById('animate-section');
        if (hero) {
          hero.classList.add('visible');
        }
      }
    );
  }

  function draw() {
    clear();
    if (imgLoaded) {
      for (let dot of dots) {
        dot.behave();
        dot.update();
        dot.show();
      }
    }
  }

  function buildDots() {
    if (!img || !imgLoaded) return;

    dots = [];
    image(img, 0, 0, canvasW, canvasH);
    loadPixels();

    for (let y = 0; y < height; y += detailLevel) {
      for (let x = 0; x < width; x += detailLevel) {
        const index = (x + y * width) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const brightness = (r + g + b) / 3;
        const radius = map(brightness, 0, 255, 0, maxDotRadius);
        if (radius > minDotRadius) {
          dots.push(new Dot(x, y, radius, dotColor));
        }
      }
    }
  }

  function mouseMoved() {
    mouse.x = mouseX;
    mouse.y = mouseY;
  }

  function touchMoved() {
    mouse.x = mouseX;
    mouse.y = mouseY;
    return true;
  }

  function touchEnded() {
    mouse.x = -1000;
    mouse.y = -1000;
  }

  function windowResized() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    canvasW = container.offsetWidth;
    canvasH = window.innerHeight;

    resizeCanvas(canvasW, canvasH);

    if (imgLoaded) {
      buildDots(); // ✅ rebuild dots on resize
    }
  }

  class Dot {
    constructor(x, y, r, color) {
      const isMobile = window.innerWidth <= 991; // mobile breakpoint

      this.original = createVector(x, y);
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.radius = r;
      this.color = color;
      this.originalColor = color;

      // "media query" settings
      this.maxspeed = isMobile ? 4 : 15;
      this.maxforce = isMobile ? 0.15 : 0.8;
      this.comfortZone = 100;
    }

    behave() {
      let mouseVec = createVector(mouse.x, mouse.y);
      let d = p5.Vector.dist(this.pos, mouseVec);

      if (d < this.comfortZone) {
        this.color = hoverColor;
        this.seek(p5.Vector.sub(this.pos, mouseVec).add(this.pos)); // move away
      } else {
        this.color = this.originalColor;
        this.seek(this.original);
      }
    }

    seek(target) {
      let desired = p5.Vector.sub(target, this.pos);
      let d = desired.mag();
      if (d < 100) {
        desired.setMag(map(d, 0, 100, 0, this.maxspeed));
      } else {
        desired.setMag(this.maxspeed);
      }

      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }

    applyForce(force) {
      this.acc.add(force);
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    show() {
      noStroke();
      fill(this.color);
      circle(this.pos.x, this.pos.y, this.radius * 2);
    }
  }

  // Expose to p5
  window.setup = setup;
  window.draw = draw;
  window.mouseMoved = mouseMoved;
  window.touchMoved = touchMoved;
  window.touchEnded = touchEnded;
  window.windowResized = windowResized;
})();
