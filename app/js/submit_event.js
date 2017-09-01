//Initialize Firebase
var auth = firebase.auth(),
    storage = firebase.storage(),
    database = firebase.database();

$(document).ready(function() {
  $("#header").load("header_organization.html", function(){

    auth.onAuthStateChanged(function(user) {
      if(user){
        assignUsernameToHeader(user.displayName);
        $("#publish_button").click(user, uploadEventToDatabase);
        $("#cancel_button").click(reloadPage);
        $("#logout_button_organizational").click(signOut);
      }else{
        window.location.replace("login.html");
      }
    });

  });
});


function uploadEventToDatabase(event_object_user){

  user=event_object_user.data;

  var title = $("#title").val(),
      date = $("#date").val(),
      hour = $("#hour").val(),
      timestamp = new Date(date+hour).getTime(),
      place = $("#place").val(),
      brief_description = $("#brief_description").val(),
      detailed_description = $("#detailed_description").val(),
      contact_email = $("#contact_email").val(),
      contact_phone_number = $("#contact_phone_number").val(),
      cancel_button = $("#cancel_button");


  console.log(timestamp);
      
  cancel_button.disabled = true;

  database.ref("users/"+user.uid).once("value").then(function(user_reference){

    var total_event_created = user_reference.child("total_event_created").val();
    var total_event_active = user_reference.child("active_event_active").val();

    database.ref("users/"+user.uid).update({total_event_created: total_event_created+1});
    database.ref("users/"+user.uid).update({total_event_active: total_event_active+1});

    var newEvent = database.ref("events").push({
      title: title,
      date: date,
      hour: hour,
      timestamp_format: timestamp,
      place: place,  
      brief_description: brief_description,
      detailed_description: detailed_description,
      contact_email: contact_email,
      contact_phone_number: contact_phone_number,
      user_id: user.uid
    });

    var image_file = $("#imageUrl")[0].files[0];
    var path = newEvent.key;

    console.log(path);

    database.ref("events/"+path).update({
      image_url: path
    });

    uploadEventImageToStorage(image_file, path);

  });

}

function uploadEventImageToStorage(image_file, image_path){

  var upload_status = storage.ref(image_path).put(image_file);
  
  //Update progress bar
  upload_status.on('state_changed',
    function progress(snapshot){
      var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      console.log(percentage);
    },
    function error(err){
    },
    function complete(){
      console.log("Image has been uploaded.");
      reloadPage();
    }
  );
  
}

function assignUsernameToHeader(user_name){
  username_organizational.innerHTML = user_name;
}

function reloadPage(){
  location.reload();
}

function signOut(){
  auth.signOut();
  window.location.replace("login.html");
}


