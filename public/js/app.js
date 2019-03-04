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



let date = new Date();

let bets = [];
if (localStorage.getItem('bets') === null) {
    bets = [];
} else {
    bets = JSON.parse(localStorage.getItem('bets'));
}

localStorage.setItem('bets', JSON.stringify(bets));
// let bets = JSON.parse(localStorage.getItem('bet'));
console.log(bets);



function renderBetCard() {
    const card = document.createElement('div');

    for (let i = 0; i < bets.length; i++) {
        card.innerHTML = `
        <div class="col s12">
        <div class="card horizontal">
            <div class="card-stacked">
                <div class="card-content">
                    <p><b>${bets[i].name}</b></p>
                    <p>${bets[i].date}</p>
                    <p>Summa: ${bets[i].sum}:-</p>
                    <p>Vinst: ${bets[i].win}:-</p>
                    
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
});





// function getLocalStorage() {
//     let bets = [];

//     if (localStorage.getItem('bets') === null) {
//         bets = [];
//     } else {
//         bets = JSON.parse(localStorage.getItem('bets'));
//     }
//     bets.forEach(bet =>
//         this.bets.push({
//             name: bet.name,
//             date: `${date.getFullYear()}/${date.getMonth() +1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
//             sum: parseInt(bet.sum),
//             win: parseInt(bet.win)
//         })
//     );

//     localStorage.setItem('bets', JSON.stringify(bet));
//     console.log(bets)
// }

// getLocalStorage();
// renderBetCard();