window.onload = function(){

  $("#header").load("header_organization.html", onHeaderLoad);

  //Executed after the header is loaded.
  function onHeaderLoad(){
    
    //Check if the log out button is pressed
    var signoutButton = document.getElementById("logout_button");
    signoutButton.onclick = function(){

      //Sign-out the user
      firebase.auth().signOut().then(function() {
        window.location = "login.html";
      }, function(error) {
        alert(error);
        });
    }
  }


    //Check if a user is logged in.
    firebase.auth().onAuthStateChanged(function(user) {
        //Execute if the user is logged in
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


  //Check if the publish button is pressed
  var publish_button = document.getElementById("publish_button");
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
      
        //Get user's id
        var user_id = firebase.auth().currentUser.uid;
        //Get user's total event created counter
        return database.ref('users/' + user_id).once('value').then(function(snapshot) {
            return snapshot.val().total_event_created;
            }).then(function(counter) {
              //Increase the total_event_counter by one
              var counter = counter +1;
              database.ref('users/'+user_id+'/total_event_created').set(counter);   
              //Post event into firebase database
              database.ref('events/' + user_id + '/' +  counter).set({
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
        });
        

        
      }
  
}

