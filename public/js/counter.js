$(document).ready(function() {
    let counterStarted = false;

    function startCounters() {
        $('.counter').each(function() {
            let $this = $(this);
            let target = parseInt($this.data('target'));
            let duration = 2000; // 2 seconds
            let intervalTime = 40;
            let steps = duration / intervalTime;
            let step = Math.ceil(target / steps);
            let count = 0;

            let interval = setInterval(function() {
                count += step;
                if (count >= target) {
                    count = target;
                    clearInterval(interval);
                }
                $this.text(count);
            }, intervalTime);
        });
    }

    function isInViewport(element) {
        let elementTop = $(element).offset().top;
        let elementBottom = elementTop + $(element).outerHeight();
        let viewportTop = $(window).scrollTop();
        let viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
    }

    function checkCounters() {
        if (!counterStarted && isInViewport('.number-data-main')) {
            counterStarted = true;
            startCounters();
        }
    }

    // Initial check in case already in viewport
    checkCounters();

    // Check on scroll and resize
    $(window).on('scroll resize', function() {
        checkCounters();
    });
});