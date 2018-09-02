let cellen = []
let klaarOmTeSchuiven = true
let score = 0
let gameOver = false

function setup() {
    frameRate(10)
    let canvas = createCanvas(820, 820);
    canvas.parent('raster');
    background(51);
    nieuwSpel()

}

function draw() {

    if(!gameOver){
        // teken cellen
        for (const arrays of cellen) {
            for (const cell of arrays) {
                cell.draw()
            }
        }
        // watch for keypress
        if (keyIsPressed && klaarOmTeSchuiven && (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40)) {

            klaarOmTeSchuiven = false
            if (keyCode === 37) {
                verplaatsCellen("rij", -1)
            }
            if (keyCode === 38) {
                verplaatsCellen("kolom", -1)
            }
            if (keyCode === 39) {
                verplaatsCellen("rij", 1)
            }
            if (keyCode === 40) {
                verplaatsCellen("kolom", 1)
            }
            nieuwNummer()

            setTimeout(function () {
                klaarOmTeSchuiven = true
            }, 500)
        }
    }else{
        fill(200)
        rect(0,0, width, height)

        fill(120)
        strokeWeight(5)
        textAlign(CENTER);
        textSize(130);
        text("Game Over", width/2, height/2);
    }
    

    
    document.getElementById("scoreText").innerHTML = score
}



// CELLEN
function cell(x, y) {
    this.n = 0
    this.x = x * 200 + 10
    this.y = y * 200 + 10

    this.draw = function () {
        // maak vakjes
        stroke(51);
        strokeWeight(20)
        // bepaal kleur
        if (this.n === 0) {
            fill(200)
        }
        if (this.n === 2) {
            fill("#ece9cc")
        }
        if (this.n === 4) {
            fill("#f1ecb5")
        }
        if (this.n === 8) {
            fill("#f3c98a")
        }
        if (this.n === 16) {
            fill("#e9b668")
        }
        if (this.n === 32) {
            fill("#cc9b7f")
        }
        if (this.n === 64) {
            fill("#c47b51")
        }
        if (this.n === 128) {
            fill("#e59373")
        }
        if (this.n === 256) {
            fill("#d76032")
        }
        if (this.n === 512) {
            fill("#94f597")
        }
        if (this.n === 1024) {
            fill("#f3c98a")
        }
        if (this.n === 2048) {
            fill("#f3c98a")
        }
        rect(this.x, this.y, 200, 200)

        // maak text
        if (this.n) {
            fill(51)
            strokeWeight(5)
            textAlign(CENTER);
            textSize(60);
            text(this.n, this.x + 100, this.y + 125);
        }
    }
}

function nieuwNummer() {
    allesVol = true
    for (const arrays of cellen) {
        for (const cell of arrays) {
            if (cell.n === 0) {
                allesVol = false
            }
        }
    }

    if (!allesVol) {
        let nummerGeplaatst = false
        // loop om nieuw nummer op een unieke plek te plaatsen
        while (!nummerGeplaatst) {
            let rr = floor(random(4))
            let rk = floor(random(4))
            if (cellen[rr][rk].n === 0) {
                setTimeout
                cellen[rr][rk].n = 2
                nummerGeplaatst = true
            }
        }
        // het hele veld is vol en het lukt niet om een nieuwe plek te vullen
    } else {
        gameOver = true
    }

}

function nieuwSpel() {
    // maak bord leeg
    cellen = []
    for (let i = 0; i < 4; i++) {
        cellen.push([])
        for (let j = 0; j < 4; j++) {
            cellen[i].push(new cell(j, i))
        }
    }

    // vul twee nieuwe vakjes
    nieuwNummer()
    nieuwNummer()
}

function verplaatsCellen(soort, richting) {
    for (let k = 0; k < 4; k++) {
        if (soort === "rij") {
            // verplaats naar links
            if (richting < 0) {
                for (let i = 3; i >= 0; i--) {
                    for (let j = 3; j >= 0; j--) {
                        if (isDeCellNaastMijLeeg(i, j, 0, -1)) {
                            cellen[i][j - 1].n = cellen[i][j].n
                            cellen[i][j].n = 0
                        }
                    }
                }
            }
            // verplaats naar rechts
            else {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (isDeCellNaastMijLeeg(i, j, 0, 1)) {
                            cellen[i][j + 1].n = cellen[i][j].n
                            cellen[i][j].n = 0
                        }
                    }
                }
            }
        }
        if (soort === "kolom") {
            // verplaats naar boven
            if (richting < 0) {
                for (let i = 3; i >= 0; i--) {
                    for (let j = 3; j >= 0; j--) {
                        if (isDeCellNaastMijLeeg(i, j, -1, 0)) {
                            cellen[i - 1][j].n = cellen[i][j].n
                            cellen[i][j].n = 0
                        }
                    }
                }
            }
            // verplaats naar onder
            else {
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (isDeCellNaastMijLeeg(i, j, 1, 0)) {
                            cellen[i + 1][j].n = cellen[i][j].n
                            cellen[i][j].n = 0
                        }
                    }
                }
            }
        }
    }
    zelfdeNummersSamenvoegen(soort, richting)
}

function isDeCellNaastMijLeeg(x, y, dx, dy) {
    if (cellen[x + dx]) {
        if (cellen[x + dx][y + dy]) {
            if (cellen[x + dx][y + dy].n) {
                // cell heeft een hoger nummer dan 0
                return false
            } else {
                // cell is leeg
                return true
            }
        } else {
            //cell bestaat niet
            return false
        }
    } else {
        // cell bestaat niet
        return false
    }

}

function zelfdeNummersSamenvoegen(soort, richting) {
    if (soort == "rij") {
        // check van links naar rechts
        if (richting < 0) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (cellen[i][j + 1]) {
                        if (cellen[i][j + 1].n === cellen[i][j].n) {
                            cellen[i][j].n = cellen[i][j].n + cellen[i][j].n
                            cellen[i][j + 1].n = 0

                            // score berekenen en optellen
                            if(cellen[i][j].n > 0){
                                let macht = Math.log(cellen[i][j].n)/Math.log(2)
                                let punten = Math.pow(2, macht)* (macht-1)
                                score += punten
                            } 
                        }
                    }
                }
            }
        }
        // check van rechts naar links
        else {
            for (let i = 3; i >= 0; i--) {
                for (let j = 3; j >= 0; j--) {
                    if (cellen[i][j - 1]) {
                        if (cellen[i][j - 1].n === cellen[i][j].n) {
                            cellen[i][j].n = cellen[i][j].n + cellen[i][j].n
                            cellen[i][j - 1].n = 0

                            // score berekenen en optellen
                            if(cellen[i][j].n > 0){
                                let macht = Math.log(cellen[i][j].n)/Math.log(2)
                                let punten = Math.pow(2, macht)* (macht-1)
                                score += punten
                            }
                        }
                    }
                }
            }
        }
    } else {
        // check van boven naar beneden
        if (richting < 0) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (cellen[i + 1]) {
                        if (cellen[i + 1][j]) {
                            if (cellen[i + 1][j].n === cellen[i][j].n) {
                                cellen[i][j].n = cellen[i][j].n + cellen[i][j].n
                                cellen[i + 1][j].n = 0
                                
                                // score berekenen en optellen
                                if(cellen[i][j].n > 0){
                                    let macht = Math.log(cellen[i][j].n)/Math.log(2)
                                    let punten = Math.pow(2, macht)* (macht-1)
                                    score += punten
                                }
                            }
                        }
                    }
                }
            }
        }
        // check van beneden naar boven
        else {
            for (let i = 3; i >= 0; i--) {
                for (let j = 3; j >= 0; j--) {
                    if (cellen[i - 1]) {
                        if (cellen[i - 1][j]) {
                            if (cellen[i - 1][j].n === cellen[i][j].n) {
                                cellen[i][j].n = cellen[i][j].n + cellen[i][j].n
                                cellen[i - 1][j].n = 0

                                // score berekenen en optellen
                                if(cellen[i][j].n > 0){
                                    let macht = Math.log(cellen[i][j].n)/Math.log(2)
                                    let punten = Math.pow(2, macht)* (macht-1)
                                    score += punten
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


// TOUCH
let touchBegin = [0, 0]
let touchEind = [0, 0]

function touchStarted() {
    touchBegin = [winMouseX, winMouseY]
    // prevent default
    return false;
}

function touchEnded() {
    touchEind = [winMouseX, winMouseY]

    afstandX = abs(abs(touchBegin[0]) - abs(touchEind[0]))
    afstandY = abs(abs(touchBegin[1]) - abs(touchEind[1]))

    if((afstandX > 50 || afstandY > 50) && !gameOver){
        // dit is een swipe links of rechts
        if (afstandX > afstandY) {
            if (touchBegin[0] < touchEind[0]) {
                verplaatsCellen("rij", 1)
            } else {
                verplaatsCellen("rij", -1)
            }
        }
        // dit is een swipe omhoog of naar beneden
        else {
            if (touchBegin[1] < touchEind[1]) {
                verplaatsCellen("kolom", 1)
            } else {
                verplaatsCellen("kolom", -1)
            }
        }
        nieuwNummer()
    }


    // prevent default
    return false;
}