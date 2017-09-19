//Initialize Firebase
var auth = firebase.auth(),
    storage = firebase.storage(),
    database = firebase.database();

//wait for DOM to be ready
$(function() {
	$("#error").fadeIn(100).fadeOut(100).fadeIn(100);
	$("form[name='login-form']").validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				minlength: 8
			}
		},
		messages: {
			email: {
				required: "An email address is required",
				email: "Please enter a valid email address"
			},
			password: {
				required: "Password is required",
				minlength: "Your Password must be at least 8 characters long"
			}
		},
		submitHandler: function(form) {
			form.submit();
		}
	});
	$("form[name='login-form']").children().keyup(function(event){
    if(event.keyCode == 13){
        $("#loginButton").click();
    }
	});

  $("#loginButton").click(signIn);
  $("#create_account").click(redirectToRegisterPage);
  $("logout_button").click(signOut);
});

function signIn(){

	var email_input = $("#email").val();
  var password_input = $("#password").val();

  	auth.signInWithEmailAndPassword(email_input, password_input)
    .then(function(user_from_auth){

		if (user_from_auth) {
			database.ref("users/"+user_from_auth.uid).once('value').then(function(user_from_database){
      			var user = user_from_database.val();
			    if(user.is_admin){
				  redirectToIndexPage();
			    } else{
				  redirectToIndexPage();
			    }
			});
		}else {
			alert("Something went wrong.");
		}

	}).catch(function(error) {

		console.log(error);


    var errorCode = error.code;
		var errorMessage = error.message;
		var error_element = document.getElementById("error");

		if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found') {
				$("form[name='login-form']").valid();
				error_element.innerHTML = "Invalid email or password";
		}
	});
}

function signOut(){
	auth.signOut();
	location.replace("login.html");
}

function redirectToRegisterPage(){
	location.replace("register.html");
}

function redirectToSubmitEventPage(){
	window.location.replace("submit_event.html");
}

function redirectToIndexPage(){
	window.location.replace("index.html");
}