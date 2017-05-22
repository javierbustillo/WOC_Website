//MAIN PROGRAM -- MAIN PROGRAM -- MAIN PROGRAM -- MAIN PROGRAM

$(document).ready(function() {
  //Load the header and executes onHeaderLoad()
	$("#header").load("header.html", onHeaderLoad);
});


//FUNCTIONS -- FUNCTIONS -- FUNCTIONS -- FUNCTIONS -- FUNCTIONS

//To be executed after the header is loaded.
function onHeaderLoad(){
  //Check if the log out button is pressed
  checkSignOutButton();
  //Assign username on header
  assignUsernameOnHeader();
  //Load ALL events
  loadAllEvents();
}

//Check if the log out button is pressed and sign out the user
function checkSignOutButton(){
    $( "#logout_button" ).click(function() {
       firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location = "login.html";
      }, function(error) {
        // An error happened.
        alert(error);
      });
    });
}

//Assign username on header
function assignUsernameOnHeader(){
  //Check if a user is logged in.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var username = document.getElementById('username');
      var username_obtained;
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
}

//Load ALL events
function loadAllEvents(){

}


