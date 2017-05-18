
window.onload = function(){

	var singoutButton = document.getElementById('logout_button');

  //Check if a user is logged in.
	firebase.auth().onAuthStateChanged(function(user) {
		console.log(user);
  		if (user) {
    		
    		var username = document.getElementById('username');
			  var username_obtained;
			  console.log(user);
        //Get the name of the user.
			  if (user!=null) {
  				username_obtained = user.displayName;
			  } else {
				  alert("Something went wrong.");
			  }
        //Assign it to the header. 
		  	username.innerHTML = username_obtained;
        //If the user is not logged in, 
        //returns it to the login page.
  		} else {
    		window.location = "login.html";
  		}
  	});

    //Checks if the log out button is pressed. 
  	singoutButton.onclick = function(){
  		firebase.auth().signOut().then(function() {
  		// Sign-out successful.
  		window.location = "login.html";
		}, function(error) {
  		// An error happened.
		});
  	}
}
	


