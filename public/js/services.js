 $(document).ready(function() {
         $(".clientsServed").click(function(e) {
      e.preventDefault();

      let $logos = $(this).next(".clientsServedLogos");

      // close all others
      $(".clientsServedLogos").not($logos).slideUp();
      $(".clientsServed").not(this).removeClass("active-client"); // remove from others

      // toggle clicked one
      if ($logos.is(":visible")) {
         $logos.slideUp();
         $(this).removeClass("active-client"); // remove if closing
      } else {
         $logos.css("display", "flex").hide().slideDown();
         $(this).addClass("active-client"); // add when opening
      }
   });

   });


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

   });

$(function () {
  // 🔹 On page load with hash
  if (window.location.hash) {
    // scroll to top first (prevent instant jump)
    $(window).scrollTop(0);

    // then animate after short delay
    setTimeout(() => {
      smoothScroll(window.location.hash, false);
    }, 50);
  }

  // 🔹 On click (same-page links)
  $(document).on("click", "a[href^='#']", function (e) {
    let target = $(this).attr("href");

    // ignore empty links or just "#"
    if (target === "#" || target.trim().length < 2) return;

    if ($(target).length) {
      e.preventDefault(); // stop default instant jump
      smoothScroll(target, true);
    }
  });

  // 🔹 Reusable scroll function
  function smoothScroll(selector, updateHash = false) {
    let target = $(selector).first();
    if (target.length) {
      let offset = $(".header, .navbar, header").outerHeight() || 88;
      $("html, body").animate(
        { scrollTop: target.offset().top - offset },
        500, // slightly faster
        function () {
          if (updateHash) {
            history.pushState(null, null, selector); // update hash cleanly
          }
        }
      );
    }
  }
});


   document.querySelectorAll(".hoverLottie").forEach(lottie => {
      lottie.addEventListener("mouseenter", () => {
         lottie.stop(); // reset to beginning
         lottie.play(); // play again
      });

      lottie.addEventListener("mouseleave", () => {
         lottie.stop(); // optional: stop when leaving
      });
   });

   document.querySelectorAll(".lottie-card").forEach(card => {
      const player = card.querySelector("dotlottie-player");

      card.addEventListener("mouseenter", () => player.play());
      card.addEventListener("mouseleave", () => player.stop());
   });