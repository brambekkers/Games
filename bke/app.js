$(document).ready(function () {
    $("#resetButton").click(function (event) {
        resetBord();
    });

    $("#newGameButton").click(function (event) {
        maakNieuweGame();
    });

    $("#terugButton").click(function (event) {
        verlaatGame();
    });

    $(document).on("click", ".gameRij", function () {
        let gameID = $(this).attr('id');
        joinEenGame(gameID);
    });

    $(".LogoutButton").click(function (event) {
        firebase.auth().signOut()
    });
});

/////////////////////////////////////
///////////// FUNCTIES //////////////
/////////////////////////////////////

function resetBord() {
    for (let i = 0; i < bke.bord.length; i++) {
        for (let j = 0; j < bke.bord[i].length; j++) {
            bke.bord[i][j] = 0
        }
    }
    firebase.database().ref('games/bke/'+ gameID +'/winnaar').set(0);

    saveBordToFB()
    vulBordIn()
}

function checkVoorWinnaar() {
    // horizontale check
    for (let i = 0; i < 3; i++) {
        let winnaarH = true
        if (bke.bord[i][0] !== bke.bord[i][1] || bke.bord[i][0] !== bke.bord[i][2]) {
            winnaarH = false
        }

        if (winnaarH && bke.bord[i][0] !== 0) {
            if (i === 0) {
                $("#cell-0, #cell-1, #cell-2").css("background-color", "#90C3D4");
            } else if (i === 1) {
                $("#cell-3, #cell-4, #cell-5").css("background-color", "#90C3D4");
            } else if (i === 2) {
                $("#cell-6, #cell-7, #cell-8").css("background-color", "#90C3D4");
            }
            return true
        }
    }

    // verticale check
    for (let j = 0; j < 3; j++) {
        let winnaarV = true
        if (bke.bord[0][j] !== bke.bord[1][j] || bke.bord[0][j] !== bke.bord[2][j]) {
            winnaarV = false
        }

        if (winnaarV && bke.bord[0][j] !== 0) {
            if (j === 0) {
                $("#cell-0, #cell-3, #cell-6").css("background-color", "#90C3D4");
            } else if (j === 1) {
                $("#cell-1, #cell-4, #cell-7").css("background-color", "#90C3D4");
            } else if (j === 2) {
                $("#cell-2, #cell-5, #cell-8").css("background-color", "#90C3D4");
            }
            return true
        }
    }

    // diagonale check
    let winnaarD1 = true
    let winnaarD2 = true

    if (bke.bord[0][0] !== bke.bord[1][1] || bke.bord[0][0] !== bke.bord[2][2]) {
        winnaarD1 = false
    }

    if (bke.bord[0][2] !== bke.bord[1][1] || bke.bord[0][2] !== bke.bord[2][0]) {
        winnaarD2 = false
    }

    if (winnaarD1 && bke.bord[1][1] !== 0) {
        $("#cell-0, #cell-4, #cell-8").css("background-color", "#90C3D4");
        return true
    }
    if (winnaarD2 && bke.bord[1][1] !== 0) {
        $("#cell-2, #cell-4, #cell-6").css("background-color", "#90C3D4");
        return true
    }

}