
window.onload = function(){

  /* HEADER - HEADER - HEADER - HEADER - HEADER - HEADER - HEADER */
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
    		//window.location = "login.html";
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


  /* FORM - FORM - FORM - FORM - FORM - FORM - FORM - FORM */
  var database = firebase.database();

  var publish_button = document.getElementById("publish_button");
  publish_button = postNewEvent();

  function postNewEvent(){
      console.log("HERE");
      var userId = firebase.auth().currentUser;
      console.log("UserID = "+userId);
      userId = userId.uid;
      console.log(userId);
      var title = document.getElementById("title").value;
      var date = document.getElementById("date").value;
      var hour = document.getElementById("hour").value;
      var place = document.getElementById("place").value;
      var brief_description = document.getElementById("brief_description").value;
      var detailed_description = document.getElementById("detailed_description").value;
      var contact_email = document.getElementById("contact_email").value;
      var contact_phone_number = document.getElementById("contact_phone_number").value;
      var imageUrl = document.getElementById("imageUrl").value;
   
      /*
      eventId = firebase.database().ref('/events/' + userId +'/event_counter');
      eventId.once('value').then(function(snapshot) {
          var event_counter = snapshot.val().event_counter;
         return event_counter+1;});
      console.log("event ID = "+eventId);

      firebase.database().ref('events/' + organizationId).set({
        event_counter: eventId
      });
      */


      firebase.database().ref('events/' + userId + '/001').set({
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
  }

}

