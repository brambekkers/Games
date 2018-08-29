let bke
let games
let gameID

var config = {
    apiKey: "AIzaSyDsYG6fdCv1rJJKRJiJsU5aqZLvOEo7U2s",
    authDomain: "test-94e4e.firebaseapp.com",
    databaseURL: "https://test-94e4e.firebaseio.com",
    projectId: "test-94e4e",
    storageBucket: "test-94e4e.appspot.com",
    messagingSenderId: "429315971392"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
var ref = firebase.database().ref("games");

ref.on("value", function (snapshot) {
    checkWelkBord()

    // vul gameList
    games = snapshot.child("bke").val();
    let tellen = 1
    $("#gameListBody").empty()
    Object.keys(games).forEach(function (key) {

        // kijk hoeveel spelers er in één level meedoen
        let aantalSpelers = 0;
        games[key].spelers.forEach(function (speler) {
            if (speler.id) {
                aantalSpelers++
            }
        })

        // plaats game in lijst
        $("#gameListBody").append(
            "<tr id='" + key + "' class='gameRij'>" +
            "<th scope='row'>" + tellen + "</th>" +
            "<td>" + games[key].maker.naam + "'s game</td>" +
            "<td>" + aantalSpelers + "/2</td>" +
            "</tr>",
        );
        tellen++
    });

    if(gameID){
        updateText();
    }
});

$(document).ready(function () {
    $(".cellen").click(function (event) {
        // stel rij en kolom in
        if (event.target.innerHTML.length <= 0 && uid === bke.spelers[bke.beurt].id) {
            nummer = event.target.id.split('-')[1];
            var rij
            var kolom

            if (nummer < 3) {
                rij = 0
                kolom = nummer
            } else if (nummer < 6) {
                rij = 1
                kolom = nummer - 3
            } else if (nummer < 9) {
                rij = 2
                kolom = nummer - 6
            }

            // schrijf nieuwe data
            if (bke.beurt) {
                bke.bord[rij][kolom] = 1
            } else {
                bke.bord[rij][kolom] = 2
            }

            // save data to firebase
            saveBordToFB();

            // Verander speler van beurt
            changeBeurt();
        }
    });
});

/////////////////////////////////////
///////////// FUNCTIES //////////////
/////////////////////////////////////

function maakNieuweGame() {
    let newData = {
        maker: {
            naam: firebase.auth().currentUser.displayName,
            id: firebase.auth().currentUser.uid
        },
        laatsteWijziging: new Date().getTime(),
        beurt: 1,
        winnaar: 0,
        bord: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        spelers: [{
                id: 0,
                naam: 0,
            },
            {
                id: 0,
                naam: 0,
            }
        ]
    }
    // controleer of er al games van de maker bestaan?
    let isErAlEenGame = false
    Object.keys(games).forEach(function (key) {
        if (games[key].maker.id === firebase.auth().currentUser.uid) {
            isErAlEenGame = true
            console.log('Je hebt al een game op het bord')
        }
    })

    if (!isErAlEenGame) {
        // maak nieuwe game aan
        firebase.database().ref('games/bke').push(newData);
    }
}

function joinEenGame(xvar) {
    gameID = xvar
    // haal de juiste game op 
    ref.on("value", function (snapshot) {
        // vul gameList
        bke = snapshot.child("bke/" + gameID).val();
    });

    // zet speler in het spel
    firebase.auth().currentUser.inGame = gameID;

    if (bke.spelers[0].id === uid || bke.spelers[1].id === uid) {
        console.log("welkom in de game")
    } else {
        if (bke.spelers[0].id === 0) {
            console.log("welkom in de game")
            firebase.database().ref('games/bke/' + gameID + '/spelers/0/id').set(uid);
            firebase.database().ref('games/bke/' + gameID + '/spelers/0/naam').set(firebase.auth().currentUser.displayName);
        } else if (bke.spelers[1].id === 0) {
            console.log("welkom in de game")
            firebase.database().ref('games/bke/' + gameID + '/spelers/1/id').set(uid);
            firebase.database().ref('games/bke/' + gameID + '/spelers/1/naam').set(firebase.auth().currentUser.displayName);
        } else {
            console.log("er doen al teveel mensen mee")
        }
    }
    checkWelkBord();
    updateText();
}

function verlaatGame() {
    // zet speler uit het spel
    firebase.auth().currentUser.inGame = false;

    // haal speler uit db actiefspel
    if (bke.spelers[0].id === uid) {
        firebase.database().ref('games/bke/' + gameID + '/spelers/0/id').set(0);
        firebase.database().ref('games/bke/' + gameID + '/spelers/0/naam').set(0);
    } else if (bke.spelers[1].id === uid) {
        firebase.database().ref('games/bke/' + gameID + '/spelers/1/id').set(0);
        firebase.database().ref('games/bke/' + gameID + '/spelers/1/naam').set(0);
    }

    // zet variable to false
    gameID = false
    bke = false
}


function saveBordToFB() {
    // save borddata to firebase
    firebase.database().ref('games/bke/'+ gameID +'/bord').set(bke.bord);
}

function changeBeurt() {
    if (bke.beurt === 1) {
        firebase.database().ref('games/bke/'+ gameID +'/beurt').set(0);
    } else if (bke.beurt === 0) {
        firebase.database().ref('games/bke/'+ gameID +'/beurt').set(1);
    }
}

function vulBordIn() {
    // vul bord in
    let cellen = 0

    for (let i = 0; i < bke.bord.length; i++) {
        for (let j = 0; j < bke.bord[i].length; j++) {
            let huidigeCell = document.getElementById("cell-" + cellen);

            if (bke.bord[i][j] === 0) {
                huidigeCell.innerHTML = "";
            }
            if (bke.bord[i][j] === 1) {
                huidigeCell.innerHTML = "X";
            } else if (bke.bord[i][j] === 2) {
                huidigeCell.innerHTML = "O";
            }

            cellen++
        }
    }
    // check voor een winnaar
    if (checkVoorWinnaar()) {
        firebase.database().ref('games/bke/'+ gameID +'/winnaar').set(1);
    }

    // Stel het veld goed in na een winnaar
    if (bke.winnaar === 0) {
        $("#resetButton").hide();
        $("#wie").show();
        $("#spelers").show();

        $(".cellen").css("background-color", "#ffffff");
    } else {
        $("#resetButton").show();
        $("#wie").hide();
        $("#spelers").hide();
    }
}

function updateText() {
    for (let i = 0; i < bke.spelers.length; i++) {
        if (bke.spelers[i]) {
            $("#speler"+i).html(bke.spelers[i].naam)
        }
    }

    if (bke.beurt === 0) {
        $("#wieAanZet").html(bke.spelers[1].naam)
    }else if (bke.beurt === 1) {
        $("#wieAanZet").html(bke.spelers[0].naam)
    }
    
}