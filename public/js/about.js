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
$(document).ready(function() {
    $('.hovervideo').each(function() {
        var video = this;
        var $parent = $(video).parent();

        $parent.on('mouseenter', function() {
            video.currentTime = 0;
            video.play();
        });

        $parent.on('mouseleave', function() {
            video.pause(); // optional
        });
    });
});