if(firebase.auth().currentUser==null) {
  window.location = "login.html";
} else {
    console.log("lelz");
   console.log(firebase.auth().currentUser);
}