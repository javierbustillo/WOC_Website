//Setup Firebase
  var config = {
     apiKey: "AIzaSyCIUFSaKhAX1z3aI3-iOqeCQGOATPP7XHY",
     authDomain: "whats-on-campus.firebaseapp.com",
     databaseURL: "https://whats-on-campus.firebaseio.com",
     projectId: "whats-on-campus",
     storageBucket: "whats-on-campus.appspot.com",
     messagingSenderId: "2443063959"
  };
  firebase.initializeApp(config);

//Initialize Firebase Instances
var auth = firebase.auth(),
    storage = firebase.storage(),
    database = firebase.database();


$(document).ready(function() {
    auth.onAuthStateChanged(function(user) {
      if(user){

        assignUsernameToHeader(user.displayName);
        addAdminTabs(user);

        loadAllTabContent();

        $("#logout_button").click(signOut);

        $("#all_tab").click(loadAllTabContent);
        $("#recommended_tab").click(loadRecommendedTabContent);
        $("#saved_tab").click(user, loadSavedTabContent);
        //$("#popular_tab").click(loadPopularTabContent);
        $("#categories_tab").click(loadCategoriesTabContent);
        $("#submit_event_tab").click(loadSubmitEventTabContent);
        $("#admin_tab").click(loadAdminTabContent);
        $(".category_option_button").click(loadCategoriesTabContent);


        $("#newsfeed").on("click", "#publish_button",user, uploadEventToDatabase);
        $("#newsfeed").on("click", "#cancel_button", reloadPage);
        $("#newsfeed").on("click", ".event_save_button", user, updateUserSavedEvents);


      }else{
        redirectToLoginPage();
      }

      hideAllTabContent();

    });
});


function addAdminTabs(user) {
  database.ref("users/"+user.uid).once('value').then(function(user_from_database) {
          if(user_from_database.val().is_admin) {
            $("#categories_tab_divisor").removeAttr("hidden");
            $("#submit_event_tab").removeAttr("hidden");
            $("#admin_tab").removeAttr("hidden");
          }
  });
}

function hideAllTabContent() {
  $("#submit_event_form").prop("hidden", true);
  $("#admin_panel").prop("hidden", true);
}
function loadAllTabContent(){
  setTabActive("all");
  $('#banner_header').html("Go out. Connect. Explore. Know what is happening right now on campus!");
  $('#banner_image').attr("src","images/medium_art_front_page.png");
  $("#newsfeed").empty();
  displayAllEvents();
}

function loadRecommendedTabContent(){
  setTabActive("recommended");
  $('#banner_header').html("We got some recomendations for you. There is nothing better than being part of something great.");
  $('#banner_image').attr("src","images/catching_things.jpg");
  $("#newsfeed").empty();
  displayAllEvents();
}

function loadSavedTabContent(user){
  setTabActive("saved");
  $('#banner_header').html("We got some recomendations for you. There is nothing better than being part of something great.");
  $('#banner_image').attr("src","images/fox.jpg");
  $("#newsfeed").empty();
  displaySavedEvents(user.data);
}

function loadPopularTabContent(){
  setTabActive("popular");
  $('#banner_header').html("We got some recomendations for you. There is nothing better than being part of something great.");
  $('#banner_image').attr("src","images/bus.png");
  $("#newsfeed").empty();
  displayAllEvents();
}

function loadCategoriesTabContent(){
  setTabActive("categories");
  $('#banner_header').html("Go out. Connect. Explore. Know what is happening right now on campus!");
  $('#banner_image').attr("src","images/bus.png");
  $("#newsfeed").empty();
  displayCategoriesEvents(this.name);
}

function loadSubmitEventTabContent(){
  setTabActive("submit_event");
  $('#banner_header').html("Let the campus know about the next big event.");
  $('#banner_image').attr("src","images/medium_art_front_page.png");
  $("#newsfeed").empty();
}

function loadAdminTabContent(){
  setTabActive("admin");
  $('#banner_header').html("Admin Panel.");
  $('#banner_image').attr("src","images/medium_art_front_page.png");
  $("#newsfeed").empty();
}

function displayAllEvents(){
  database.ref("events").orderByChild("event_date_timestamp_format").on('child_added', function(event){
    displaySingleEvent(event.val());
  });
  database.ref("events").orderByChild("event_date_timestamp_format").on('child_changed', function(event){
    displaySingleEvent(event.val());
  });
}

function displayCategoriesEvents(category_name){
  database.ref("events").orderByChild("event_date_timestamp_format").on('child_added', function(event){
    if(event.val().category==category_name){
      displaySingleEvent(event.val());
    }
  });
  database.ref("events").orderByChild("event_date_timestamp_format").on('child_changed', function(event){
    if(event.val().category==category_name){
      displaySingleEvent(event.val());
    }
  });
}

function displaySavedEvents(user){
  database.ref("users/"+user.uid).once("value").then(function(user_reference){
    var saved_events = user_reference.child("saved_events").val();
    if(saved_events!=null){
      database.ref("events").orderByChild("event_date_timestamp_format").on('child_added', function(event){
        if(saved_events.includes(event.val().image_url)){
          displaySingleEvent(event.val());
        }
      });
      database.ref("events").orderByChild("event_date_timestamp_format").on('child_changed', function(event){
        if(saved_events.includes(event.val().image_url)){
          displaySingleEvent(event.val());
        }
      });
    }
  });
}

function displaySingleEvent(value){
  $("#newsfeed").append("<div class=event title="+value.image_url+"><div class=event_image_container><img id='"+value.image_url+"'class=event_image src=''><div class=event_image_overlay><button class=event_save_button>Save Event</button></div></div><div class=event_title>"+value.title+"</div><div class = event_header><div class=event_info_header id=event_hour>"+convert24HourToAmPm(value.hour)+"</div><div class=event_info_header id=event_date>"+"   |   "+convertDateToWords(value.date+" 02:00:00")+"   |   "+"</div><div class=event_info_header id=event_place>"+value.place+"</div></div><div class=event_brief_description>"+value.brief_description+"</div></div>");
  var image_id = "#"+value.image_url;
  storage.ref(value.image_url).getDownloadURL().then(function(url) {
      $(image_id).attr("src", url);
  });
}

function convertDateToWords(date){
  var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  date = new Date(date);
  var day = date.getDate();
  var month = monthNames[date.getMonth()];
  var year = date.getFullYear();
  return month + ' '+day + ', ' +year;
}

function convert24HourToAmPm(hour) {
    return moment(hour, 'HH:mm:ss').format('h:mm a');
}


function setTabActive(tab_name){
  $("#all_tab").attr("class", "desactive");
  $("#recommended_tab").attr("class", "desactive");
  $("#saved_tab").attr("class", "desactive");
  $("#popular_tab").attr("class", "desactive");
  $("#categories_tab").attr("class", "desactive");
  $("#submit_event_tab").attr("class", "desactive");
  $("#admin_tab").attr("class", "desactive");

  switch (tab_name) {
    case "all":
      $("#all_tab").attr("class", "active");
      break;

    case "recommended":
      $("#recommended_tab").attr("class", "active");
      break;

    case "saved":
      $("#saved_tab").attr("class", "active");
      break;

    case "popular":
      $("#popular_tab").attr("class", "active");
      break;

    case "categories":
      $("#categories_tab").attr("class", "active");
      break;

    case "submit_event":
      $("#submit_event_tab").attr("class", "active");
      break;

    case "admin":
      $("#admin_tab").attr("class", "active");
      break;

    default:
      $("#all_tab").attr("class", "active");
      break;
  }
}

function updateUserSavedEvents(user){

  event_name = this.parentNode.parentNode.parentNode.title;
  user = user.data;

  database.ref("users/"+user.uid).once("value").then(function(user_reference){
      var current_saved_events_counter = user_reference.child("current_saved_events_counter").val();
      if(current_saved_events_counter==null||current_saved_events_counter==0){
        database.ref("users/"+user.uid).update({current_saved_events_counter:1, saved_events:[event_name]});
      }else{
        var saved_events = user_reference.child("saved_events").val();
        for(var i=0; i<=current_saved_events_counter; i++){
          if(saved_events[i]==event_name&&i<current_saved_events_counter){
            saved_events.splice(i, 1);
            database.ref("users/"+user.uid).update({current_saved_events_counter:current_saved_events_counter-1});
            break;
          } else if(i==current_saved_events_counter){
            saved_events.push(event_name);
            database.ref("users/"+user.uid).update({current_saved_events_counter:current_saved_events_counter+1});
            break;
          }
        }
        database.ref("users/"+user.uid).update({saved_events:saved_events});
      }
  });

}


function uploadEventToDatabase(event_object_user){

  user=event_object_user.data;

  var title = $("#title").val(),
      date = $("#date").val(),
      hour = $("#hour").val(),
      event_date_timestamp_format = new Date(date +" "+ hour).getTime(),
      place = $("#place").val(),
      category = $("#category").val(),
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

    var newEvent = database.ref("events").push({
      title: title,
      date: date,
      hour: hour,
      category: category,
      event_date_timestamp_format: event_date_timestamp_format,
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
  username.innerHTML = user_name;
}

function signOut(){
  auth.signOut();
  window.location.replace("login.html");
}

function reloadPage(){
  location.reload();
}

function redirectToLoginPage(){
  window.location.replace("login.html");
}

