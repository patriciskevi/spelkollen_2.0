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

// Email login
function emailLogin() {}


function logout() {
  firebase.auth().signOut();
  window.location = "index.html";
}
// END OF LOGIN


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
    bets.sort((a, b) => b.date - a.date);

    console.log("original bets:", bets);
    renderApp();
  });


function renderBetCard() {
  const betCard = document.querySelector("#card-bet");
  betCard.innerHTML = "";

  bets.map(item => {
    const li = document.createElement("li");
    const date = new Date(item.date * 1000);

    li.innerHTML = `
            <div class="col s12">
                <div class="card horizontal">
                    <div class="card-stacked">
                        <div class="card-content">
                            <span class="circle"></span>
                            <p><b>${item.name}</b></p>
                            <p>${date.getFullYear()}-${date.getMonth() +1}-${date.getDate()}, ${date.getHours()}:${date.getMinutes()}</p>
                            <p>Summa: ${item.sum}:-</p>
                            <p>Vinst: ${item.win}:-</p> 
                        </div>
                        <div class="card-action">
                        <a href="#"><i class="material-icons card-action-icon" id="${
                          item.key
                        }" onclick="betRemoveCard('${item.key}')">delete</i></a>
                        <a href="#" onclick="editCard('${item.key}')"><i class="material-icons card-action-icon">
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

function editCard(id) {
  const overlay = document.querySelector(".main");
  overlay.classList.toggle("overlay");

  firebase.database().ref(`bets/${id}`).once('value').then(snapshot => {
    const {
      name,
      sum,
      win
    } = snapshot.val();
    document.querySelector(".add-bet-card").innerHTML = `
        <div id="add-bet-card">
        <div class="col s12">
            <div class="card horizontal add-bet-card">
                <div class="card-stacked">
                    <div class="card-content">
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="name" type="text" class="validate" value="${name}">
                                <label for="name"></label>
                            </div>
                            <div class="input-field col s12">
                                <input id="sum" type="text" class="validate" value="${sum}">
                                <label for="sum"></label>
                            </div>
                            <div class="input-field col s12">
                                <input id="win" type="text" class="validate" value="${win}">
                                <label for="win"></label>
                            </div>
                        </div>
                        <div class="card-actions">
                          <a href="#"><i class="material-icons card-action-icon" onclick="addBetCardExit()">arrow_back</i></a>
                              <a href="#" onclick="betUpdate('${id}')"><i class="material-icons card-action-icon">
                              check
                              </i></a>
                        </div>
                    </div>
                </div>    
            </div>
        </div>    
        </div>
        `;
  });

}

function addBetCardExit() {
  const exit = document.querySelector("#add-bet-card");
  const overlay = document.querySelector(".main");

  exit.onclick = exit.parentNode.removeChild(exit);
  overlay.classList.toggle("overlay");
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
                            <input id="name" type="text" class="validate" value="${getCurrentUserName()}">
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
                    <div class="card-actions">
                <a href="#"><i class="material-icons card-action-icon" onclick="addBetCardExit()">arrow_back</i></a>
                    <a href="#" onclick="betAdd()"><i class="material-icons card-action-icon">
                    check
                    </i></a>
                </div>
                </div>
            </div>    
        </div>
    </div>    
    </div>
    `;
}

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

  let sum = groupWin - groupSum;

  const li = document.createElement("li");
  li.innerHTML = `
        <div class="col s12">
            <div class="card horizontal">
                <div class="card-stacked">
                    <div class="card-content">
                        <p class="card-title"><b>Gruppen</b></p>
                        <p>Omsättning: ${groupSum}:-<p>
                        <p>Vinst: ${groupWin}:-</p>
                        <br>
                        <p class="card-result"><b>${sum}:-</b></p>
                    </div>
                </div>
            </div>
        </div>
        `;
  document.querySelector("#stats").innerHTML += li.innerHTML;
}

function userCard() {
  let userSum = getUserSum(getCurrentUserName(), "sum");
  let userWin = getUserSum(getCurrentUserName(), "win");
  let sum = userWin - userSum;
  const result = document.getElementsByClassName('card-result');
  result.innerHTML = sum;
  const li = document.createElement("li");

  // if (sum < 0) {
  //   result.style.color = 'red';
  // } else {
  //   result.style.color = '#fff';
  // }

  li.innerHTML = `
        <div class="col s12">
            <div class="card horizontal">
                <div class="card-stacked">
                    <div class="card-content">
                        <p class="card-title"><b>${getCurrentUserName()}</b></p>
                        <p>Omsättning: ${userSum}:-<p>
                        <p>Vinst: ${userWin}:-</p>
                        <br>
                        <p class="card-result"><b>${sum}</b></p>
                    </div>
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

  // Create reference
  const dbRef = firebase.database();

  // Create bet
  const bet = {
    name: name,
    date: new Date().getTime() / 1000,
    sum: sum,
    win: win
  };

  // Sync
  dbRef.ref("bets").push(bet);

  exit.onclick = function () {
    exit.parentNode.removeChild(exit);
    overlay.classList.toggle("overlay");
  };
  //   renderApp();
  //   playerCard();
  // totalCard();
}

function betAdd() {
  // Get elements
  const name = document.querySelector("#name").value;
  const sum = document.querySelector("#sum").value;
  const win = document.querySelector("#win").value;
  const exit = document.querySelector("#add-bet-card");
  const overlay = document.querySelector(".main");

  // Create reference
  const dbRef = firebase.database();

  // Create bet
  const bet = {
    name: name,
    date: new Date().getTime() / 1000,
    sum: sum,
    win: win
  };

  // Sync
  dbRef.ref("bets").push(bet);

  exit.onclick = function () {
    exit.parentNode.removeChild(exit);
    overlay.classList.toggle("overlay");
  };
  //   renderApp();
  //   playerCard();
  //   totalCard();
}

function betUpdate(id) {
  // Get elements
  const name = document.querySelector("#name").value;
  const sum = document.querySelector("#sum").value;
  const win = document.querySelector("#win").value;
  const exit = document.querySelector("#add-bet-card");
  const overlay = document.querySelector(".main");

  // Create reference
  const dbRef = firebase.database();

  // Create bet
  const bet = {
    name: name,
    date: new Date().getTime() / 1000,
    sum: sum,
    win: win
  };

  // Sync
  dbRef.ref("bets").push(bet);

  exit.onclick = function () {
    exit.parentNode.removeChild(exit);
    overlay.classList.toggle("overlay");
  };
  //   renderApp();
  //   playerCard();
  //   totalCard();
}

function betRemove(id) {
  const dbRefObject = firebase.database().ref(`bets/${id}`);
  dbRefObject
    .remove()
    .then(() => {
      console.log("Remove success");
    })
    .catch(function (error) {
      console.log("Remove failed" + error.message);
    });
}

function betRemoveCard(id) {
  const overlay = document.querySelector(".main");
  overlay.classList.toggle("overlay");
  document.querySelector(".add-bet-card").innerHTML = `
    <div id="add-bet-card">
    <div class="col s12">
        <div class="card horizontal add-bet-card">
            <div class="card-stacked">
                <div class="card-content">
                    <div class="row">
                       <p id="bet-remove-text">Är du säker på att du vill ta bort spelet?</p>
                    </div>
                    <div class="card-actions">
                      <a href="#"><i class="material-icons card-action-icon" onclick="addBetCardExit()">arrow_back</i></a>
                      <a href="#"><i class="material-icons card-action-icon" onclick="betRemove('${id}'); addBetCardExit()">
                      check
                      </i></a>
                  </div>
                </div>
            </div>    
        </div>
    </div>    
    </div>
    `;
}

function renderApp() {
  renderBetCard();
  userCard();
  totalCard();
}

// Get localstorage and push it to firebase database
// const oldBets = JSON.parse(localStorage.getItem("bets"));

// function pushOldBets() {
//   oldBets.forEach(item => {
//     database()
//       .ref()
//       .child("bets")
//       .push({
//         date: new Date(item.date).getTime() / 1000,
//         name: item.name,
//         sum: item.sum,
//         win: item.win
//       });
//   });
// }
// pushOldBets();

document.addEventListener("DOMContentLoaded", () => {
  //renderApp();
});
