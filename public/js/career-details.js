   // Define formValid globally
    let formValid = true;

    let name = $('#name');
    let lname = $('#lname');
    let email = $('#email');
    let phone = $('#phone');
    let fileInput = $('#file-1');

    let phoneRegex = /^[0-9]{10}$/;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let allowedFileTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    let maxFileSize = 100 * 1024 * 1024; // 100MB

    // Helper functions
    function showError($el, msg) {
        $el.next(".error-message").remove();
        $el.addClass("not-valid").after('<span class="error-message">' + msg + '</span>');
        formValid = false;
    }

    function clearError($el) {
        $el.removeClass("not-valid");
        $el.next(".error-message").remove();
    }

    // Clear errors on typing / input
    name.on("input", function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, '');
        clearError($(this));
    });

    lname.on("input", function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, '');
        clearError($(this));
    });

    email.on("input", function () {
        clearError($(this));
    });

    // Phone
    phone.on("input", function () {
        let currentVal = $(this).val();
        let onlyNumbers = currentVal.replace(/[^0-9]/g, '');

        if (currentVal !== onlyNumbers) {
            showError($(this), "Only numbers are accepted.");
        } else {
            clearError($(this));
        }

        this.value = onlyNumbers; // keep only digits

        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }

        if (phoneRegex.test(this.value)) {
            clearError($(this));
        }
    });


    fileInput.on("change", function () {
        let file = fileInput[0].files[0];
        if(!file){
            $('.fileinputlists').addClass('d-none')
        } else if (!allowedFileTypes.includes(file.type)) {
            showError(fileInput, "Only PDF or Word documents allowed.");
        } else if (file.size > maxFileSize) {
            showError(fileInput, "File size must be under 100MB.");
        } else {
            clearError($(this));
            $('.fileinputlists').removeClass('d-none')
        }
    });


    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll('a[href="#careerForm"]').forEach(link => {
            link.addEventListener("click", function(e) {
                e.preventDefault(); // stop default jump

                // Ensure accordion is open
                // let accordionItem = document.getElementById("panelsStayOpen-collapseTwo");
                // if (accordionItem && !accordionItem.classList.contains("show")) {
                //     new bootstrap.Collapse(accordionItem, {
                //         toggle: true
                //     });
                // }

                // Smooth scroll with offset
                setTimeout(() => {
                    let form = document.getElementById("careerForm");
                    let headerOffset = 100; // adjust this value if you have sticky header height
                    let elementPosition = form.getBoundingClientRect().top + window.scrollY;
                    let offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }, 300);
            });
        });
    });

    $('#applybtn').off('click').on('click', function (e) {
        e.preventDefault();
        formValid = true; // reset before validation

        // First name
        if (name.val().trim() === "") {
            showError(name, "Please enter first name.");
        } else {
            clearError(name);
        }

        // Last name
        if (lname.val().trim() === "") {
            showError(lname, "Please enter last name.");
        } else {
            clearError(lname);
        }

        // Email
       if (email.val().trim() === "") {
            showError(email, "Please enter email address.");
            isValid = false;
        } else if (!emailRegex.test(email.val().trim())) {
            showError(email, "Please enter a valid email address.");
            isValid = false;
        } else {
            clearError(email);
        }

        // Phone
        if (phone.val().trim() === "") {
            showError(phone, "Please enter phone number.");
        } else if (!phoneRegex.test(phone.val().trim())) {
            showError(phone, "Please enter valid 10-digit phone number.");
        } else {
            clearError(phone);
        }

        
        // File
        if (fileInput[0].files.length === 0) {
            showError(fileInput, "Please upload your CV/Resume.");
        } else {
            let file = fileInput[0].files[0];
            if (!allowedFileTypes.includes(file.type)) {
                showError(fileInput, "Only PDF or Word documents allowed.");
            } else if (file.size > maxFileSize) {
                showError(fileInput, "File size must be under 100MB.");
            } else {
                clearError(fileInput);
            }
        }

        if (!formValid) return;

        var fd = new FormData();
        fd.append('source', 'CAREER');
        fd.append('firstName', name.val().trim());
        fd.append('lastName', lname.val().trim());
        fd.append('email', email.val().trim());
        fd.append('phone', phone.val().trim());
        fd.append('message', $('#message').val().trim());
        fd.append('position', $('#jobform input[name="position"]').val() || '');
        if (fileInput[0].files[0]) fd.append('resume', fileInput[0].files[0]);

        var $btn = $(this);
        $btn.prop('disabled', true);

        $.ajax({
            url: '/api/contact',
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false
        }).done(function (res) {
            var $alert = $('#jobform .alert');
            $alert.removeClass('d-none alert-success alert-danger').addClass('alert-success');
            $('#jobform #alertMessage').text((res && res.message) || 'Thanks! Your application has been sent.');
            $('#jobform')[0].reset();
            $('.fileinputlists').addClass('d-none').empty();
        }).fail(function (xhr) {
            var msg = (xhr && xhr.responseJSON && xhr.responseJSON.error) || 'Something went wrong. Please try again.';
            var $alert = $('#jobform .alert');
            $alert.removeClass('d-none alert-success alert-danger').addClass('alert-danger');
            $('#jobform #alertMessage').text(msg);
        }).always(function () {
            $btn.prop('disabled', false);
        });
    });

    $(document).ready(function() {
       // When Apply button is clicked
       $('a[href="#careerForm"]').on('click', function(e) {
           e.preventDefault();

           const $accordion = $('#collapseApply');

           // Open the accordion if it's not already open
           if (!$accordion.hasClass('show')) {
               $accordion.collapse('show');
           }

           // Smooth scroll to form
           $('html, body').animate({
               scrollTop: $accordion.offset().top - 100
           }, 600);
       });
   });

