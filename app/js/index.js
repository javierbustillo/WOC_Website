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
        //$("#categories_tab").click(loadCategoriesTabContent);
        $("#submit_event_tab").click(loadSubmitEventTabContent);
        //$("#admin_tab").click(loadAdminTabContent);
        $(".category_option_button").click(loadCategoriesTabContent);
        $(".admin_option_button").click(loadAdminTabContent);
        $("#edit_events_tab").click(loadEditEventsTabContent);

        $("#eventsFeed").on("click", ".saved_event_bookmark_icon", user, updateUserSavedEvents);

        $("#admin_panel_users_table").on("click", ".status_user_button", setUserAccountStatus);
        $("#admin_panel_users_table").on("click", ".delete_user_button", deleteUserAccountFromAdminPanelTable);
        $("#admin_panel_events_table").on("click", ".status_event_button", setEventStatus);
        $("#admin_panel_events_table").on("click", ".delete_event_button", deleteEventFromAdminPanelTable);
        $("#admin_panel_associations_table").on("click", ".status_user_button", setUserAccountStatus);
        $("#admin_panel_associations_table").on("click", ".delete_user_button", deleteUserAccountFromAdminPanelTable);

        $("#edit_events_table").on("click",".edit_event_button", editEvent);
        $("#edit_events_table").on("click", ".delete_user_button", deleteUserAccountFromAdminPanelTable);


        $("#event_form").validate({
          rules: {
            title: {
              required:true
            },
            date: {
              required:true
            },
            start_time_hour: {
              required:true
            },
            end_time_hour: {
              required:true
            },
            place: {
              required: true,
              maxlength: 16
            },
            brief_description:{
              required: true,
              minlength: 16, 
              maxlength: 128
            },
            detailed_description:{
              required: true,
              minlength: 16
            },
            category: {required: true},
            contact_email:{
              required: true,
              email: true
            },
            contact_phone_number:{
              required: true            }
          },
          messages: {
            title: {
              required:"The title is required."
            },
            date: {
              required:"The date is required."
            },
            start_time_hour: {
              required:"The start time hour is required."
            },
            end_time_hour: {
              required:"The end time hour is required."
            },
            place: {
              required: "The place name is required.",
              maxlength: "The place name must not exceed 16 characters."
            },
            brief_description:{
              required: "The brief description is required.",
              minlength: "The brief descript must have at least 16 characters.", 
              maxlength: "The brief description must not exceed 128 characters."
            },
            detailed_description:{
              required: "The detailed description is required.",
              minlength: "The detailed description must have at least 16 characters."
            },
            category: {
              required:"The category is required."
            },
            contact_email:{
              required: "The contact email is required.",
              email: "The contact email entered is not a valid email."
            },
            contact_phone_number:{
              required: "The contact phone number is required."
            }
          }, submitHandler: function(form,event){
              event.preventDefault();
              var user = firebase.auth().currentUser;
              
              if(this.submitButton.id=="edit_button"){
                uploadEditedEventToDatabase();
              }else{
                uploadEventToDatabase(user);
              }
          }
        });

      }else{
        redirectToLoginPage();
      }

      hideAllTabContent();

    });
});


function testValidator(){
}

function addAdminTabs(user) {
  database.ref("users/"+user.uid).once('value').then(function(user_from_database) {
          if(user_from_database.val().is_admin) {
            $("#categories_tab_divisor").removeAttr("hidden");
            $("#submit_event_tab").removeAttr("hidden");
            $("#submit_event_tab_divisor").removeAttr("hidden");
            $("#edit_events_tab").removeAttr("hidden");
            $("#admin_tab_divisor").removeAttr("hidden");
            $("#admin_tab").removeAttr("hidden");
          } else if(user_from_database.val().is_association) {
            $("#categories_tab_divisor").removeAttr("hidden");
            $("#submit_event_tab").removeAttr("hidden");
            $("#submit_event_tab_divisor").removeAttr("hidden");
            $("#edit_events_tab").removeAttr("hidden");
          }
  });
}

function hideAllTabContent() {
  $("#submit_event_form").prop("hidden", true);
  $(".admin_table").prop("hidden", true);
  $("#eventsFeed").empty();
  $("td").remove();
}

function loadAllTabContent(){
  setTabActive("all");
  hideAllTabContent();
  $('#banner_header').html("Go out. Connect. Explore. Know what is happening right now on campus!");
  $('#banner_image').attr("src","assets/images/medium_art_front_page.png");
  displayAllEvents();
}

function loadRecommendedTabContent(){
  setTabActive("recommended");
  hideAllTabContent();
  $('#banner_header').html("We got some recomendations for you. There is nothing better than being part of something great.");
  $('#banner_image').attr("src","assets/images/catching_things.jpg");
  displayAllEvents();
}

function loadSavedTabContent(user){
  setTabActive("saved");
  hideAllTabContent();
  $('#banner_header').html("Don't forget the things you love. Keep track of all the events you want to attend.");
  $('#banner_image').attr("src","assets/images/fox.jpg");
  displaySavedEvents(user.data);
}

function loadPopularTabContent(){
  setTabActive("popular");
  hideAllTabContent();
  $('#banner_header').html("We got some recomendations for you. There is nothing better than being part of something great.");
  $('#banner_image').attr("src","assets/images/bus.png");
  displayAllEvents();
}

function loadCategoriesTabContent(){
  setTabActive("categories");
  hideAllTabContent();
  $('#banner_header').html("Go out. Connect. Explore. Know what is happening right now on campus!");
  $('#banner_image').attr("src","assets/images/bus.png");
  displayCategoriesEvents(this.name);
}

function loadSubmitEventTabContent(){
  setTabActive("submit_event");
  hideAllTabContent();
  $('#banner_header').html("Let the campus know about the next big event.");
  $('#banner_image').attr("src","assets/images/medium_art_front_page.png");
  $("#submit_event_form").prop("hidden", false);
  $(".event_form").trigger("reset");
}

function loadAdminTabContent(){
  setTabActive("admin");
  hideAllTabContent();
  $('#banner_header').html("Admin Panel. Control users, associations and events right here. Be careful, you are accesing important data.");
  $('#banner_image').attr("src","assets/images/medium_art_front_page.png");
  displayAdminTable(this.name);
}

function loadEditEventsTabContent(){
  setTabActive("edit_events");
  hideAllTabContent();
  $('#banner_header').html("Edit Events. Control users, associations and events right here. Be careful, you are accesing important data.");
  $('#banner_image').attr("src","assets/images/medium_art_front_page.png");
  displayEditEventsTable();
}

function displayAllEvents(){
  database.ref("events").orderByChild("event_date_start_time_timestamp_format").on('child_added', function(event){
    displaySingleEvent(event.val());
  });
}

function displayCategoriesEvents(category_name){
  database.ref("events").orderByChild("event_date_start_time_timestamp_format").on('child_added', function(event){
    if(event.val().category==category_name){
      displaySingleEvent(event.val());
    }
  });
}

function displayAdminTable(tab_name){
  switch (tab_name){

    case "Manage Users":
      $("#admin_panel_users_table").prop("hidden", false);
      displayUsersInTable();
      break;

    case "Manage Events":
      $("#admin_panel_events_table").prop("hidden", false);
      displayEventsInTable();
      break;

    case "Manage Associations":
      $("#admin_panel_associations_table").prop("hidden", false);
      displayAssociationsInTable();
      break;
  }
}

function displayEditEventsTable(){
  $("#edit_events_table").prop("hidden", false);
  var user = firebase.auth().currentUser;
  if(user){
    database.ref("events").on('child_added', function(event){
      var value = event.val();
      if(value.user_id==user.uid){
        var source = $("#associations-edit-events-table-cell-template").html();
        var template = Handlebars.compile(source);
        var data = {user_id: value.user_id,
                    event_id: value.image_url,
                    event_title: value.title,
                    event_date: convertDateToWords(value.date),
                    event_start_time: convert24HourToAmPm(value.start_time_hour),
                    event_place: value.place,
                    event_category: value.category
                  };
        $("#edit_events_table").append(template(data));
      }
    });   
  }else{
    // No user is signed in.
    window.location.replace("login.html"); 
  }
}


function displayUsersInTable(){
  database.ref("users").on('child_added', function(user){
    var value = user.val();
    var source = $("#user-table-cell-template").html();
    var template = Handlebars.compile(source);
    var data = {display_name: value.display_name,
                email: value.email,
                current_saved_events_counter: value.current_saved_events_counter,
                user_id: value.id,
                account_status: value.account_status
              };
    $("#admin_panel_users_table").append(template(data));
  });      
}

function displayAssociationsInTable(){
  database.ref("users").on('child_added', function(user){
     var value = user.val();
     var source = $("#associations-table-cell-template").html();
     var template = Handlebars.compile(source);
     if(value.is_association==true){
       var data = {display_name: value.display_name,
                   email: value.email,
                   user_id: value.id,
                   total_event_active: value.total_event_active,
                   total_event_created: value.total_event_created,
                   account_status: value.account_status
                 };
       $("#admin_panel_associations_table").append(template(data));
    }
  });
}   



function displayEventsInTable(){
  database.ref("events").on('child_added', function(event){
    var value = event.val();
    var source = $("#events-table-cell-template").html();
    var template = Handlebars.compile(source);
    var data = {title: value.title,
                user_id: value.user_id,
                date: convertDateToWords(value.date),
                event_id: value.image_url,
                event_status: value.event_status
              };
    $("#admin_panel_events_table").append(template(data));
  });      
}

function displaySavedEvents(user){
  database.ref("users/"+user.uid).once("value").then(function(user_reference){
    var saved_events = user_reference.child("saved_events").val();
    if(saved_events!=null){
      database.ref("events").orderByChild("event_date_start_time_timestamp_format").on('child_added', function(event){
        if(saved_events.includes("event"+event.val().image_url)){
          displaySingleEvent(event.val());
        }
      });
    }
  });
}

function displaySingleEvent(value){

  var source = $("#event-template").html();
  var template = Handlebars.compile(source);
  var event_name = "event"+value.image_url;


  var user = firebase.auth().currentUser;
  var bookmark_icon="";

  if((value.event_status=="active") && (value.event_date_start_time_timestamp_format>new Date())){
    //Get Current Saved Event Status
    if (user) {
      database.ref("users/"+user.uid).once("value").then(function(user_reference){
        var current_saved_events_counter = user_reference.child("current_saved_events_counter").val();
        if(current_saved_events_counter==null||current_saved_events_counter==0){
          bookmark_icon="assets/images/bookmark_icon_for_saved_events_gray.png";
        }else{
          var saved_events = user_reference.child("saved_events").val();
          for(var i=0; i<=current_saved_events_counter; i++){
            if(saved_events[i]==event_name&&i<current_saved_events_counter){
              saved_events.splice(i, 1);
              bookmark_icon="assets/images/bookmark_icon_for_saved_events_green.png";
              break;
            } else if(i==current_saved_events_counter){
              bookmark_icon="assets/images/bookmark_icon_for_saved_events_gray.png";
              break;
            }
          }
        }

        //Display Event
        var data = {title: value.title,
                    imageUrl: value.image_url,
                    date: convertDateToWords(value.date),
                    start_time_hour: convert24HourToAmPm(value.start_time_hour),
                    place: value.place,
                    briefDescription: value.brief_description,
                    bookmark_icon: bookmark_icon
                  };

        $("#eventsFeed").prepend(template(data));

        var image_id = "#"+value.image_url;
        storage.ref(value.image_url).getDownloadURL().then(function(url) {
            $(image_id).attr("src", url);
        });

      });

    } else {
      // No user is signed in.
      window.location.replace("login.html"); 
    }
  }

}



function convertDateToWords(date){
  var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  date = new Date(date);
  var day = date.getDate()+1; //revisar esto luego
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
  $("#edit_events_tab").attr("class", "desactive");
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

    case "edit_events":
    $("#edit_events_tab").attr("class", "active");
    break;

    default:
      $("#all_tab").attr("class", "active");
      break;
  }
}

function updateUserSavedEvents(user){
  event_name = this.parentNode.id;
  bookmark_icon = this;

  user = user.data;

  database.ref("users/"+user.uid).once("value").then(function(user_reference){
      var current_saved_events_counter = user_reference.child("current_saved_events_counter").val();
      if(current_saved_events_counter==null||current_saved_events_counter==0){
        database.ref("users/"+user.uid).update({current_saved_events_counter:1, saved_events:[event_name]});
        bookmark_icon.src="assets/images/bookmark_icon_for_saved_events_green.png";
      }else{
        var saved_events = user_reference.child("saved_events").val();
        for(var i=0; i<=current_saved_events_counter; i++){
          if(saved_events[i]==event_name&&i<current_saved_events_counter){
            saved_events.splice(i, 1);
            database.ref("users/"+user.uid).update({current_saved_events_counter:current_saved_events_counter-1});
            bookmark_icon.src="assets/images/bookmark_icon_for_saved_events_gray.png";
            break;
          } else if(i==current_saved_events_counter){
            saved_events.push(event_name);
            database.ref("users/"+user.uid).update({current_saved_events_counter:current_saved_events_counter+1});
            bookmark_icon.src="assets/images/bookmark_icon_for_saved_events_green.png";
            break;
          }
        }
        database.ref("users/"+user.uid).update({saved_events:saved_events});
      }
  });
}


function uploadEventToDatabase(user){
  //Remember that changes here must be done in uploadEditedEventToDatabase function too.

  var title = $("#title").val(),
      date = $("#date").val(),
      start_time_hour = $("#start_time_hour").val(),
      end_time_hour = $("#end_time_hour").val(),
      event_date_start_time_timestamp_format = new Date(date +" "+ start_time_hour).getTime(),
      event_date_end_time_timestamp_format = new Date(date +" "+ end_time_hour).getTime(),
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
      start_time_hour: start_time_hour,
      end_time_hour: end_time_hour,
      category: category,
      event_date_start_time_timestamp_format: event_date_start_time_timestamp_format,
      event_date_end_time_timestamp_format: event_date_end_time_timestamp_format,
      place: place,
      brief_description: brief_description,
      detailed_description: detailed_description,
      contact_email: contact_email,
      contact_phone_number: contact_phone_number,
      user_id: user.uid,
      event_status: "active"
    });

    var image_file = $("#imageUrl")[0].files[0];
    var path = newEvent.key;

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
      var percentage = Math.ceil((snapshot.bytesTransferred/snapshot.totalBytes)*100);
      $("#percent").html("Image uploaded "+percentage+" %.");
    },
    function error(err){
    },
    function complete(){
      $("#percent").html("Image uploaded succesfully.");
      reloadPage();
    }
  );
}

function editEvent(){
  var event_id = this.name;
  hideAllTabContent();
  $("#submit_event_form").prop("hidden", false);
  $(".event_form").trigger("reset");

  database.ref("events/"+event_id).once("value").then(function(event){
    event = event.val();

    $("#title").val(event.title);
    $("#date").val(event.date);
    $("#start_time_hour").val(event.start_time_hour);
    $("#end_time_hour").val(event.end_time_hour);
    $("#place").val(event.place);
    $("#brief_description").val(event.brief_description);
    $("#detailed_description").val(event.detailed_description);
    $("#contact_email").val(event.contact_email);
    $("#contact_phone_number").val(event.contact_phone_number);
    $("#upload_image_label").val("If you wish, upload a new event image...");
    $("#publish_button").prop("hidden", true);
    $("#edit_button").prop("hidden", false);
    $("#edit_button").attr("name", event.image_url);

  });

}

function uploadEditedEventToDatabase(){
  var event_id = $("#edit_button").attr("name");
  
  var title = $("#title").val(),
      date = $("#date").val(),
      start_time_hour = $("#start_time_hour").val(),
      end_time_hour = $("#end_time_hour").val(),
      event_date_start_time_timestamp_format = new Date(date +" "+ start_time_hour).getTime(),
      event_date_end_time_timestamp_format = new Date(date +" "+ end_time_hour).getTime(),
      place = $("#place").val(),
      category = $("#category").val(),
      brief_description = $("#brief_description").val(),
      detailed_description = $("#detailed_description").val(),
      contact_email = $("#contact_email").val(),
      contact_phone_number = $("#contact_phone_number").val(),
      cancel_button = $("#cancel_button");

  database.ref("events/"+event_id).update({
      title: title,
      date: date,
      start_time_hour: start_time_hour,
      end_time_hour: end_time_hour,
      category: category,
      event_date_start_time_timestamp_format: event_date_start_time_timestamp_format,
      event_date_end_time_timestamp_format: event_date_end_time_timestamp_format,
      place: place,
      brief_description: brief_description,
      detailed_description: detailed_description,
      contact_email: contact_email,
      contact_phone_number: contact_phone_number,
      last_update: new Date().getTime()
  });
     
    var image_file = $("#imageUrl")[0].files[0];

    if(!(image_file == null)){
      uploadEventImageToStorage(image_file, event_id);
    }

    reloadPage();

}


function deleteUserAccountFromAdminPanelTable(){
  var user_id= this.name;
  alert("Option not available.");
}

function setUserAccountStatus(){
  var selected_status = this.title;
  var user_id = this.name;
  var account_status_cell_id = "#account_status"+user_id;
  $(account_status_cell_id).html(selected_status);
  database.ref("users/"+user_id).update({account_status: selected_status}); 
}

function setEventStatus(){
  var selected_status = this.title;
  var event_id = this.name;
  var event_status_cell_id = "#event_status"+event_id;
  $(event_status_cell_id).html(selected_status);
  database.ref("events/"+event_id).update({event_status: selected_status});
}

function deleteEventFromAdminPanelTable(){
  var event_id= this.name;
  alert("Option not available.");
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



