// new Glide('.glide', {
//       type: 'carousel', // loop
//       startAt: 0, // first slide active
//       perView: 2.5, // slides per view
//       focusAt: 'center', // center active slide
//       gap: 40,
//       breakpoints: {
//          1024: {
//                perView: 1.5
//          },
//          640: {
//                perView: 1
//          }
//       }
//    }).mount();


const glide = new Glide('.glide', {
    type: 'slider', // bound only works reliably with slider
    startAt: 0,
    perView: 1.6,
    focusAt: 0,
    gap: 30,
    rewind: false,
    bound: true,
    animationDuration: 350,
    swipeThreshold: 60,
    dragThreshold: 60,
    breakpoints: {
        1366: { perView: 1.5, focusAt: 0, gap: 30 },
        1024: { perView: 1.3, focusAt: 0, gap: 30 },
        767:  { perView: 1, focusAt: 0, gap: 40 },
        766:  { perView: 1, focusAt: 0, gap: 0 },
    }
});

// Update active class safely
function updateActiveClass() {
    const slides = document.querySelectorAll('.glide__slide');
    slides.forEach(slide => slide.classList.remove('glide__slide--active'));

    const current = Math.floor(glide.index);
    const perView = Math.floor(glide.settings.perView);

    for (let i = 0; i < perView; i++) {
        const slideIndex = current + i;
        if (slides[slideIndex]) slides[slideIndex].classList.add('glide__slide--active');
    }
}

glide.on('mount.after', updateActiveClass);
glide.on('run.after', updateActiveClass);
glide.mount();

// Trackpad / mouse horizontal scroll for all browsers
let glideScrolling = false;
const glideTrack = document.querySelector('.glide__track');

glideTrack.addEventListener('wheel', function(e) {
    // Only horizontal movement
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;

    if (glideScrolling) return;
    glideScrolling = true;

    const slides = document.querySelectorAll('.glide__slide');
    const perView = glide.settings.perView;
    const maxIndex = slides.length - perView;

    // Normalize deltaX across browsers
    let delta = e.deltaMode === 1 ? e.deltaX * 15 : e.deltaX; // deltaMode 1 = lines in Firefox
    // Move index proportionally (adjust 200 for sensitivity)
    let moveIndex = glide.index + (delta / 200);

    // Clamp
    moveIndex = Math.max(0, Math.min(moveIndex, maxIndex));

    glide.go('=' + moveIndex);

    // fast reset to allow smooth continuous scroll
    setTimeout(() => glideScrolling = false, 20);

    e.preventDefault();
}, { passive: false });






document.addEventListener("DOMContentLoaded", () => {
    const lotties = document.querySelectorAll('.scrollLottie');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const player = entry.target;
            if (entry.isIntersecting) {
                player.stop(); // always rewind
                player.play(); // restart from frame 0
            } else {
                player.pause(); // stop when out of view
            }
        });
    }, {
        threshold: 0.5
    });

    lotties.forEach(lottie => {
        if (lottie instanceof Element) {
            observer.observe(lottie);
        }
    });

    // ✅ Helper to restart any visible lottie (for anchor jumps, hash changes, or on load)
    function restartVisibleLotties() {
        lotties.forEach(lottie => {
            const rect = lottie.getBoundingClientRect();
            if (
                rect.top < window.innerHeight * 0.5 &&
                rect.bottom > window.innerHeight * 0.5
            ) {
                lottie.stop();
                lottie.play();
            }
        });
    }

    // 🔥 Handle page load (section may already be visible)
    window.addEventListener("load", restartVisibleLotties);


    // 🔥 Handle browser back/forward with hash (#section)
    window.addEventListener("hashchange", () => {
        setTimeout(restartVisibleLotties, 600);
    });
});


function setNumbersDataWidth() {

    const numbersData = document.querySelector(".numbers-data");

    const header = document.querySelector(".headerColumn");

    if (!numbersData || !header) return; // safety check

    if (window.innerWidth > 1199) {

        const headerWidth = header.offsetWidth; // includes padding + border

        numbersData.style.width = headerWidth + "px";

    } else {

        numbersData.style.width = ""; // reset for smaller screens

    }

}

document.addEventListener("DOMContentLoaded", function() {

    setNumbersDataWidth();

    let resizeTimer;

    window.addEventListener("resize", function() {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(setNumbersDataWidth, 200); // debounce

    });

});

const isIOSh = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Only run on iOS **and** screen width less than 1199px
if (isIOSh && window.innerWidth < 1199) {
  document.querySelectorAll('.all-services a.removeUnderline').forEach(a => {
    a.addEventListener('touchend', function(e) {
      e.preventDefault(); // Prevent double firing
      window.location.href = this.href;
    });
  });
}
