$(document).ready(function () {
    const selectors = ".tclick, .tclick2";

    function handleNavigation(e) {
        if ($(window).width() >= 1192) return; // Only <1192px

        const url = $(this).attr("href");
        if (!url) return;

        e.preventDefault();
        window.location.href = url;
    }

    // Click for all browsers
    $(document).on("click", selectors, handleNavigation);

    // Touchstart for iOS devices
    const isIOSclick = /iP(ad|hone|od)/.test(navigator.userAgent) ||
                  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOSclick) {
        $(document).on("touchstart", selectors, handleNavigation);
    }
});





let scrollTimer;

$(window).on('scroll', function () {
    const scrollTop = $(window).scrollTop();
    const footer = $('.footer-newUI');

    if (!footer.length) return; // exit if footer not found

    const footerTop = footer.offset().top;
    const footerHeight = footer.outerHeight();
    const windowHeight = $(window).height();

    // check if user is inside the footer
    const inFooter = (scrollTop + windowHeight) > footerTop && scrollTop < (footerTop + footerHeight);

    // show fixed button only when not in footer
    if (scrollTop > 100 && !inFooter) {
        $('.scrolltotop').addClass('fixed');
    } else {
        $('.scrolltotop').removeClass('fixed');
    }

    // add or remove footerfixed class on the footer
    footer.toggleClass('footerfixed', inFooter);

    // clear previous timer
    clearTimeout(scrollTimer);

    // hide after 5 seconds only when not in footer
    if (!inFooter) {
        scrollTimer = setTimeout(function () {
            $('.scrolltotop').removeClass('fixed');
        }, 5000);
    }
});






new WOW().init()

// if ($(window).width() > 1025) {
//   var height = $(window).height()
//   var bannerfinalheight = height
//   $('.top-section').css('height', '' + bannerfinalheight + 'px')

//   $(window).resize(function () {
//     var height = $(window).height()
//     var bannerfinalheight = height
//     $('.top-section').css('height', '' + bannerfinalheight + 'px')
//   })
// }

var didScroll
var lastScrollTop = 0
var delta = 5
var navbarHeight = $('header').outerHeight()

$(window).scroll(function (event) {
  didScroll = true
})
setInterval(function () {
  if (didScroll) {
    hasScrolled()
    didScroll = false
  }
}, 350)

function hasScrolled() {
  var st = $(this).scrollTop()

  if (Math.abs(lastScrollTop - st) <= delta) return

  if (st > lastScrollTop && st > navbarHeight) {
    $('header').removeClass('sticky').addClass('nav-up')
  } else {
    if (st + $(window).height() < $(document).height()) {
      $('header').removeClass('nav-up').addClass('sticky')
    }
  }

  if ($(window).scrollTop() < 200) {
    $('header').removeClass('sticky')
  }

  lastScrollTop = st
}

$(
  '.why-card .card, .team-card .team-details, .office-box .card-footer'
).matchHeight()

function openNav() {
  document.getElementById('navbarSupportedContent').style.left = '0'
  document.getElementById('openMenu').style.display = 'none'
  document.getElementById('closeMenu').style.display = 'block'
}
function closeNav() {
  document.getElementById('navbarSupportedContent').style.left = '-100%'
  document.getElementById('closeMenu').style.display = 'none'
  document.getElementById('openMenu').style.display = 'block'
}

$(function () {
  var countFiles = 1,
    $body = $('body'),
    typeFileArea = ['txt', 'doc', 'docx', 'pdf'],
    coutnTypeFiles = typeFileArea.length

  $body.on('change', 'input[type="file"]', function () {
    var $this = $(this),
      valText = $this.val(),
      fileName = valText.split(/(\\|\/)/g).pop(),
      fileItem = $this.siblings('.file-item'),
      beginSlice = fileName.lastIndexOf('.') + 1,
      typeFile = fileName.slice(beginSlice)

    var wrapFiles = $('.one-file .fileinputlists'),
    countFiles = $('.one-file').data('count-files') + 1
    $('.one-file').data('count-files', countFiles)
    newFileInput =
      '<div class="file-item"><input type="file" name="file-' +
      countFiles +
      '" id="file-' +
      countFiles +
      '">' +
      '<p class="tag"><img src="images/contact/attach_file.svg" alt="">' +
      '<span class="file-name">' +
      fileName +
      '</span></p><span class="btn btn-del-file">x</span></div>'
    wrapFiles.html(newFileInput)
    console.log(fileItem.find('.file-name').text())
    // fileItem.find('.file-name').text(fileName)
    if (valText != '') {
      for (var i = 0; i < coutnTypeFiles; i++) {
        if (typeFile == typeFileArea[i]) {
          $this.parent().addClass('has-mach')
        }
      }
    } else {
      fileItem.addClass('hide-btn')
    }

    if (!$this.parent().hasClass('has-mach')) {
      $this.parent().addClass('error')
    }
  })

  //remove file
  $body.on('click', '.btn-del-file', function () {
    var elem = $(this).closest('.file-item')
    var removeErrorMessage = $(this).closest('.files-wr').find('.error-message')
    elem.fadeOut(400)
    setTimeout(function () {
      elem.remove()
      removeErrorMessage.remove()
    }, 400)
  })


    
})


// Hide Header on on scroll down
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('header').outerHeight();

    $(window).scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 350);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            $('header').removeClass('sticky').addClass('nav-up');

        } else {
            // Scroll Up
            if (st + $(window).height() < $(document).height()) {
                $('header').removeClass('nav-up').addClass('sticky');
            }
        }

        if ($(window).scrollTop() < 200) {
            $('header').removeClass('sticky');
        }

        lastScrollTop = st;
    }