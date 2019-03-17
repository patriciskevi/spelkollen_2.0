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

// let bets = [];

function renderBetCard() {
  const betCard = document.querySelector("#card-bet");
  const dbRefObject = firebase
    .database()
    .ref()
    .child("bets");

  dbRefObject.on("value", snap => {
    betCard.innerHTML = "";
    snap.forEach(childSnap => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="col s12">
            <div class="card horizontal">
                <div class="card-stacked">
                    <div class="card-content">
                        <span class="circle"></span>
                        <p><b>${childSnap.val().name}</b></p>
                        <p>${childSnap.val().date}</p>
                        <p>Summa: ${childSnap.val().sum}:-</p>
                        <p>Vinst: ${childSnap.val().win}:-</p> 
                    </div>
                    <div class="card-action">
                    <a href="#"><i class="material-icons card-action-icon" id="${
                      childSnap.key
                    }" onclick="betRemove()">delete</i></a>
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

// function playerCard() {
//   firebase.auth().onAuthStateChanged(function(user) {
//     for (let player of getPlayersTotalBets()) {
//       const card = document.createElement("div");
//       {
//         card.innerHTML = `
//                             <div class="col s12">
//                                 <div class="card horizontal">
//                                     <div class="card-stacked">
//                                         <div class="card-content">
//                                             <img id="cardUserPhoto" src="${
//                                               user.photoURL
//                                             }">
//                                             <p><b>${user.displayName}</b>,</p>
//                                             <p>Du har spelat för: ${
//                                               player.sum
//                                             }</p>
//                                             <p>Din totala vinstsumma är: ${
//                                               player.win
//                                             }</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             `;
//         document.querySelector("#stats").innerHTML = card.innerHTML;
//       }
//     }
//   });
// }

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

  overlay.classList.toggle("overlay");
}

function betAdd() {
  // Get elements
  const name = document.querySelector("#name").value;
  const sum = document.querySelector("#sum").value;
  const win = document.querySelector("#win").value;
  const exit = document.querySelector("#add-bet-card");
  const overlay = document.querySelector(".main");

  const date = new Date();

  // Create reference
  const dbRef = firebase.database();

  // Create bet
  const bet = {
    name: name,
    date: `${date.getFullYear()}/${date.getMonth() +
      1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    sum: sum,
    win: win
  };

  // Sync
  dbRef.ref("bets").push(bet);

  exit.onclick = function() {
    exit.parentNode.removeChild(exit);
    overlay.classList.toggle("overlay");
  };
  //   renderApp();
  //   playerCard();
  totalCard();
}

function betRemove() {
  const dbRefObject = firebase
    .database()
    .ref()
    .child("bets");

  dbRefObject
    .remove()
    .then(() => {
      console.log("Remove success");
    })
    .catch(function(error) {
      console.log("Remove failed" + error.message);
    });
  //   dbRefObject.on("child_removed", snap => {
  //     const betToRemove = document.getElementById(snap.key);
  //     betToRemove.remove();
  //   });
  //   console.log("delete");
  renderApp();
}

// function getPlayersTotalBets() {
//   const players = [];
//   for (let bet of bets) {
//     const player = players.find(player => player.name === bet.name);
//     if (!player) {
//       players.push({
//         name: bet.name,
//         win: bet.win,
//         sum: bet.sum,
//         id: bet.id,
//         date: bet.date
//       });
//     } else {
//       player.win += bet.win;
//       player.sum += bet.sum;
//     }
//   }
//   return players;
// }

function renderApp() {
  renderBetCard();
  //   playerCard();
  totalCard();
}

document.addEventListener("DOMContentLoaded", () => {
  renderApp();
});
