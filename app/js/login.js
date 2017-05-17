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

 		firebase.auth().onAuthStateChanged(function(user) {
			window.user = user; // user is undefined if no user signed in
			console.log('user', user);
			var name, email;
			if (user != null) {
			email = user.email;
			alert(email);
		  	// The user's ID, unique to the Firebase project. Do NOT use
                   			 // this value to authenticate with your backend server, if
                  			 // you have one. Use User.getToken() instead.
            window.location = "index.html";
            alert("HERE");
			}
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
