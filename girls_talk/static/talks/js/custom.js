

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$('#register_form').on('submit', function(event){
      event.preventDefault();
      var email =$('#email_id').val();
      var flag=0;
      var i;
      var ret=validate_password();
      var ret2=password_match();
      for (i = 0; i < emails.length; i++){
        if(emails[i]==email){
             flag=1;
             break;
        }
      }
     //remove all css
                    $('#email_id').css('border-style','');
                    $('#email_id').css('border-width','');
                    $('#email_id').css('border-color','');
                    $('#passwd').css('border-style','');
                    $('#passwd').css('border-width','');
                    $('#passwd').css('border-color','');
                    $('#repeat').css('border-style','');
                    $('#repeat').css('border-width', '');
                    $('#repeat').css('border-color','');

      if (flag){ 
         $('#message').text("Registration failed! This email id is already registered");
         $('#message').removeClass().addClass("danger");
         $('#email_id').css('border-style','outset');
         $('#email_id').css('border-width', 'thin');
         $('#email_id').css('border-color','red');
         console.log("found");
      }
      else if(ret){
         $('#message').text("Registration failed! because password does not match the rule");
         $('#message').removeClass().addClass("danger");
         $('#pass').css('color','red');
         $('#passwd').css('border-style','outset');
         $('#passwd').css('border-width', 'thin');
         $('#passwd').css('border-color','red');
      }
      else if(ret2) { 
        $('#message').text("Registration failed! because passwords do not match");
         $('#message').removeClass().addClass("danger");
         $('#repeat').css('border-style','outset');
         $('#repeat').css('border-width', 'thin');
         $('#repeat').css('border-color','red');

      }      
      else {
         register(flag);
      }
});

function register(Flag){
  var name = $('#full_name').val();
  var email =$('#email_id').val();
  var passwd = $('#passwd').val();
  var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
        $.ajax({
                beforeSend: function(xhr, settings) {
                     $('#message').text("Please wait..");
                     $('#message').removeClass().addClass("wait");
                     if ( Flag==1 ) { xhr.abort();}
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/register/',
                type: "POST",
                data: { 'name':name, 'email':email , 'passwd':passwd },
                success: function (data) {
                    emails = data.users;
                    //console.log(data,emails);
                    $('#message').text("Congratulations! registration is successful");
                    $('#message').removeClass().addClass("success");
                    $('#email_id').css('border-style','');
                    $('#email_id').css('border-width','');
                    $('#email_id').css('border-color','');
                    $('#passwd').css('border-style','');
                    $('#passwd').css('border-width','');
                    $('#passwd').css('border-color','');
                    $('#repeat').css('border-style','');
                    $('#repeat').css('border-width', '');
                    $('#repeat').css('border-color','');
                    $('input[type="text"] ,input[type="password"],input[type="email"]').val("");
                    $('#alert').text("");
                    $('#pass').css('color','grey');
                },
         });
}

$("#repeat").keyup(password_match);

function password_match() {
    var val1 = $('#passwd').val();
    var val2 = $('#repeat').val();
    if(val1!=val2){
          //console.log(val1,val2);
          $('#alert').text("Password do not match");
          $('#alert').css('color','red');
          return 1;
    }else{
          console.log(val1,val2);
          $('#alert').text("Passwords match");
          $('#alert').css('color','green');
          return 0;
    }
}


function validate_password() {
     var val = $('#passwd').val();
     var len = val.length;
     var patt1 = new RegExp("[0-9]");
     var patt2 = new RegExp("[a-z]");
     var patt3 = new RegExp("[A-Z]");
     var flag=0;

     if(len<5){
        console.log("length test passed");
        flag=1;
     }else if(patt1.test(val)==false){
         flag=1;
     } else if(patt2.test(val)==false && patt3.test(val)==false){
         flag=1;
     }

    if(flag){
         $('#pass').css('color','red');
         $('#passwd').css('border-style','outset');
         $('#passwd').css('border-width', 'thin');
         $('#passwd').css('border-color','red');
    }
    return flag;
};

$( document ).ready(function() {
  if(msg){
         $('#message').text("Email id and password do not match");
         $('#message').removeClass().addClass("danger");
  }
});
