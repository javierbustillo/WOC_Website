window.onload=function(){
	var loginButton = document.getElementById("loginButton");
	loginButton.onclick=function(){
		location.href = "index.html";
	}
}

firebase.auth().onAuthStateChanged(function (firebaseUser) {
        if (firebaseUser) {
          firebaseUser.sendEmailVerification().then(function() {
            // Email sent.
          }, function(error) {
            // An error happened.
          })
            ....

        } else {
            ....
        }
});

