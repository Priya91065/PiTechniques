let name = $('#name');
let lname = $('#lname');
let email = $('#email');
let phone = $('#phone');

let phoneRegex = /^[0-9]{10}$/;
let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Helper functions
function showError($el, msg) {
    $el.next(".error-message").remove();
    $el.addClass("not-valid").after('<span class="error-message">' + msg + '</span>');
}

function clearError($el) {
    $el.removeClass("not-valid");
    $el.next(".error-message").remove();
}

// First Name
name.on("input", function () {
    this.value = this.value.replace(/[^A-Za-z\s]/g, '');
    if ($(this).val().trim() !== "") {
        clearError($(this));
    }
});

// Last Name
lname.on("input", function () {
    this.value = this.value.replace(/[^A-Za-z\s]/g, '');
    if ($(this).val().trim() !== "") {
        clearError($(this));
    }
});

// Email
email.on("input", function () {
    if (emailRegex.test($(this).val().trim())) {
        clearError($(this));
    }
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


// Shows the form-level alert (success/danger), reusing the original markup.
function showFormAlert(message, ok) {
    var $alert = $('#contact-form .alert');
    $alert.removeClass('d-none alert-success alert-danger');
    $alert.addClass(ok ? 'alert-success' : 'alert-danger');
    $('#alertMessage').text(message);
}

// ✅ Final validation + submit to the CMS contact API.
$('#applybtn').off('click').on('click', function (e) {
    e.preventDefault();
    var isValid = true;

    if (name.val().trim() === "") {
        showError(name, "Please enter first name.");
        isValid = false;
    }
    if (lname.val().trim() === "") {
        showError(lname, "Please enter last name.");
        isValid = false;
    }
    if (email.val().trim() === "") {
        showError(email, "Please enter email address.");
        isValid = false;
    } else if (!emailRegex.test(email.val().trim())) {
        showError(email, "Please enter a valid email address.");
        isValid = false;
    } else {
        clearError(email);
    }

    if (phone.val().trim() === "") {
        showError(phone, "Please enter contact number.");
        isValid = false;
    } else if (!phoneRegex.test(phone.val())) {
        showError(phone, "Please enter valid 10-digit phone number.");
        isValid = false;
    }

    if (!isValid) return;

    var $btn = $(this);
    $btn.prop('disabled', true);

    $.ajax({
        url: '/api/contact',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            source: 'CONTACT',
            firstName: name.val().trim(),
            lastName: lname.val().trim(),
            email: email.val().trim(),
            phone: phone.val().trim(),
            message: $('#message').val().trim()
        })
    }).done(function (res) {
        showFormAlert((res && res.message) || 'Thanks! Your message has been sent.', true);
        $('#contact-form')[0].reset();
    }).fail(function (xhr) {
        var msg = (xhr && xhr.responseJSON && xhr.responseJSON.error) || 'Something went wrong. Please try again.';
        showFormAlert(msg, false);
    }).always(function () {
        $btn.prop('disabled', false);
    });
});

   
//     document.addEventListener("DOMContentLoaded", function () {
//     const img = document.querySelector(".office-img");
//     const officeBox = document.querySelector(".office-box");
   
//     if (img.complete) {
//       officeBox.classList.remove("office-hidden");
//     } else {
//       img.addEventListener("load", () => {
//         officeBox.classList.remove("office-hidden");
//       });
//     }
//    });
   