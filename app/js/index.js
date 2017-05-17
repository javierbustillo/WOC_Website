var user = firebase.auth().currentUser;

if(user != null) {
	console.log(user);
} else {
	console.log("not logged in ");
	window.location = "login.html";
}
