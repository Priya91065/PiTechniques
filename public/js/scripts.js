$(document).ready(function() {
    $('.glide__slide').matchHeight();
    $('.work-carousel').owlCarousel({
        mouseDrag: true,
        touchDrag: true,
        loop: false,
        margin: 30,
        nav: true,
        stagePadding: 150,
        responsive: {
            0: { items: 1, margin: 0, stagePadding: 12, autoWidth: false },
            370: { items: 1, margin: 0, stagePadding: 20, autoWidth: false },
            600: { items: 1, margin: 10, stagePadding: 120 },
            786: { items: 1, margin: 10, stagePadding: 120, autoWidth: false },
            991: { items: 2, margin: 10, stagePadding: 60, autoWidth: false },
            1000: { items: 2, margin: 20, stagePadding: 80, autoWidth: false },
            1280: { items: 2, stagePadding: 120 },
            1550: { items: 2 },
        },
        onInitialized: setEqualHeight,
        onResized: setEqualHeight
    });

    // // ✅ Safari trackpad scroll — slowed down
    // let isScrolling = false;

    // $('.work-carousel').on('wheel', function(e) {

    //     if (isScrolling) return;
    //     isScrolling = true;

    //     if (e.originalEvent.deltaX > 0 || e.originalEvent.deltaY > 0) {
    //         $(this).trigger('next.owl.carousel');
    //     } else {
    //         $(this).trigger('prev.owl.carousel');
    //     }

    //     // 👇 Change delay to control speed (bigger = slower)
    //     setTimeout(() => { isScrolling = false; }, 800);

    //     e.preventDefault();
    // });




    $('.testimonials .owl-carousel').owlCarousel({
        mouseDrag: true,
        mouseDrag: true,
        loop: true,
        center: false,
        nav: true,
        margin: 0,
        stagePadding: 0,
        responsive: {
            0: {
                items: 1,
                mouseDrag: true, // 👈 enable mouse drag
                touchDrag: true, // 👈 (optional) ensure touch drag works too
                margin: 2,
                stagePadding: 20,
            },
            600: {
                items: 1,
                margin: 40,
                stagePadding: 40,
                mouseDrag: true, // 👈 enable mouse drag
                touchDrag: true, // 👈 (optional) ensure touch drag works too
                margin: 40,
                stagePadding: 100,
                center: false,
                loop: true,
            },
            992: {
                items: 1,
                margin: 40,
                stagePadding: 40,
                mouseDrag: true, // 👈 enable mouse drag
                touchDrag: true, // 👈 (optional) ensure touch drag works too
                margin: 40,
                stagePadding: 100,
                center: true,
                loop: true,
            },
            1200: {
                items: 3,
                mouseDrag: false, // 👈 enable mouse drag
                touchDrag: false, // 👈 (optional) ensure touch drag works too
            },
        },
        onInitialized: setEqualHeight,

        onResized: setEqualHeight
    })

    $('.testimonials .owl-prev').click(function() {
        $active = $('.owl-item .item.show')
        $('.owl-item .item.show').removeClass('show')
        $('.owl-item .item').removeClass('next')
        $('.owl-item .item').removeClass('prev')
        $active.addClass('next')
        if ($active.is('.first')) {
            $('.owl-item .last').addClass('show')
            $('.first').addClass('next')
            $('.owl-item .last').parent().prev().children('.item').addClass('prev')
        } else {
            $active.parent().prev().children('.item').addClass('show')
            if ($active.parent().prev().children('.item').is('.first')) {
                $('.owl-item .last').addClass('prev')
            } else {
                $('.owl-item .show').parent().prev().children('.item').addClass('prev')
            }
        }
    })

    $('.testimonials .owl-next').click(function() {
        $active = $('.owl-item .item.show')
        $('.owl-item .item.show').removeClass('show')
        $('.owl-item .item').removeClass('next')
        $('.owl-item .item').removeClass('prev')
        $active.addClass('prev')
        if ($active.is('.last')) {
            $('.owl-item .first').addClass('show')
            $('.owl-item .first').parent().next().children('.item').addClass('prev')
        } else {
            $active.parent().next().children('.item').addClass('show')
            if ($active.parent().next().children('.item').is('.last')) {
                $('.owl-item .first').addClass('next')
            } else {
                $('.owl-item .show').parent().next().children('.item').addClass('next')
            }
        }
    })

    $('.testimonials .owl-next span, .testimonials .owl-prev').html(
        '<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2857 1L19 9M19 9L11.2857 17M19 9H1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    )

    $('.work-carousel .owl-next, .work-carousel .owl-prev').html(
        '<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2857 1L19 9M19 9L11.2857 17M19 9H1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    )

    $(
        '.owl-carousel .item, .service-details, .owl-carousel .card, .work-carousel .card'
    ).matchHeight()



    function setEqualHeight() {
        // reset previous inline heights
        $('.owl-carousel .item, .service-details, .owl-carousel .card, .work-carousel .card')
            .css('height', 'auto');

        // then re-apply matchHeight
        $('.owl-carousel .item, .service-details, .owl-carousel .card, .work-carousel .card')
            .matchHeight();
    }

    // also re-run on orientation change
    $(window).on('orientationchange', setEqualHeight);
})