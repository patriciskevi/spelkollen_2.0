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

const database = firebase.database;

let bets = [];

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

database()
  .ref()
  .child("bets")
  .on("value", snapshot => {
    bets = [];
    snapshot.forEach(snapshotItem => {
      const item = snapshotItem.val();
      bets.push({
        key: snapshotItem.key,
        date: item.date,
        name: item.name,
        sum: parseInt(item.sum),
        win: parseInt(item.win)
      });
    });
    console.log("original bets:", bets);
    renderApp();
  });

function renderBetCard() {
  const betCard = document.querySelector("#card-bet");
  betCard.innerHTML = "";
  bets.map(item => {
    const li = document.createElement("li");
    li.innerHTML = `
          <div class="col s12">
              <div class="card horizontal">
                  <div class="card-stacked">
                      <div class="card-content">
                          <span class="circle"></span>
                          <p><b>${item.name}</b></p>
                          <p>${item.date}</p>
                          <p>Summa: ${item.sum}:-</p>
                          <p>Vinst: ${item.win}:-</p> 
                      </div>
                      <div class="card-action">
                      <a href="#"><i class="material-icons card-action-icon" id="${
                        item.key
                      }" onclick="betRemove('${item.key}')">delete</i></a>
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
}

// function renderBetCard() {
//   const betCard = document.querySelector("#card-bet");
//   const dbRefObject = firebase
//     .database()
//     .ref()
//     .child("bets");

//   dbRefObject.on("value", snap => {
//     betCard.innerHTML = "";
//     snap.forEach(childSnap => {
//       const li = document.createElement("li");
//       li.innerHTML = `
//         <div class="col s12">
//             <div class="card horizontal">
//                 <div class="card-stacked">
//                     <div class="card-content">
//                         <span class="circle"></span>
//                         <p><b>${childSnap.val().name}</b></p>
//                         <p>${childSnap.val().date}</p>
//                         <p>Summa: ${childSnap.val().sum}:-</p>
//                         <p>Vinst: ${childSnap.val().win}:-</p>
//                     </div>
//                     <div class="card-action">
//                     <a href="#"><i class="material-icons card-action-icon" id="${
//                       childSnap.key
//                     }" onclick="betRemove('${childSnap.key}')">delete</i></a>
//                     <a href="#" onclick="editCard()"><i class="material-icons card-action-icon">
//                             create
//                         </i></a>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         `;
//       document.querySelector("#card-bet").innerHTML += li.innerHTML;
//     });
//   });
// }

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

/**
 * Get current user name from firebase auth email.
 */
function getCurrentUserName() {
  const email = firebase.auth().currentUser.email;

  if (email === "patriciskevi@gmail.com") {
    return "Patric";
  } else if (email === "taddis@gmail.com") {
    return "Tobias";
  } else if (email === "kent.carlsson@start-up.se") {
    return "Kent";
  }
}

/**
 * Get sum for current user.
 */
function getUserSum(userName, property) {
  return bets
    .filter(item => item.name === userName)
    .reduce((sum, item) => (sum += item[property]), 0);
}

function getAllUsersNames() {
  return ["Tobias", "Kent", "Patric"];
}

function totalCard() {
  let groupSum = getAllUsersNames()
    .map(userName => getUserSum(userName, "sum"))
    .reduce((sum, userSum) => (sum += userSum), 0);

  let groupWin = getAllUsersNames()
    .map(userName => getUserSum(userName, "win"))
    .reduce((sum, userSum) => (sum += userSum), 0);

  const li = document.createElement("li");
  li.innerHTML = `
        <div class="col s12">
            <div class="card horizontal">
                <div class="card-stacked">
                    <div class="card-content">
                        <p>Total summa: ${groupSum}:-<p>
                        <p>Total vinst: ${groupWin}:-</p>
                    </div>
                    <div class="card-action"></div>
                </div>
            </div>
        </div>
        `;
  document.querySelector("#stats").innerHTML += li.innerHTML;
}

function userCard() {
  console.log(getCurrentUserName().photoURL);
  // const userPhoto = document.getElementById("user-photo");
  // if (getCurrentUserName()) {
  //   userPhoto.setAttribute("src", getCurrentUserName().photoURL);
  // }
  let groupSum = getAllUsersNames()
    .map(userName => getUserSum(userName, "sum"))
    .reduce((sum, userSum) => (sum += userSum), 0);

  let groupWin = getAllUsersNames()
    .map(userName => getUserSum(userName, "win"))
    .reduce((sum, userSum) => (sum += userSum), 0);

  const li = document.createElement("li");
  li.innerHTML = `
        <div class="col s12">
            <div class="card horizontal">
                <div class="card-stacked">
                    <div class="card-content">
                        <img src="" id="user-photo">
                        <p>${getCurrentUserName()}</p>
                        <p>Total summa: ${groupSum}:-<p>
                        <p>Total vinst: ${groupWin}:-</p>
                    </div>
                    <div class="card-action"></div>
                </div>
            </div>
        </div>
        `;
  document.querySelector("#stats").innerHTML += li.innerHTML;
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
  // totalCard();
}

function betRemove(id) {
  const dbRefObject = firebase.database().ref(`bets/${id}`);

  dbRefObject
    .remove()
    .then(() => {
      console.log("Remove success");
    })
    .catch(function(error) {
      console.log("Remove failed" + error.message);
    });

  // renderApp();
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
  userCard();
  totalCard();
}

document.addEventListener("DOMContentLoaded", () => {
  //renderApp();
});
