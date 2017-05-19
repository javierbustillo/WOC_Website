window.onload = function(){

	var loginButton = document.getElementById("loginButton");
	var createButton = document.getElementById("create_account");

	console.log('user', firebase.auth().currentUser);

	//Executes when the login button is pressed.
	loginButton.onclick = function(){
		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;
		var errorElement = document.getElementById("error");

		//Sign in with email and password
		firebase.auth().signInWithEmailAndPassword(email, password)
		 	.then(function(){
		 		//Redirect if there is no errors.
    			var user = firebase.auth().currentUser;
				console.log(user);
				if (user) {
		 		// User is signed in.
		 			//Check if have administrative permissions.
		 			console.log('user ID', user.uid);
		 			if(user.uid=="XpgpHHPBGdTUIRT0n9t6u7yVoYe2"){
		 				window.location = "submit_event.html";
		 			}
		 			else{
		 				window.location = "index.html";
		 			}
				} else {
			 	 alert("Something went wrong.");
			}
  			})
  	 		.catch(function(error) {
		 		// Handle Errors here.
		  		var errorCode = error.code;
		  		var errorMessage = error.message;
		  		//Verifies if email and password was typed.
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

			}
		);
	}

	//Executes when the Create Account link is pressed.
	createButton.onclick = function(){
		window.location = "register.html";
	}
}

// // Register a new user
// firebase.auth().createUserWithEmailAndPassword(email, password)
//  .catch(function (err) {
//    // Handle errors
//  });

// // Sign in existing user
// firebase.auth().signInWithEmailAndPassword(email, password)
//  .catch(function(err) {
//    // Handle errors
//  });

// // Sign out user
// firebase.auth().signOut()
//  .catch(function (err) {
//    // Handle errors
//  });
