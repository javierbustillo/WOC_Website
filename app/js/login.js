//Initialize Firebase
var auth = firebase.auth(),
    storage = firebase.storage(),
    database = firebase.database();

$(document).ready(function() {
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
				  redirectToSubmitEventPage();
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

		if(!email || !password) {
			error_element.innerHTML = "Email and password required";
		} else {
			if (errorCode === 'auth/wrong-password') {
				error_element.innerHTML = "Wrong password";
			} else {
				if(errorCode==='auth/invalid-email') {
				error_element.innerHTML = "Please enter a valid email address";
				} else {
					if(errorCode==='auth/user-not-found') {
						error_element.innerHTML = "Incorrect credentials";
					}
				}
			}
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


