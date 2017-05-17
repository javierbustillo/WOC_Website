window.onload = function(){

  var createButton = document.getElementById("createButton");

  createButton.onclick = function(){
  	var name = document.getElementById("name").value;
 	var email = document.getElementById("email").value;
  	var password = document.getElementById("password").value;


  	firebase.auth().createUserWithEmailAndPassword(email, password)
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
	  alert(error);
	});



  }
  


  
}