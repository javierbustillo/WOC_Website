// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
		apiKey: "AIzaSyCIUFSaKhAX1z3aI3-iOqeCQGOATPP7XHY",
		authDomain: "whats-on-campus.firebaseapp.com",
		databaseURL: "https://whats-on-campus.firebaseio.com",
		projectId: "whats-on-campus",
		storageBucket: "whats-on-campus.appspot.com",
		messagingSenderId: "2443063959"
  }
};