(() => {
  let img;
  let dots = [];
  let detailLevel = 7;
  let minDotRadius = 0.5;
  let maxDotRadius = 4;
  let dotColor = '#F4F4F4';
  let hoverColor = '#F7941E';
  let canvasW, canvasH;
  let mouse = { x: -1000, y: -1000 };

  function preload() {
    img = loadImage('https://i.postimg.cc/GhpSdRm9/bannerimage.png');
  }

  function setup() {
    const container = document.getElementById('canvas-container');
    canvasW = container.offsetWidth;
    canvasH = window.innerHeight;
    let cnv = createCanvas(canvasW, canvasH);
    cnv.parent('canvas-container');
    pixelDensity(1);
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

  function draw() {
    clear();
    for (let dot of dots) {
      dot.behave();
      dot.update();
      dot.show();
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

  class Dot {
    constructor(x, y, r, color) {
      const isMobile = window.innerWidth <= 991; // Define your mobile breakpoint here
  
      this.original = createVector(x, y);
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.radius = r;
      this.color = color;
      this.originalColor = color;
  
      // Apply "media query" settings
      this.maxspeed = isMobile ? 8 : 5;
      this.maxforce = isMobile ? 0.3 : 0.1;
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

  // Bind p5.js functions
  window.preload = preload;
  window.setup = setup;
  window.draw = draw;
  window.mouseMoved = mouseMoved;
  window.touchMoved = touchMoved;
  window.touchEnded = touchEnded;
})();