import firebase from './firebase';
import {
    setActivePage,
    getCurrentUserName
} from './util';

// GOOGLE LOGIN
const googleLogin = () => {
    function newLogin(user) {
        if (user) {
            setActivePage('page-home');
            // window.location = "home.html";
        } else {
            const provider = new firebase.auth.GoogleAuthProvider();
            const auth = firebase.auth().signInWithPopup(provider);
        }
    }

    firebase.auth().onAuthStateChanged(newLogin);
};

// FACEBOOK LOGIN
const facebookLogin = () => {
    function newLogin(user) {
        if (user) {
            setActivePage('page-home');
            app(user);
        } else {
            const provider = new firebase.auth.FacebookAuthProvider();
            const auth = firebase.auth().signInWithPopup(provider);
        }
    }

    firebase.auth().onAuthStateChanged(newLogin);
};

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        window.testUser = getCurrentUserName(user);
        setActivePage('page-home');
        document.querySelector('.userPhoto').setAttribute('src', user.photoURL);
    } else {
        setActivePage('page-login');
    }
});



// Email login
// function emailLogin() {}

// function logout() {
//     firebase.auth().signOut();
//     window.location = "index.html";
// }
// END OF LOGIN
export {
    googleLogin,
    facebookLogin
};
