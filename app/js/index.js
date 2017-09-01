//initialize Firebase
var auth = firebase.auth(),
  storage = firebase.storage(),
  database = firebase.database();


$(document).ready(function() {
	$("#header").load("header.html", function(){

    auth.onAuthStateChanged(function(user) {
      if(user){
        assignUsernameToHeader(user.displayName)
        addAdminTabs(user);
        displayAllEvents();

          $("#logout_button").click(redirectToLoginPage);

      }else{
        redirectToLoginPage();
      }
    });

  });
});

function addAdminTabs(user) {
  database.ref("users/"+user.uid).once('value').then(function(user_from_database) {
          if(user_from_database.val().is_admin) {
            var txt1 = "<li><a a class='desactive' href='submit_event.html'>SUBMIT EVENT</a></li>";
            $("#extra").append(txt1);
          }
    });
    /*if(user.is_admin==true){
       console.log(user);

    }*/
}

function assignUsernameToHeader(user_name){
  username.innerHTML = user_name;
}

function displayAllEvents(){

  database.ref("events").on('child_added', function(event){
    displaySingleEvent(event.val());
  });

  database.ref("events").on('child_changed', function(event){
    displaySingleEvent(event.val());
  });

}

function displaySingleEvent(value){

  storage.ref(value.image_url).getDownloadURL().then(function(url) {
        $("#newsfeed").append("<div class=event><div class=event_title>"+value.title+"</div><img class=event_image src='"+url+"'><div class = event_header><div class=event_info_header id=event_hour>"+value.hour+"</div><div class=event_info_header id=event_date>"+"   |   "+value.date+"   |   "+"</div><div class=event_info_header id=event_place>"+value.place+"</div></div><div class=event_brief_description>"+value.brief_description+"</div></div>");
  });
}

function redirectToLoginPage(){
  window.location.replace("login.html");
}
