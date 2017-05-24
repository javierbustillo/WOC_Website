$(document).ready(function() {
	$("#header").load("header.html", function(){

    // Set up UI elements
    var newsfeed = document.querySelector("#newsfeed"),
        username = document.querySelector("#username"),
        logout_button = document.querySelector("#logout_button");
    //Set user attributes
    var user_info, user_display_name;

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
        user_display_name = user_info.displayName;
        console.log("User display name read. User display name =", user_display_name);
        //Assign username to header
        username.innerHTML = user_display_name;
      }else{
        window.location = "login.html";
      }
    });

    //Get newsfeed
    //Listen from the latest 10 stories onwads, and display them
    database.ref("events").on('child_added', function(snapshot){
      displayEvent(snapshot.val());
    });


    //Listen to whenever a story changes
    database.ref("events").on('child_changed', function(snapshot){
      displayEvent(snapshot.val());
    });

    function displayEvent(value){
      $("#newsfeed").append("\<div class=\"event\"\>\<div class=\"event_title\"\>"+value.title+"\<\/div\>\<div class=\"event_image\"\>\<\/div\>\<div class =event_header\>\<div class=\"event_info_header\" id=\"event_hour\"\>"+value.hour+"\<\/div\>|\<div class=\"event_info_header\" id=\"event_date\"\>"+value.date+"\<\/div\>|\<div class=\"event_info_header\" id=\"event_place\"\>"+value.place+"\<\/div\>\<\/div\>\<div class=\"event_brief_description\"\>"+value.brief_description+"\<\/div\>\<\/div\>");
      console.log("Event displayed");
    }

  });
});




