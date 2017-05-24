
$(document).ready(function() {
  //Loads header
  $("#header").load("header_organization.html", function(){
    console.log("Header loaded.");

    // Set up UI elements
    var publish_button = document.querySelector("#publish_button"),
        logout_button = document.querySelector("#logout_button"),
        username = document.querySelector("#username"),
        title = document.querySelector("#title"),
        date = document.querySelector("#date"),
        hour = document.querySelector("#hour"),
        place = document.querySelector("#place"),
        brief_description = document.querySelector("#brief_description"),
        detailed_description = document.querySelector("#detailed_description"),
        contact_email = document.querySelector("#contact_email"),
        contact_phone_number = document.querySelector("#contact_phone_number"),
        image_input = document.querySelector("#imageUrl");
    console.log("Inputs referenced.");

    //Set user attributes
    var total_counter, active_counter, user_info, user_id, user_display_name, file_path;

    //Initialize Firebase
    var auth = firebase.auth(),
        storage = firebase.storage(),
        database = firebase.database();
    console.log("Firebase inizialized.");

    //Logout 
    logout_button.addEventListener('click', function(e){
      auth.signOut();
      console.log("You have been logged out");
      window.location = "index.html";
    });


    //Check user auth
    auth.onAuthStateChanged(function(user) {
      //Get user full data
      user_info = user;
      if(user){
        console.log("User detected.");
        user_id = user_info.uid;
        console.log("User id read.");
        user_display_name = user_info.displayName;
        console.log("User display name read.");
        //Assign username to header
        console.log(username);
        username.innerHTML = user_display_name;
        database.ref("users/"+user_id).once("value").then(function(snapshot){
          total_counter = snapshot.val().total_event_counter;
          console.log("Total event counter read.");
          active_counter = snapshot.val().active_event_counter;
          console.log("Active event counter read.");
          file_path = snapshot.metadata.fullPath;
        });
      }else{
        window.location = "login.html";
      }
    });
    
    //Publish event
    publish_button.addEventListener('click', function(e){
      console.log("Publish button have been pressed.");
      database.ref("users/"+user_id).update({total_event_counter: total_counter+1});
      console.log("Total event counter incremented by 1.");
      database.ref("users/"+user_id).update({active_event_counter: total_counter+1});
      console.log("Active event counter incremented by 1.");
      database.ref("events/").push({
        title: title.value,
        date: date.value,
        hour: hour.value,
        place: place.value,  
        brief_description: brief_description.value,
        detailed_description: detailed_description.value,
        contact_email: contact_email.value,
        contact_phone_number: contact_phone_number.value,
        imageUrl: imageUrl.value,
        user_id: user_id,
        file_path: file_path
      });
      console.log("New event created.");
    });
  });
});




