//Initialize Firebase
var auth = firebase.auth(),
    storage = firebase.storage(),
    database = firebase.database();

$(document).ready(function() {
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
		current_saved_events_counter: 0,
		is_admin: false
	  }).then(redirectToIndex);
	} else {
	  alert("Something went wrong.");
    }
  }).catch(function(error) {
	//Handle errors
	var errorCode = error.code;
	var errorMessage = error.message;
	if (errorCode == 'auth/weak-password') {
	  alert('The password is too weak.');
	} else if (errorCode == 'auth/email-already-in-use') {
	  alert('The email is already in use.');
	} else if (errorCode == 'auth/invalid-email') {
	  alert('The email is not valid.');
	}else if (errorCode == 'auth/operation-not-allowed') {
	  alert('This operation is not allowed.');
	}else{
	  alert(errorMessage);
	}
	console.log(error);
  });
}

function redirectToLoginPage(){
	window.location.replace("login.html");
}

function redirectToIndex(){
	window.location.replace("index.html");
}



