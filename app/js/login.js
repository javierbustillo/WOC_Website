window.onload = function(){

	var loginButton = document.getElementById("loginButton");
	var createButton = document.getElementById("create_account");
	console.log('user', firebase.auth().currentUser);

	loginButton.onclick = function(){
		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;

		if(!email || !password) {
			return console.log("email and password required");
		}

		firebase.auth().signInWithEmailAndPassword(email, password)
		  .then(function(){
    	var user = firebase.auth().currentUser;
		console.log(user);
		if (user) {
		  // User is signed in.
		  window.location = "index.html"
		} else {
		  alert("Something went wrong.");
		}
  	})
  	 .catch(function(error) {

		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  if (errorCode === 'auth/wrong-password') {
		    alert('Wrong password.');
		  } else {
		    alert(errorMessage);
		  }
		  console.log(error);
		});
	}

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
