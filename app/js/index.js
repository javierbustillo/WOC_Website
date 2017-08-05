//Initialize Firebase
var auth = firebase.auth(),
  storage = firebase.storage(),
  database = firebase.database();


$(document).ready(function() {
	$("#header").load("header.html", function(){

    auth.onAuthStateChanged(function(user) {
      if(user){
        assignUsernameToHeader(user.displayName)
        displayAllEvents(user); 

        $("#logout_button").click(redirectToLoginPage);

      }else{
        redirectToLoginPage();
      } 
    });
   
  });
});



function assignUsernameToHeader(user_name){
  username.innerHTML = user_name;
}

function displayAllEvents(user){

  database.ref("events").on('child_added', function(all_users_objects_reference){
    var all_users_objects = all_users_objects_reference.val();
    for(var key in all_users_objects) {
      var event = all_users_objects[key];
      displaySingleEvent(event);
    }
  });

  database.ref("events").on('child_changed', function(all_users_objects_reference){
    var all_users_objects = all_users_objects_reference.val();
    for(var key in all_users_objects) {
      var event = all_users_objects[key];
      displaySingleEvent(event);
    }
  });

}

function displaySingleEvent(value){
  storage.ref(value.imageUrl).getDownloadURL().then(function(url) {
        $("#newsfeed").append("<div class=event><div class=event_title>"+value.title+"</div><img class=event_image src='"+url+"'><div class = event_header><div class=event_info_header id=event_hour>"+value.hour+"</div><div class=event_info_header id=event_date>"+"   |   "+value.date+"   |   "+"</div><div class=event_info_header id=event_place>"+value.place+"</div></div><div class=event_brief_description>"+value.brief_description+"</div></div>");
  });
}

function redirectToLoginPage(){
  window.location.replace("login.html");
}
