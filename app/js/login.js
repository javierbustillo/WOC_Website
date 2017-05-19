//MAIN PROGRAM -- MAIN PROGRAM -- MAIN PROGRAM -- MAIN PROGRAM

$(document).ready(function() {
  //Executed when the Create Account link is pressed
  //and redirects to register.html
  checkCreateAccountButton();
  checkLogInButton();
});

//FUNCTIONS -- FUNCTIONS -- FUNCTIONS -- FUNCTIONS -- FUNCTIONS

//Executed when the Create Account link is pressed
//and redirects to register.html
function checkCreateAccountButton(){
  var create_button = document.getElementById("create_account");
  create_button.onclick = function(){
	window.location = "register.html";
  }
}

//Executed when the login button is pressed
//and executes signInUser()
function checkLogInButton(){
  var loginButton = document.getElementById("loginButton");
  loginButton.onclick = signInUser;
}

//Sign in user into account
function signInUser(){
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var errorElement = document.getElementById("error");
  //Sign in with email and password
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(){
  	var user = firebase.auth().currentUser;
	//Executed if user is signed in.
	if (user) {
	  //Executed if user have administrative permissions.
	  if(user.uid=="91hV0DsJ0nV67rbOgzN2uzjN0Xc2"){
		window.location = "submit_event.html";
	  }
	  //Executed if is a regular user
	  else{
		window.location = "index.html";
	  }
	} else {
	  alert("Something went wrong.");
	}
  })
  .catch(function(error) {
	  // Handle Errors
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  //Verifies if email and password was typed
	  if(!email || !password) {
		errorElement.innerHTML = "Email and password required";
	  } else {
		if (errorCode === 'auth/wrong-password') {
		  errorElement.innerHTML = "Wrong password";
		} else if(errorCode==='auth/invalid-email') {
		  errorElement.innerHTML = "Please enter a valid email address";
		  } else if(errorCode==='auth/user-not-found') {
			errorElement.innerHTML = "Incorrect credentials";
		  }
		}
  });
}