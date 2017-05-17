var config = {
     apiKey: "AIzaSyCIUFSaKhAX1z3aI3-iOqeCQGOATPP7XHY",
     authDomain: "whats-on-campus.firebaseapp.com",
     databaseURL: "https://whats-on-campus.firebaseio.com",
     projectId: "whats-on-campus",
     storageBucket: "whats-on-campus.appspot.com",
     messagingSenderId: "2443063959"
  };
  firebase.initializeApp(config);

  //Get elements
  const preObject = document.getElementById('newsfeed');

  //Create references
  const dbRefObject = firebase.database().ref().child('events');

  // Sync object
  dbRefObject.on('value', snap=> console.log(snap.val()));