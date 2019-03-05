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

function getLocalStorage() {
    let bets = [];

    if (localStorage.getItem('bets') === null) {
        bets = [];
    } else {
        bets = JSON.parse(localStorage.getItem('bets'));
    }
    bets.forEach(bet =>
        bets.push({
            name: bet.name,
            date: bet.date,
            sum: parseInt(bet.sum),
            win: parseInt(bet.win)

        })
    );

}

function setLocalStorage() {
    localStorage.setItem('bets', JSON.stringify(bets));

}

function renderBetCard() {
    const card = document.createElement('div');

    for (let i = 0; i < bets.length; i++) {
        card.innerHTML = `
        <div class="col s12">
            <div class="card horizontal">
                <div class="card-stacked">
                    <div class="card-content">
                        <span class="circle"></span>
                        <p><b>${bets[i].name}</b></p>
                        <p>${bets[i].date}</p>
                        <p>Summa: ${bets[i].sum}:-</p>
                        <p>Vinst: ${bets[i].win}:-</p> 
                    </div>
                    <div class="card-action">
                    <a href="#"><i class="material-icons card-action-icon">delete</i></a>
                    <a href="#" onclick="editCard()"><i class="material-icons card-action-icon">
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

function editCard() {
    const card = document.createElement('div');
    const flip = document.querySelector('.card');
    flip.onclick = function () {
        flip.classList.add('flip-vertical-fwd', 'card-back');
    };
}

function renderAddBetCard() {
    const card = document.createElement('div');

    card.innerHTML = `
    <div class="col s12">
        <div class="card horizontal add-bet-card">
            <div class="card-stacked">
                <div class="card-content">
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="name" type="text" class="validate">
                            <label for="name">Namn</label>
                        </div>
                        <div class="input-field col s12">
                            <input id="sum" type="text" class="validate">
                            <label for="sum">Summa</label>
                        </div>
                        <div class="input-field col s12">
                            <input id="win" type="text" class="validate">
                            <label for="win">Vinst</label>
                        </div>
                    </div>
                </div>
                <div class="card-action">
                <a href="#"><i class="material-icons card-action-icon">delete</i></a>
                    <a href="#" onclick="betAdd()"><i class="material-icons card-action-icon">
                    check
                    </i></a>
                </div>
            </div>    
        </div>
    </div>    
    `;
    document.querySelector('#add-bet').innerHTML = card.innerHTML;
}

function addButton() {
    const addButton = document.querySelector('.button-add');
    const overlay = document.querySelector('.main');
    addButton.onclick = function () {
        addButton.onclick = renderAddBetCard();
        overlay.classList.add('overlay');
    };
}









function betAdd() {
    const name = document.querySelector('#name').value;
    const sum = document.querySelector('#sum').value;
    const win = document.querySelector('#win').value;
    const exit = document.querySelector('.add-bet-card');
    const overlay = document.querySelector('.main');

    bets.push({
        name,
        date: `${date.getFullYear()}/${date.getMonth() +1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        sum: parseInt(sum),
        win: parseInt(win)

    });
    console.log(bets);

    exit.onclick = function () {
        exit.parentNode.removeChild(exit);
        overlay.classList.remove('overlay');
        setLocalStorage();
        renderBetCard();
    };
}









// if (bets[i].win > 0) {
//     `<span class="circle-win"></span>`
// } else {
//     `<span class="circle-loss"></span>`
// }




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