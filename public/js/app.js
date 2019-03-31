import firebase from './firebase';
import {
  googleLogin,
  facebookLogin,
  logout
} from './auth';
import {
  arch
} from 'os';



const database = firebase.database;







let bets = [];


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
        win: parseInt(item.win),
        archived: item.archived
      });
    });
    bets.sort((a, b) => b.date - a.date);

    console.log("original bets:", bets);
    renderApp();
    displayCharts();
  });

function renderBetCard() {

  const archivedBetCard = document.getElementById("archive");
  console.log(archivedBetCard);
  archivedBetCard.innerHTML = "";

  const betCard = document.getElementById("card-bet");
  betCard.innerHTML = "";

  bets.map(item => {
    // if (item.archived) {
    const li = document.createElement("li");
    const date = new Date(item.date * 1000);

    li.innerHTML = `
      <div class="col s12 bet-card">
          <div class="card horizontal">
              <div class="card-stacked">
                  <div class="card-content bet-card-content">
                      <img class="profile-pic" src="https://www.qualiscare.com/wp-content/uploads/2017/08/default-user.png">
                      <div class="profile-name">
                        <p><b>${item.name}</b></p>
                      </div>
                      <div class="item-date">
                        <p><b>${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}</b></p>
                        <p>${date.getHours()}:${(date.getMinutes() < 10
      ? "0"
      : "") + date.getMinutes()}</p>
                      </div>
                  </div>
                  <div class="item-details">
                      <p>Summa: ${item.sum}:-</p>
                      <p>Vinst: ${item.win}:-</p>
                  </div>
                  <div class="card-action">
                    <a href="#"><i class="material-icons card-action-icon" id="" onclick="spelkollen.betRemoveCard('${
                      item.key
                    }')">delete</i></a>
                    <a href="#" onclick="spelkollen.editCard('${
                      item.key
                    }')"><i class="material-icons card-action-icon">
                          create
                      </i></a>
                      ${getArchiveBtn(item)}
                  </div>
              </div>
          </div>
      </div>
      `;
    if (item.archived) {
      archivedBetCard.innerHTML += li.innerHTML;
    } else {
      betCard.innerHTML += li.innerHTML;
    }
  });
}

function getArchiveBtn(item) {
  if (item.archived) {
    return "";
  }
  return `<a href="#" id="${item.key}" onclick="spelkollen.archiveBet('${
    item.key
  }')"><i class="material-icons card-action-icon">archive</i></a>`;
}

function archiveBet(id) {
  let bet = {
    archived: true
  };

  firebase.database().ref(`bets/${id}`);

  firebase
    .database()
    .ref(`bets/${id}`)
    .update(bet);
}

function editCard(id) {
  const overlay = document.querySelector(".main");
  overlay.classList.toggle("overlay");

  firebase
    .database()
    .ref(`bets/${id}`)
    .once("value")
    .then(snapshot => {
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
                          <a href="#"><i class="material-icons card-action-icon" onclick="spelkollen.addBetCardExit()">arrow_back</i></a>
                              <a href="#" onclick="spelkollen.betUpdate('${id}')"><i class="material-icons card-action-icon">
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
                            <input id="name" type="text" class="validate" value="${window.testUser}">
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
                <a href="#"><i class="material-icons card-action-icon" onclick="spelkollen.addBetCardExit()">arrow_back</i></a>
                    <a href="#" onclick="spelkollen.betAdd()"><i class="material-icons card-action-icon">
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
  document.querySelector("#stats-group").innerHTML = li.innerHTML;
}

function userCard() {
  let userSum = getUserSum(window.testUser, "sum");
  let userWin = getUserSum(window.testUser, "win");
  let sum = userWin - userSum;
  const result = document.getElementsByClassName("card-result");
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
                        <p class="card-title"><b>${window.testUser}</b></p>
                        <p>Omsättning: ${userSum}:-<p>
                        <p>Vinst: ${userWin}:-</p>
                        <br>
                        <p class="card-result"><b>${sum}</b></p>
                    </div>
                </div>
            </div>
        </div>
        `;
  document.querySelector("#stats-user").innerHTML = li.innerHTML;
}

function displayCharts() {
  let data = [janResults(), febResults(), marchResults()];
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [{
          label: "Vinst",
          data: [data[0].janTotWin, data[1].febTotWin, data[2].marchTotWin],
          backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 99, 132, 0.2)", "rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1
        },
        {
          label: "Omsättning",
          data: [data[0].janTotSum, data[1].febTotSum, data[2].marchTotSum],
          backgroundColor: ["rgba(255, 199, 132, 0.2)", "rgba(255, 199, 132, 0.2)", "rgba(255, 199, 132, 0.2)"],
          borderColor: ["rgba(255, 199, 132, 1)", "rgba(255, 199, 132, 1)", "rgba(255, 199, 132, 1)"],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

const addButton = () => {
  const overlay = document.querySelector(".main");
  renderAddBetCard();
  overlay.classList.toggle("overlay");
};

// function betAdd() {
//   // Get elements
//   const name = document.querySelector("#name").value;
//   const sum = document.querySelector("#sum").value;
//   const win = document.querySelector("#win").value;
//   const exit = document.querySelector("#add-bet-card");
//   const overlay = document.querySelector(".main");

//   // Create reference
//   const dbRef = firebase.database();

//   // Create bet
//   const bet = {
//     name: name,
//     date: new Date().getTime() / 1000,
//     sum: sum,
//     win: win
//   };

//   // Sync
//   dbRef.ref("bets").push(bet);

//   exit.onclick = function() {
//     exit.parentNode.removeChild(exit);
//     overlay.classList.toggle("overlay");
//   };
//   //   renderApp();
//   //   playerCard();
//   // totalCard();
// }

const betAdd = () => {
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
    win: win,
    archived: false
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

const betUpdate = (id) => {
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
  dbRef.ref(`bets/${id}`).update(bet);

  exit.onclick = function () {
    exit.parentNode.removeChild(exit);
    overlay.classList.toggle("overlay");
  };
  //   renderApp();
  //   playerCard();
  //   totalCard();
}

const betRemove = (id) => {
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
                      <a href="#"><i class="material-icons card-action-icon" onclick="spelkollen.addBetCardExit()">arrow_back</i></a>
                      <a href="#"><i class="material-icons card-action-icon" onclick="spelkollen.betRemove('${id}'); spelkollen.addBetCardExit()">
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
  getResults();
  janResults();
  febResults();
  marchResults();
}

function getResults() {
  let numberOfWins = bets.filter(item => item.win > 0);
  let numberOfBets = bets.filter(item => item.sum > 0);
  let mostWins = numberOfWins.filter(item => item.na);
  console.log(numberOfWins, numberOfBets);
}

function janResults() {
  let betsJan = bets.filter(
    item => item.date < toTimestamp("01/31/2019 23:59:59")
  );

  let janTotWin = betsJan.reduce((acc, item) => acc + item.win, 0);
  let janTotSum = betsJan.reduce((acc, item) => acc + item.sum, 0);

  console.log(betsJan, janTotWin, janTotSum);
  return {
    janTotWin: janTotWin,
    janTotSum: janTotSum
  };
}

function febResults() {
  let betsFeb = bets.filter(
    item =>
    item.date > toTimestamp("01/31/2019 23:59:59") &&
    item.date < toTimestamp("02/28/2019 23:59:59")
  );

  let febTotWin = betsFeb.reduce((acc, item) => acc + item.win, 0);
  let febTotSum = betsFeb.reduce((acc, item) => acc + item.sum, 0);

  console.log(betsFeb, febTotWin, febTotSum);
  return {
    febTotWin: febTotWin,
    febTotSum: febTotSum
  };
}

function marchResults() {
  let betsMarch = bets.filter(
    item =>
    item.date > toTimestamp("02/28/2019 23:59:59") &&
    item.date < toTimestamp("03/31/2019 23:59:59")
  );
  let marchTotWin = betsMarch.reduce((acc, item) => acc + item.win, 0);
  let marchTotSum = betsMarch.reduce((acc, item) => acc + item.sum, 0);

  console.log(betsMarch, marchTotWin, marchTotSum);
  return {
    marchTotWin: marchTotWin,
    marchTotSum: marchTotSum
  };
}

function toTimestamp(firstDate, secondDate) {
  const dateOne = Date.parse(firstDate);
  const dateTwo = Date.parse(secondDate);
  return dateOne / 1000;
}


window.spelkollen = {};

window.spelkollen.googleLogin = googleLogin;
window.spelkollen.facebookLogin = facebookLogin;
window.spelkollen.addButton = addButton;
window.spelkollen.betAdd = betAdd;
window.spelkollen.addBetCardExit = addBetCardExit;
window.spelkollen.archiveBet = archiveBet;
window.spelkollen.editCard = editCard;
window.spelkollen.betRemoveCard = betRemoveCard;
window.spelkollen.betRemove = betRemove;
window.spelkollen.betUpdate = betUpdate;
window.spelkollen.logout = logout;

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

// window.onload = function() {
//   displayCharts();
// };
