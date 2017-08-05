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
      place = $("#place").val(),
      brief_description = $("#brief_description").val(),
      detailed_description = $("#detailed_description").val(),
      contact_email = $("#contact_email").val(),
      contact_phone_number = $("#contact_phone_number").val(),
      cancel_button = $("#cancel_button");
      
  cancel_button.disabled = true;

  database.ref("users/"+user.uid).once("value").then(function(user_reference){

    var total_event_created = user_reference.child("total_event_created").val();
    var total_event_active = user_reference.child("active_event_active").val();

    database.ref("users/"+user.uid).update({total_event_created: total_event_created+1});
    database.ref("users/"+user.uid).update({total_event_active: total_event_active+1});

    var event_path = "events/"+user.uid+"/message"+total_event_created;

    var image_path = "events_images/"+user.uid+"/message"+total_event_created;
    var image_file = $("#imageUrl")[0].files[0];
  
    database.ref(event_path).set({
      title: title,
      date: date,
      hour: hour,
      place: place,  
      brief_description: brief_description,
      detailed_description: detailed_description,
      contact_email: contact_email,
      contact_phone_number: contact_phone_number,
      imageUrl: image_path,
      user_id: user.uid,
    });

    uploadEventImageToStorage(image_file, image_path);

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


