$(document).ready(function() {
  //Loads header
  $("#header").load("header_organization.html", function(){
    console.log("Header loaded.");

    // Set up UI elements
    var publish_button = document.querySelector("#publish_button"),
        logout_button = document.querySelector("#logout_button"),
        cancel_button = document.querySelector("#cancel_button"),
        username = document.querySelector("#username_organizational"),
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
    var total_counter, active_counter, user_info, user_id, user_display_name, file_name, isUploaded, file_path;

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
        user_display_name = user_info.displayName;
        //Assign username to header
        username_organizational.innerHTML = user_display_name;
        database.ref("users/"+user_id).once("value").then(function(snapshot){
          total_counter = snapshot.val().total_event_counter;
          active_counter = snapshot.val().active_event_counter;
        });
      }else{
        window.location = "login.html";
      }
    });
    
    //Upload image to storage
    image_input.addEventListener('change', function(e){
      if(isUploaded==true){
        storage.ref(file_path).delete();
        console.log("Image has been deleted.")
        isUploaded=false;
      }

      //Get image file
      var file = e.target.files[0];
      file_name = 'image_' + Math.random().toString(36).substr(2, 9);
      console.log("file_name =", file_name);
      file_path = "events/"+user_id+"/"+file_name;
      //Upload image to storage
        var task = storage.ref(file_path).put(file);
        //Update progress bar
        task.on('state_changed',
          function progress(snapshot){
            var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            console.log(percentage);
          },
          function error(err){
          },
          function complete(){
            isUploaded=true;
            console.log("Image has been uploaded.");
          });
      });

      //Publish event
      publish_button.addEventListener('click', function(e){
          if(isUploaded){
          console.log("Publish button have been pressed.");
          //Increment counters
          database.ref("users/"+user_id).update({total_event_counter: total_counter+1});
          database.ref("users/"+user_id).update({active_event_counter: total_counter+1});

          //Save event info to database and get the unique ID
          database.ref("events/").push({
            title: title.value,
            date: date.value,
            hour: hour.value,
            place: place.value,  
            brief_description: brief_description.value,
            detailed_description: detailed_description.value,
            contact_email: contact_email.value,
            contact_phone_number: contact_phone_number.value,
            imageUrl: file_path,
            user_id: user_id,
          })
          console.log("New event created.");
        }else{
          alert("Wait for image to upload");
        }
      });

      //Cancel form submit
      cancel_button.addEventListener('click', function(e){
        if(isUploaded){
          storage.ref(file_path).delete();
          console.log("Image has been deleted.");
        }
        window.location = "submit_event.html";
      });
    
  });
});



