
window.onload = function(){

	var singoutButton = document.getElementById('logout_button');

	firebase.auth().onAuthStateChanged(function(user) {
		console.log(user);
  		if (user) {
    		// User is signed in.
    		var username = document.getElementById('username');
			var username_obtained;
			console.log(user);
			if (user!=null) {
  				username_obtained = user.displayName;
			} else {
				alert("Something went wrong.");
			}
			username.innerHTML = username_obtained;
  		} else {
    		window.location = "login.html";
  		}
  	});

  	singoutButton.onclick = function(){
  		firebase.auth().signOut().then(function() {
  		// Sign-out successful.
  		window.location = "login.html";
		}, function(error) {
  		// An error happened.
		});
  	}
}
	


