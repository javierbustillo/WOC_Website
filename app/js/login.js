//Setup Firebase 
  var config = {
     apiKey: "AIzaSyCIUFSaKhAX1z3aI3-iOqeCQGOATPP7XHY",
     authDomain: "whats-on-campus.firebaseapp.com",
     databaseURL: "https://whats-on-campus.firebaseio.com",
     projectId: "whats-on-campus",
     storageBucket: "whats-on-campus.appspot.com",
     messagingSenderId: "2443063959"
  };
  firebase.initializeApp(config);

//Initialize Firebase Instances
var auth = firebase.auth(),
    storage = firebase.storage(),
    database = firebase.database();

//wait for DOM to be ready
$(function() {
	$("form[name='login-form']").validate({
		rules: {
			email_login_form: {
				required: true,
				email: true
			},
			password_login_form: {
				required: true,
				minlength: 8
			}
		},
		messages: {
			email_login_form: {
				required: "An email address is required",
				email: "Please enter a valid email address"
			},
			password_login_form: {
				required: "Password is required",
				minlength: "Your Password must be at least 8 characters long"
			}
		},
		submitHandler: function(form) {
			form.submit();
		}
	});
	
	$("form[name='register']").validate({
			rules: {
				fullname_register_form: {
					required: true
				},
				email_register_form: {
					required: true,
					email: true
				},
				password_register_form: {
					required: true,
					minlength: 8
				}
			},
			messages: {
				fullname_register_form: {
					required: "Your name is required"
				},
				email_register_form: {
					required: "An email address is required",
					email: "Please enter a valid email address"
				},
				password_register_form: {
					required: "Password is required",
					minlength: "Your Password must be at least 8 characters long"
				}
			},
			submitHandler: function(form) {
				form.submit();
			}
	});
	
	$("form[name='register']").children().keyup(function(event){
    if(event.keyCode == 13){
        $("#create_button").click();
    }
	});

	$("form[name='login-form']").children().keyup(function(event){
    if(event.keyCode == 13){
        $("#loginButton").click();
    }
	});

  $("#loginButton").click(signIn);
  $("#create_account").click(loadRegisterForm);
  $("#signin_button").click(loadLoginForm);
  $("#logout_button").click(signOut);
  $("#create_button").click(createNewAccount);

});

function signIn(){

	var email_input = $("#email_login_form").val();
    var password_input = $("#password_login_form").val();

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
    var errorCode = error.code;
		var errorMessage = error.message;
		var error_element = document.getElementById("error");

		if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found') {
				$("form[name='login-form']").valid();
				error_element.innerHTML = "Invalid email or password";
		}
	});
}

function createNewAccount(){

  var email = $("#email_register_form").val(),
  	  password = $("#password_register_form").val();

  console.log(email);

  auth.createUserWithEmailAndPassword(email, password).then(function(user){

	if (user) {

	  var user_display_name = $("#name_register_form").val();
	  user.updateProfile({
	  	displayName: user_display_name
	  });

	  database.ref("users/"+user.uid).set({
		display_name: user_display_name,
		id: user.uid,
		email: user.email,
		total_event_created: 0,
		total_event_active: 0,
		current_saved_events_counter: 0,
		is_admin: false
	  }).then(redirectToIndexPage);
	} else {
	  alert("Something went wrong.");
    }
  }).catch(function(error) {
		//Handle errors
		var errorCode = error.code;
		var errorMessage = error.message;
		var error_element = document.getElementById("error");

		if (errorCode == 'auth/email-already-in-use') {
			error_element.innerHTML = "The email is already in use";
		} else if (errorCode == 'auth/invalid-email') {

		} else if (errorCode == 'auth/weak-password') {

		}else{
			error_element.innerHTML = "Something went wrong";
		}

		$("form[name='register']").valid();
		console.log(error);
  });
}

function signOut(){
	auth.signOut();
	location.replace("login.html");
}

function loadRegisterForm(){
	$("#login_page").prop('hidden', true);
	$("#register_page").prop('hidden', false);
}

function loadLoginForm(){
	$("#register_page").prop('hidden', true);
	$("#login_page").prop('hidden', false);
}

function redirectToSubmitEventPage(){
	window.location.replace("submit_event.html");
}

function redirectToIndexPage(){
	window.location.replace("index.html");
}