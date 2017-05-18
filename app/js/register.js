window.onload = function(){

  var createButton = document.getElementById("createButton");
  var signin_button = document.getElementById("signin_button");
  createButton.onclick = function(){
  	
 	var email = document.getElementById("email").value;
  	var password = document.getElementById("password").value;
  	
  	

  	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
    	var user = firebase.auth().currentUser;
		console.log(user);
		if (user) {
		  // User is signed in.
		  user.updateProfile({displayName: document.getElementById("name").value});
		  window.location = "index.html"
		} else {
		  alert("Something went wrong.");
		}
  	})
    .catch(function(error) {
	  // Handle Errors here.
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
	})
  }

  singoutButton.onclick = function(){
  		window.location = "login.html";
  	}
}







