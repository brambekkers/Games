let tetris = $('#tetris')[0]
let context = tetris.getContext("2d");

let aantalRijen = 26
let TetrisLvl = 1
let AantalLijnen = 0

// blok definieren als player
const player = {
    plaats: {
        x: 0,
        y: 0
    },
    stukken: null,
}

// kleuren van de blokken
const kleuren = [
    null,
    "#4592ac",
    "#e4384b",
    "#eba164",
    "#8578d4",
    "#f5da41",
    "#2872b9",
    "#4dbdbe",
]

///////////////////////////////////////////////////////////////////////////
///////////////////////////////// SCHERM //////////////////////////////////
///////////////////////////////////////////////////////////////////////////
let TetrisHeight = $(window).height() - ($(window).height() / 100 * 10);
let Tetriswidth = TetrisHeight / 16 * 9
let vierkantBlok = Math.round(TetrisHeight / aantalRijen)
let aantalKolom = Math.round(aantalRijen / 16 * 9)

let TetrisVakkenHeight = Math.round(TetrisHeight / vierkantBlok - 1)
let TetrisVakkenWidth = Math.round(Tetriswidth / vierkantBlok - 1)

tetris.width = vierkantBlok * aantalKolom;
tetris.height = vierkantBlok * aantalRijen;

context.scale(vierkantBlok, vierkantBlok)

// spelbord vlakverdeling
const spelBord = maakMatrix(aantalKolom, aantalRijen)

///////////////////////////////////////////////////////////////////////////
//////////////////////////////// FUNCTIES /////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// maak bord, clear bord
function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, tetris.width, tetris.height);
    
    // maak stukken
    maakStukken(spelBord, {x:0, y:0})
    maakStukken(player.stukken, player.plaats)
}

// Verdeel het spelbord in rijen en kolommen
function maakMatrix(w, h) {
    const matrix = [];

    while (h--) {
        matrix.push(new Array(w).fill(0))
    }
    return matrix
}
// Maak Tetris stuk
function maakfiguur(type) {
    if (type === "T") {
        return {
            vorm: [
                [1, 1, 1],
                [0, 1, 0],
                [0, 0, 0],
            ]
        }
    }
    else if (type === "O") {
        return {
            vorm: [
                [2, 2],
                [2, 2],
            ]
        }
    }
    else if (type === "S") {
        return {
            vorm: [
                [0, 3, 3],
                [3, 3, 0],
                [0, 0, 0],
            ]
        }
    }
    else if (type === "Z") {
        return {
            vorm: [
                [4, 4, 0],
                [0, 4, 4],
                [0, 0, 0],
            ]
        }
    }
    else if (type === "L") {
        return {
            vorm: [
                [5, 0, 0],
                [5, 0, 0],
                [5, 5, 0],
            ]
        }
    }
    else if (type === "J") {
        return {
            vorm: [
                [0, 6, 0],
                [0, 6, 0],
                [6, 6, 0],
            ]
        }
    }
    else if (type === "I") {
        return {
            vorm: [
                [7, 0, 0, 0],
                [7, 0, 0, 0],
                [7, 0, 0, 0],
                [7, 0, 0, 0],
            ]
        }
    }

}

// Plaats Tetris stukken op het bord
function maakStukken(TetrisStukken, offset) {
    TetrisStukken.forEach(function (row, y) {
        row.forEach(function (value, x) {
            if (value !== 0) {
                context.fillStyle = kleuren[value];
                context.fillRect(   x + offset.x,
                                    y + offset.y,
                                    1, 1)
            }
        });
    });
}

// maak een nieuw speelstuk
function resetPlayer(){
    const beschikbareStukken = ["J", "L", "T", "I", "O", "S", "Z"]
    let randomNummer = Math.round(Math.random() * Math.floor(beschikbareStukken.length - 1))
    let nieuwStuk = maakfiguur(beschikbareStukken[randomNummer])
    player.stukken = nieuwStuk.vorm;
    player.kleur = nieuwStuk.kleur;
    player.plaats.y = 0;
    player.plaats.x = TetrisVakkenWidth / 2 - 1;

    if(botsing(spelBord, player)){
        spelBord.forEach(function(row){
            row.fill(0)
                           
            updateScore()
            updateTopScore()
            score = 0
            dropInterval = 1000
        })
    }

}

// Laat speelstuk zakken
function dropStuk() {
    player.plaats.y++
    score++
    if(botsing(spelBord, player)){
        player.plaats.y--
        score--
        zetStukkenVast(spelBord, player)
        resetPlayer()
        verwijderVolleRij(spelBord)
    }
    dropCounter = 0
    updateScore()
}

// verplaats speler
function verplaatsPlayer(richting) {
    player.plaats.x += richting;
    if (botsing(spelBord, player)) {
        player.plaats.x -= richting;     
    }
}

function playerRotate(dir) {
    const pos = player.plaats.x;
    let offset = 1;
    draaien(player.stukken, dir)
    while (botsing(spelBord, player)) {
        player.plaats.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.stukken[0].length){
            rotate(player.stukken, -dir);
            player.plaats.x = pos;
            return;
        } 
    }
}

function draaien(TetrisStuk, dir){
    for (let y = 0; y < TetrisStuk.length; y++) {
        for (let x = 0; x < y; x++) {
            [
                TetrisStuk[x][y],
                TetrisStuk[y][x]
            ] = [
                TetrisStuk[y][x],
                TetrisStuk[x][y]
            ];     
        }   
    }

    if (dir > 0) {
        TetrisStuk.forEach(function(row){
            row.reverse()
        })
    } else {
        TetrisStuk.reverse();
    }
}



// Kijk of er een botsing is
function botsing(arena, speler) {
    const [m,o] = [speler.stukken, speler.plaats]
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false; 
}

// zet de stukken vast op het spelbord
function zetStukkenVast(spelBord, player) {
    player.stukken.forEach(function (row, y) {
        row.forEach(function (value, x) {
            if (value !== 0) {
                spelBord[y + player.plaats.y][x + player.plaats.x] = value;
            }
        })
    })
}

// verwijder volle rijen
function verwijderVolleRij(spelBord){
    checkLvl()
    let rijenTellen = 1
    outer: for (let y = spelBord.length -1; y > 0; y--) {
        let volleRij = 0
        for (let x = 0; x < spelBord[y].length; x++) {
            if (spelBord[y][x] === 0) {
                continue outer;
            }
        }  

        const row = spelBord.splice(y, 1)[0].fill(0);
        spelBord.unshift(row)
        y++

        score += rijenTellen * 50;
        rijenTellen *= 2
        AantalLijnen++
        tetrisLijnenCheck++
    } 
}

var tetrisLijnenCheck = 0
function checkLvl(){
    if (tetrisLijnenCheck - 5 === 0) {
        console.log("level omhoog")
        tetrisLijnenCheck = 0
        TetrisLvl++
        dropInterval -= 50
    }
}


function updateScore(){
    $("#huidigeScore").html(score)
    $("#huidigeLijnen").html(AantalLijnen)
    $("#huidigeLevel").html(TetrisLvl)
}

function updateTopScore(){
    if(score > topScore.score){
        topScore.score = score
        topScore.naam = $("#huidigeNaam").val()
        $("#topScore").html(score)
        $("#topScoreNaam").html($("#huidigeNaam").val())

        localStorage.setItem("topscoreTetris", topscore);
    }
}


///////////////////////////////////////////////////////////////////////////
//////////////////////// AUTOMATISCHE VERPLAATSING/////////////////////////
///////////////////////////////////////////////////////////////////////////
let score = 0;
let topScore = {
    score: 0,
    naam: null
}
let laatsteTijd = 0;
let dropCounter = 0;
let dropInterval = 1000;

function update(verstrekenTijd = 0) {
    // Tijd instelling
    const deltaTime = verstrekenTijd - laatsteTijd
    laatsteTijd = verstrekenTijd
    dropCounter += deltaTime;

    // verplaatsing y 
    if (dropCounter >= dropInterval) {
        dropStuk();
    }
    draw();    
    requestAnimationFrame(update);
}



///////////////////////////////////////////////////////////////////////////
///////////////////////// HANDMATIGE VERPLAATSING//////////////////////////
///////////////////////////////////////////////////////////////////////////
$(document).keydown(function (event) {
    if (event.keyCode === 37) {
        verplaatsPlayer( -1 )
    } else if (event.keyCode === 39) {
        verplaatsPlayer( 1 )
    } else if (event.keyCode === 40) {
        dropStuk();
    } else if (event.keyCode === 32) {
        playerRotate(1)
    }
});



resetPlayer();
update();