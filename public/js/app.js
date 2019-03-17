// LOGIN

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
      window.location = "home.html";
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
      window.location = "home.html";
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
  window.location = "index.html";
}
// END OF LOGIN

let bets = [];

// function getLocalStorage() {
//   if (localStorage.getItem("bets") === null) {
//     bets = [];
//   } else {
//     bets = JSON.parse(localStorage.getItem("bets"));
//   }
// }

// function setLocalStorage() {
//   localStorage.setItem("bets", JSON.stringify(bets));
// }

function renderBetCard() {
  const card = document.createElement("div");
  document.querySelector("#card-bet").innerHTML = "";
  for (let bet of bets) {
    card.innerHTML = `
        <div class="col s12">
            <div class="card horizontal">
                <div class="card-stacked">
                    <div class="card-content">
                        <span class="circle"></span>
                        <p><b>${bet.name}</b></p>
                        <p>${bet.date}</p>
                        <p>Summa: ${bet.sum}:-</p>
                        <p>Vinst: ${bet.win}:-</p> 
                    </div>
                    <div class="card-action">
                    <a href="#" id="${bet.id}" onclick="betRemove(${
      bet.id
    })"><i class="material-icons card-action-icon">delete</i></a>
                    <a href="#" onclick="editCard()"><i class="material-icons card-action-icon">
                            create
                        </i></a>
                    </div>
                </div>
            </div>
        </div>
        `;
    document.querySelector("#card-bet").innerHTML += card.innerHTML;
  }
}

function editCard() {
  // const card = document.createElement('div');
  // const flip = document.querySelector('.card');
  // flip.onclick = function () {
  //     flip.classList.add('flip-vertical-fwd', 'card-back');
  // };
  console.log("edit");
}

function renderAddBetCard() {
  document.querySelector(".add-bet-card").innerHTML = `
    <div id="add-bet-card">
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
    </div>
    `;
}

function playerCard() {
  firebase.auth().onAuthStateChanged(function(user) {
    for (let player of getPlayersTotalBets()) {
      const card = document.createElement("div");
      {
        card.innerHTML = `
                            <div class="col s12">
                                <div class="card horizontal">
                                    <div class="card-stacked">
                                        <div class="card-content">
                                            <img id="cardUserPhoto" src="${
                                              user.photoURL
                                            }">
                                            <p><b>${user.displayName}</b>,</p>
                                            <p>Du har spelat för: ${
                                              player.sum
                                            }</p>
                                            <p>Din totala vinstsumma är: ${
                                              player.win
                                            }</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
        document.querySelector("#stats").innerHTML = card.innerHTML;
      }
    }
  });
}

function totalCard() {
  // const sum = bets.reduce(add);

  // function add(accumulator, a) {
  //     return accumulator + a;
  // }

  const card = document.createElement("div");
  {
    card.innerHTML = `
                            <div class="col s12">
                                <div class="card horizontal">
                                    <div class="card-stacked">
                                        <div class="card-content">
                                            <p>Gruppen har spelat för:  </p>
                                            <p>Gruppens totala vinstsumma är:  </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
    document.querySelector("#stats").innerHTML = card.innerHTML;
  }
}

function addButton() {
  const overlay = document.querySelector(".main");
  renderAddBetCard();

  // addButton.onclick = renderAddBetCard();
  overlay.classList.toggle("overlay");
}

function betAdd() {
  const name = document.querySelector("#name").value;
  const sum = document.querySelector("#sum").value;
  const win = document.querySelector("#win").value;
  const exit = document.querySelector("#add-bet-card");
  const overlay = document.querySelector(".main");

  const date = new Date();

  bets.push({
    name,
    date: `${date.getFullYear()}/${date.getMonth() +
      1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    sum: parseInt(sum),
    win: parseInt(win),
    id: bets.length + 1
  });
  exit.onclick = function() {
    exit.parentNode.removeChild(exit);
    overlay.classList.toggle("overlay");
  };
  renderApp();
  playerCard();
  totalCard();
}

function betRemove(id) {
  bets = bets.filter(bet => {
    return bet.id != id;
  });
  renderApp();
}

function getPlayersTotalBets() {
  const players = [];
  for (let bet of bets) {
    const player = players.find(player => player.name === bet.name);
    if (!player) {
      players.push({
        name: bet.name,
        win: bet.win,
        sum: bet.sum,
        id: bet.id,
        date: bet.date
      });
    } else {
      player.win += bet.win;
      player.sum += bet.sum;
    }
  }
  return players;
}

function renderApp() {
  //   setLocalStorage();

  renderBetCard();
  playerCard();
  totalCard();
}

document.addEventListener("DOMContentLoaded", () => {
  //   getLocalStorage();
  renderApp();
});

const ul = document.querySelector("#display-text");
const dbRefObject = firebase
  .database()
  .ref()
  .child("bets");

dbRefObject.on("value", snap => {
  ul.innerHTML = " ";
  snap.forEach(childSnap => {
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="col s12">
        <div class="card horizontal">
            <div class="card-stacked">
                <div class="card-content">
                    <span class="circle"></span>
                    <p><b>${childSnap.val().name}</b></p>
                    <p></p>
                    <p>Summa: ${childSnap.val().sum}:-</p>
                    <p>Vinst: ${childSnap.val().win}:-</p> 
                </div>
                <div class="card-action">
                <a href="#" id="${childSnap.key}" onclick="betRemove(${
      childSnap.key
    })"><i class="material-icons card-action-icon">delete</i></a>
                <a href="#" onclick="editCard()"><i class="material-icons card-action-icon">
                        create
                    </i></a>
                </div>
            </div>
        </div>
    </div>
    `;
    document.querySelector("#card-bet").innerHTML += li.innerHTML;
  });
});
