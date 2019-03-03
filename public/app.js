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
            window.location = 'home.html';
        } else {
            const provider = new firebase.auth.GoogleAuthProvider();
            const auth = firebase.auth().signInWithPopup(provider);
        }
    }

    firebase.auth().onAuthStateChanged(newLogin);
}

// FACEBOOK LOGIN
function facebookLogin() {
    function newLogin(user) {
        if (user) {
            window.location = 'home.html';
            app(user);
        } else {
            const provider = new firebase.auth.FacebookAuthProvider();
            const auth = firebase.auth().signInWithPopup(provider);
        }
    }

    firebase.auth().onAuthStateChanged(newLogin);
}

function logout() {
    firebase.auth().signOut();
    window.location = 'index.html';
}

const bet = ['288', '968', '1458'];

function renderBetCard() {
    let date = new Date();
    const card = document.createElement('div');

    for (let i = 0; i < bet.length; i++) {
        card.innerHTML = `
        <div class="col s12">
        <div class="card horizontal">
            <div class="card-stacked">
                <div class="card-content">
                    <p>${date.getFullYear()}/${date.getMonth() +1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</p>
                    <p>Summa: ${bet[i]}</p>
                    <p>Resultat: 0:-</p>
                </div>
                <div class="card-action">
                    <a href="#"><i class="material-icons card-action-icon">delete</i></a>
                    <a href="#"><i class="material-icons card-action-icon">
                            create
                        </i></a>
                </div>
            </div>
        </div>
    </div>
        `;
        document.querySelector('#card-bet').innerHTML += card.innerHTML;
    }

}

document.addEventListener('DOMContentLoaded', () => {
    renderBetCard();
})