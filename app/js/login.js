//MAIN PROGRAM -- MAIN PROGRAM -- MAIN PROGRAM -- MAIN PROGRAM

$(document).ready(function() {

  //Set up UI elements
  var login_button = document.querySelector("#loginButton"),
      create_button = document.querySelector("#create_account"),
      email = document.querySelector("#email"),
      password = document.querySelector("#password"),
      error_element = document.querySelector("#error");
      

  //Initialize Firebase
  var auth = firebase.auth();

  //Check create new account button
  create_button.addEventListener('click', function(e){
  	window.location = "register.html";
  });

  //Check log in button
  login_button.addEventListener('click', function(e){
  	var email_input = email.value;
  	var password_input = password.value;
  	auth.signInWithEmailAndPassword(email_input, password_input)
    .then(function(){
  	  var user = auth.currentUser;
	  if (user) {
	    //Executed if user have administrative permissions.
	    if(user.uid=="91hV0DsJ0nV67rbOgzN2uzjN0Xc2"){
		  window.location = "submit_event.html";
	    }
	    //Executed if is a regular user
	    else{
		  window.location = "index.html";
	    }
	  }else {
	    alert("Something went wrong.");
	  }
    }).catch(function(error) {
	  // Handle Errors
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  //Verifies if email and password was typed
	  if(!email || !password) {
		error_element.innerHTML = "Email and password required";
	  } else {
		if (errorCode === 'auth/wrong-password') {
		  error_element.innerHTML = "Wrong password";
		} else if(errorCode==='auth/invalid-email') {
		  error_element.innerHTML = "Please enter a valid email address";
		  } else if(errorCode==='auth/user-not-found') {
			error_element.innerHTML = "Incorrect credentials";
		  }
		}
    });
  });
});