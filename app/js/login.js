window.onload = function(){

	var loginButton = document.getElementById("loginButton");
	var email = document.getElementById("email");
	var password = document.getElementById("password").value;

	console.log("we're here");


	loginButton.onclick = function(email,password){
		console.log(email);
		firebase.auth().signInWithEmailAndPassword(email, password)
		 .catch(function(err) {
		 	alert("error");
		 	console.log("there is an error");
		 });

		firebase.auth().onAuthStateChanged(function(user) {
		 window.user = user; // user is undefined if no user signed in
		});

		window.location = "http://google.com";
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
