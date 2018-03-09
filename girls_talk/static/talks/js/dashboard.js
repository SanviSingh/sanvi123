var overlay = $('.overlay');

function viewAnswer(e){
    var qid = e.id;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    var parentid = $("#"+qid).parent().attr("id")
    console.log(parentid);

    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/view_ans/',
                type: "POST",
                data: { 'qid' : qid ,'back':parentid},
                success: function (data) {
                    overlay.hide();
                    $("#change_content").replaceWith(data.posts_html);
              }
        });
};

function writeAnswer(e){
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    var qid = e.id.split("_")[1];

    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/write_ans/',
                type: "POST",
                data: { 'csrf':csrftoken , 'qid':qid},
                success: function (data) {
                    overlay.hide();
                    $("#change_content").replaceWith(data.posts_html);
              }
        });
}

function postAnswer(e){
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    event.preventDefault();
    var qid= $("form").attr("id").split("_")[1];
    var atext = $("#answer").val();
    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/post_ans/',
                type: "POST",
                data: { 'atext':atext, 'qid':qid},
                success: function (data) {
                    overlay.hide();
                    $("#change_content").replaceWith(data.posts_html);
              }
        });

}
function postQuestion(e){
    event.preventDefault();
    var genre = $("#genre").val();
    var qtext = $("#question").val();
    var qdesc = $("#description").val();
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/post_ques/',
                type: "POST",
                data: { 'genre':genre ,'qtext':qtext, 'qdesc':qdesc},
                success: function (data) {
                    overlay.hide();
                    $("#msg").show(0).delay(10000).hide(0);
                    $("#msg").removeClass().addClass("postmsg");
                    $(".form-control").val("");
              }
        });
}

function loadEditAnswer(e){
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    var qid = e.id.split("_")[1];
    var aid = e.id.split("_")[0];
    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/show_edit/',
                type: "POST",
                data: { 'csrf':csrftoken , 'qid':qid , 'aid':aid},
                success: function (data) {
                    overlay.hide();
                    console.log(data+"success");
                    $("#change_content").replaceWith(data.posts_html);
              }
        });
}

function postEditedAnswer(e){
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    event.preventDefault();
    var qid=$("form").attr("id").split("_")[0];
    var aid= $("form").attr("id").split("_")[1];
    var atext = $("#answer").val();
    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/post_edit/',
                type: "POST",
                data: { 'atext':atext, 'qid':qid , 'aid':aid},
                success: function (data) {
                    overlay.hide();
                    $("#change_content").replaceWith(data.posts_html);
              }
    });

}
function pressLike(e){
   var aid = e.id; 
   var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();

    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/press_like/',
                type: "POST",
                data: { 'aid':aid },
                success: function (data) {
                    overlay.hide();
                    $('#'+aid).attr('disabled', true);
                    $('#label'+aid).text(data.likes+" like")
                    window.location.href=(window.location.href).split("#")[0]+"#"+aid;
              }
        });
}

function backToQues(e){
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();

    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/top_feed/',
                type: "POST",
                data: { },
                success: function (data) {
                    overlay.hide();
                    $("#change_content").replaceWith(data.posts_html);
              }
        });
}
function showMyQuestion(){
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();

    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/my_ques/',
                type: "POST",
                data: { },
                success: function (data) {
                    overlay.hide();
                    $("#change_content").replaceWith(data.posts_html);
              }
        });
}
function showMyAnswer(){
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();

    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/my_ans/',
                type: "POST",
                data: { },
                success: function (data) {
                    overlay.hide();
                    $("#change_content").replaceWith(data.posts_html);
              }
        });

}
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$(document).ready(function () {
  var trigger = $('.hamburger'),
      overlay = $('.overlay'),
     isClosed = false;

    trigger.click(function () {
      hamburger_cross();      
    });

    function hamburger_cross() {

      if (isClosed == true) {          
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {   
        //overlay.show();
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
  }
  
  $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
  });  

//function to create search questions form
$('#search').click(function(e){
    e.preventDefault();
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();

    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/load_search/',
                type: "POST",
                data: { },
                success: function (data) {
                    overlay.hide();
                    $("#change_content").replaceWith(data.posts_html);
              }
        });

});

$('#ask_ques').click(function(e){
    e.preventDefault();
    loadQuestionForm();
});

function loadQuestionForm(){
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
   
    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/ask/',
                type: "POST",
                data: { 'csrf':csrftoken},
                success: function (data) {
                    overlay.hide();
                    $("#change_content").replaceWith(data.posts_html);
              }
        });

}
// function to create dashboard div

// function to create top feeds div
$('#feed').click(function(e){
    e.preventDefault();
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();

    $.ajax({
                beforeSend: function(xhr, settings) {
                     overlay.show();
                     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                           xhr.setRequestHeader("X-CSRFToken", csrftoken);
                     }
                },
                url: '/talks/top_feed/',
                type: "POST",
                data: { },
                success: function (data) {
                    overlay.hide();
                    $("#change_content").replaceWith(data.posts_html);
              }
        });

});

//funtion to show my questions
$('#myques').click(function(e){
       e.preventDefault();
       showMyQuestion();
});

//function to show my answers
$('#myans').click(function(e){
    e.preventDefault();
    showMyAnswer();
});


// function to create ask question form


// function to create edit profile form

//function to create settings form

});
