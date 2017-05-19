window.onload = function(){

  $("#header").load("header_organization.html", onHeaderLoad);

  //To be executed after the header is loaded.
  function onHeaderLoad(){
    
    //Check if the log out button is pressed. 
    var signoutButton = document.getElementById("logout_button");

    signoutButton.onclick = function(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location = "login.html";
      }, function(error) {
        // An error happened.
        alert(error);
        });
    }
  }

  var publish_button = document.getElementById("publish_button");


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


  //Check if the publish button is pressed
  publish_button.onclick = postNewEvent();

  //Push a new event into the firebase database
  function postNewEvent(){
      
      firebase.auth().onAuthStateChanged(function(user) {

        //Declare firebase data-base
        var database = firebase.database();

        //Get input from form
        var title = document.getElementById("title").value;
        var date = document.getElementById("date").value;
        var hour = document.getElementById("hour").value;
        var place = document.getElementById("place").value;
        var brief_description = document.getElementById("brief_description").value;
        var detailed_description = document.getElementById("detailed_description").value;
        var contact_email = document.getElementById("contact_email").value;
        var contact_phone_number = document.getElementById("contact_phone_number").value;
        var imageUrl = document.getElementById("imageUrl").value;
      
        //Get user id
        user_id = user.uid;

        //Get user total_event_counter
        var userId = firebase.auth().currentUser.uid;
        return database.ref('users/' + user_id).once('value').then(function(snapshot) {
              var total_event_created = snapshot.val().total_event_created;
              console.log("total_event_counter",total_event_created);
        });
        

        //Push event into firebase database
        database.ref('events/' + user_id + '/001').set({
        title: title,
        date: date,
        hour: hour,
        place: place,
        brief_description: brief_description,
        detailed_description: detailed_description,
        contact_email: contact_email,
        contact_phone_number: contact_phone_number,
        imageUrl: imageUrl
        });
      });
  } 
}

