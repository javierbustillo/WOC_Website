
  var config = {
     apiKey: "AIzaSyCIUFSaKhAX1z3aI3-iOqeCQGOATPP7XHY",
     authDomain: "whats-on-campus.firebaseapp.com",
     databaseURL: "https://whats-on-campus.firebaseio.com",
     projectId: "whats-on-campus",
     storageBucket: "whats-on-campus.appspot.com",
     messagingSenderId: "2443063959"
  };
  firebase.initializeApp(config);

//Get element
const preObject = document.getElementById("object");

//Create reference
const dbRefObject = firebase.database().ref().child('object');

//Sync object changes
dbRefObject.on('value', snap => console.log(snap.val()));
