//Initialize Firebase
var auth = firebase.auth(),
    storage = firebase.storage(),
    database = firebase.database();

$(function() {
	$("form[name='register']").validate({
		rules: {
			fullname: {
				required: true
			},
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
			name: {
				required: "Your name is required"
			},
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

	$("form[name='register']").children().keyup(function(event){
    if(event.keyCode == 13){
        $("#create_button").click();
    }
	});

  $("#signin_button").click(redirectToLoginPage);
  $("#create_button").click(createNewAccount);
});

function createNewAccount(){

  var email = $("#email").val(),
  	  password = $("#password").val();

  auth.createUserWithEmailAndPassword(email, password).then(function(user){

	if (user) {

	  var user_display_name = $("#name").val();
	  user.updateProfile({
	  	displayName: user_display_name
	  });

	  database.ref("users/"+user.uid).set({
		display_name: user_display_name,
		id: user.uid,
		email: user.email,
		total_event_created: 0,
		total_event_active: 0,
		is_admin: false
	  }).then(redirectToIndex);
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

function redirectToLoginPage(){
	window.location.replace("login.html");
}

function redirectToIndex(){
	window.location.replace("index.html");
}



