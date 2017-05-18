window.onload = function(){

  var createButton = document.getElementById("createButton");
  var signin_button = document.getElementById("signin_button");

  createButton.onclick = function(){
  	
 	var email = document.getElementById("email").value;
  	var password = document.getElementById("password").value;
  	
  	

  	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result){ 
  		console.log('result', result);
		if (result) {
		  // User is signed in.
		  result.updateProfile({displayName: document.getElementById("name").value});
		  console.log('result display name',result.displayName);
		  var user_info = {id: result.uid, email: result.email, display_name: result.displayName};
		  console.log('user_info', user_info);
		  // Storing user info into database.
		  var database = firebase.database();

		  console.log('user id', user_info.id);
		  database.ref().child('users/').push({
		      displayName: user_info.display_name,
		      id: user_info.id,
		      email: user_info.email
		   }).then(function(){
		   		location.href = "index.html";
		   });;
		  
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


  signin_button.onclick = function(){
  	window.location = "login.html";
  }
}







