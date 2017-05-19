window.onload = function(){

  //Create reference to the create button
  var createButton = document.getElementById("createButton");
  //Create reference to the sign in button
  var signin_button = document.getElementById("signin_button");

  //Check if the create button is pressed
  createButton.onclick = function(){
  	//Get email input
 	var email = document.getElementById("email").value;
 	//Get password input
  	var password = document.getElementById("password").value;
  	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result){ 
  		console.log('result', result);
  		// Executed when the user is signed in.
		if (result) {
		  //Get name input
		  var user_displayName = document.getElementById("name").value;
		  //Update user display name with the name input obtained
		  result.updateProfile({displayName: user_displayName});
		  //Create an object with all the attributes of the user
		  var user_info = {id: result.uid, email: result.email, display_name: user_displayName };
		  //Declare database
		  var database = firebase.database();
		  //Create a user in the firebase data-base
		  database.ref().child('users/').push({
		      display_name: user_info.display_name,
		      id: user_info.id,
		      email: user_info.email,
		      total_event_created: 0,
		      total_event_active: 0
		   //Executed after the database have been updates,
		   //redirects to index.html
		   }).then(function(){
		   		location.href = "index.html";
		   });;
		//Indicate if something went wrong
		} else {
		  alert("Something went wrong.");
		}
  	})
    .catch(function(error) {
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
	})
  }

  //Check if the sign in button is pressed
  signin_button.onclick = function(){
  	window.location = "login.html";
  }
}







