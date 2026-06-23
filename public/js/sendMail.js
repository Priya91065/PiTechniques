function sendJobMail(formId, url) {
    var formElement = document.getElementById(formId); 
    var formData = new FormData(formElement);

    let name = formElement.elements['name']
    let lname = formElement.elements['lname']
    let email = formElement.elements['email'] 
    let phone = formElement.elements['phone'] 
    let file = formElement.elements['file-1'];  // might be undefined in second form
    let hasFileField = !!file;
    let formValid = true

        if( name.value && email.value && phone.value && (!hasFileField || (hasFileField && file.value)) ) {
            $('.error-message').text("")
            $("#applybtn").addClass('disabled')
            $('#applybtn span').text('Please wait...')
            $('#applybtn .arrowbg').addClass('d-md-none')
        
        
            $.ajax({
                url: url,  
                type: "post",   
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success:function(result){

                    if(!result.status) {
                        $('#applybtn').prop('disabled', false).removeClass('disabled')
                        $('#applybtn span').text(result.btnText)
                        $('#applybtn span img').removeClass('d-md-none')
                        
                        $('.alert').addClass("alert-warning d-block").removeClass('d-none')
                        $('#alertMessage').text(result.message)
                        
                        if (result.message.username) {
                            $("#name").after('<span class="error-message">'+result.message.username+'</span>');
                        }
                          if (result.message.lname) {
                            $("#lname").after('<span class="error-message">'+result.message.lname+'</span>');
                        }
                        if (result.message.email) {
                            $("#email").after('<span class="error-message">'+result.message.email+'</span>').focus();
                        }
                        if (result.message.phone) {
                            $("#phone").after('<span class="error-message">'+result.message.phone+'</span>');
                        }
                        if (result.message.file) {
                            $("#file-1").after('<span class="error-message">'+result.message.file+'</span>');
                        }
                    } else {
                        $('#applybtn').prop('disabled', false).removeClass('disabled')
                        $('.alert').addClass("alert-success d-block").removeClass('d-none')
                        $('#alertMessage').text(result.message)

                        $("#applybtn").css({
                            "opacity": "1",
                            "pointer-events": "unset",
                        });
                        $('#applybtn span').text(result.btnText)
                        $('#applybtn .arrowbg').removeClass('d-md-none')
                        $formData = $('#'+formId).trigger("reset")
                        $(".file-item").remove();
                    }
                }
            });

        } else {
            error_handle(name, lname, email, phone, file, formValid)
        }
}

function error_handle(name, lname, email, phone, file, formValid) {
    
    var required_field = [name, lname, email, phone]
    
    if (file && $(file).length) {
        required_field.push(file);
    }
    
    $.each(required_field, function(index, field){

        var value = field.value ? field.value.trim() : "";

        $(field).removeClass('not-valid').next('.error-message').remove();

        if(value == "") {
            formValid = false;
            if($(field).attr("type") == "file") {
                $(field).addClass('not-valid').after('<span class="error-message">Please upload file.</span>');
            } else {
                $(field).addClass('not-valid').after('<span class="error-message">Please fill out this field.</span>');
            }

            if (formValid === false && index === 0) {
                $(field).focus();
            }

        }
    })
   
}

