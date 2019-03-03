// Initialize Firebase
var config = {
    apiKey: "AIzaSyD81EtdnxKg8C2-1VhVB7QQCbps9mBYgFY",
    authDomain: "spelkollen-ea7cc.firebaseapp.com",
    databaseURL: "https://spelkollen-ea7cc.firebaseio.com",
    projectId: "spelkollen-ea7cc",
    storageBucket: "spelkollen-ea7cc.appspot.com",
    messagingSenderId: "744517835900"
};
firebase.initializeApp(config);

// GOOGLE LOGIN
function googleLogin() {
    function newLogin(user) {
        if (user) {
            // app(user);
            window.location = 'home.html';
        } else {
            const provider = new firebase.auth.GoogleAuthProvider();
            const auth = firebase.auth().signInWithPopup(provider);
        }
    }

    firebase.auth().onAuthStateChanged(newLogin);
}

function app(user) {
    document.getElementById('login').innerHTML = 'Välkommen ' + user.displayName;
}

// FACEBOOK LOGIN
function facebookLogin() {
    function newLogin(user) {
        if (user) {
            // app(user);
            window.location = 'home.html';
        } else {
            const provider = new firebase.auth.FacebookAuthProvider();
            const auth = firebase.auth().signInWithPopup(provider);
        }
    }

    firebase.auth().onAuthStateChanged(newLogin);
}

function app(user) {
    document.getElementById('login').innerHTML = 'Välkommen ' + user.displayName;
}