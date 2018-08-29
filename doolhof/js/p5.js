let tegels = []
let schatten = []
let helden = []
let spelers = []
let schattenOpBord = []
let reservetegel
let tegelbreedte

function preload() {
    tegel0 = loadImage('img/hoekstuk_afgerond.png');
    tegel1 = loadImage('img/rechtstuk_afgerond.png');
    tegel2 = loadImage('img/tstuk_afgerond.png');

    pijl0 = loadImage('img/pijl_0.png');
    pijl1 = loadImage('img/pijl_1.png');
    pijl2 = loadImage('img/pijl_2.png');
    pijl3 = loadImage('img/pijl_3.png');

    for (let i = 0; i < 14; i++) {
        schatten.push(loadImage('img/schatten/'+(i+1)+'.png'))
    }
    for (let i = 0; i <= 6; i++) {
        helden.push(loadImage('img/helden/'+(i)+'.png'))
    }
}

let setup = function() {
    pixelDensity(1);
    let bordCanvas = createCanvas(bordSize(), bordSize());
    bordCanvas.parent("bord");
    maakTegels();
    updateReserveTegel();
    verdeelSchatten();
    maakSpelers();

    
    frameRate(10)

}

function windowResized() {
    resizeCanvas(bordSize(), bordSize());
  }

function keyPressed() {
    // spel is begonnen
    if(!vm.splashscreen){

        if(vm.stap === 1){
            // verplaats speler
            let VerplaatsX = 0
            let VerplaatsY = 0
        
            if (keyCode === 37) {
                VerplaatsX = -1
            }
        
            if (keyCode === 39) {
                VerplaatsX = 1
            }
        
            if (keyCode === 38) {
                VerplaatsY = -1
            }
        
            if (keyCode === 40) {
                VerplaatsY = 1
            }
            let kanIk = kanIkVerplaatsen(spelers[vm.beurt].x, spelers[vm.beurt].y, VerplaatsX, VerplaatsY)
            if(kanIk){
                spelers[vm.beurt].move(VerplaatsX, VerplaatsY)
            }
        }
 
        // roteer reservetegel
        if (keyCode === 32) {
            if(reservetegel.richting < 3){
                reservetegel.richting++
            }else{
                reservetegel.richting = 0
            }
            updateReserveTegel();
        }
    }
}

function mouseClicked () {
    if(vm.stap === 0 && vm.splashscreen === false){
        for (const rijtegel of tegels) {
            for (const tegel of rijtegel) {
                tegel.klik()
            }
        }
    }
}

function kanIkVerplaatsen(spelerX, spelerY, richtingX, richtingY){
    let kanVerplaatsen = true

    nieuweX = spelerX + richtingX
    nieuweY = spelerY + richtingY

    if(nieuweX < 0 || nieuweY < 0 || nieuweX >= vm.aantalTegelsPerRij || nieuweY >= vm.aantalTegelsPerRij){
        kanVerplaatsen = false
    }

    if(kanVerplaatsen){
        //speler komt van boven
        if(spelerY < nieuweY){
            if(!tegels[nieuweY][nieuweX].opening.top || !tegels[spelerY][spelerX].opening.bottom){
                kanVerplaatsen = false
            }
        }
        //speler komt van rechts
        if(spelerX > nieuweX){
            if(!tegels[nieuweY][nieuweX].opening.right || !tegels[spelerY][spelerX].opening.left){
                kanVerplaatsen = false
            }
        }
        //speler komt van beneden
        if(spelerY > nieuweY){
            if(!tegels[nieuweY][nieuweX].opening.bottom || !tegels[spelerY][spelerX].opening.top){
                kanVerplaatsen = false
            }
        }
        //speler komt van links
        if(spelerX < nieuweX){
            if(!tegels[nieuweY][nieuweX].opening.left || !tegels[spelerY][spelerX].opening.right){
                kanVerplaatsen = false
            }
        }
    }
    
    return kanVerplaatsen
}


function draw() {
    for (const rijtegel of tegels) {
        for (const tegel of rijtegel) {
            tegel.draw()
        }
    }
    for (const schat of schattenOpBord) {
        schat.draw()
    }
    for (const s of spelers) {
        s.draw()
    }
    for (const rijtegel of tegels) {
        for (const tegel of rijtegel) {
            tegel.drawPijl()
        }
    }   
}


// maak grid
function maakTegels(){
    for (let i = 0; i < vm.aantalTegelsPerRij; i++) {
        let randomTegel = Math.floor(Math.random() * 3);
        let randomRichting = Math.floor(Math.random() * 4);
        
        tegels.push(new tegel())
    }
}

// tegels
function tegel(x, y, reserve, soort, richting){
    this.x = x
    this.y = y
    this.reserve = reserve
    this.soort = soort
    this.richting = richting
    this.schat = false
    this.opening =  {
                    top: false,
                    right: false,
                    bottom: false,
                    left: false,
                    }

    this.draw = function(){

        push()
        translate((this.x*tegelbreedte)+(tegelbreedte/2), (this.y*tegelbreedte)+(tegelbreedte/2));
        
        angleMode(DEGREES)
        rotate(90*this.richting);

        translate(-Math.abs((this.x*tegelbreedte)+(tegelbreedte/2)), -Math.abs((this.y*tegelbreedte)+(tegelbreedte/2)));
        imageMode(CENTER)
        if(this.soort === 0){
            image(tegel0, (this.x*tegelbreedte)+(tegelbreedte/2), (this.y*tegelbreedte)+(tegelbreedte/2), tegelbreedte, tegelbreedte);
        }
        if(this.soort === 1){
            image(tegel1, (this.x*tegelbreedte)+(tegelbreedte/2), (this.y*tegelbreedte)+(tegelbreedte/2), tegelbreedte, tegelbreedte);
        }
        if(this.soort === 2){
            image(tegel2, (this.x*tegelbreedte)+(tegelbreedte/2), (this.y*tegelbreedte)+(tegelbreedte/2), tegelbreedte, tegelbreedte);
        }
        pop()
    }

    this.drawPijl = function(){
        if(vm.stap === 0){
            push()
            imageMode(CENTER)

            let mouseXcor = Math.floor(  mouseX/tegelbreedte )
            let mouseYcor = Math.floor( mouseY/tegelbreedte )

            if(this.y === 0 && mouseY <= (0*tegelbreedte)+(tegelbreedte/3) && mouseXcor === this.x && mouseX > (tegelbreedte/3) && mouseX < (((vm.aantalTegelsPerRij)*tegelbreedte)-(tegelbreedte/3))){
                image(pijl0, (this.x*tegelbreedte)+(tegelbreedte/2), (this.y*tegelbreedte)+(tegelbreedte/2), tegelbreedte, tegelbreedte);
            }
            if(this.x === (vm.aantalTegelsPerRij-1) && mouseX >= ((vm.aantalTegelsPerRij-1)*tegelbreedte)+(tegelbreedte/3) && mouseX <= ((vm.aantalTegelsPerRij)*tegelbreedte) && mouseYcor === this.y){
                image(pijl1, (this.x*tegelbreedte)+(tegelbreedte/2), (this.y*tegelbreedte)+(tegelbreedte/2), tegelbreedte, tegelbreedte);
            }
            if(this.y === (vm.aantalTegelsPerRij-1) && mouseY >= ((vm.aantalTegelsPerRij-1)*tegelbreedte)+(tegelbreedte/3) && mouseXcor === this.x && mouseX > (tegelbreedte/3) && mouseX < (((vm.aantalTegelsPerRij)*tegelbreedte)-(tegelbreedte/3))){
                image(pijl2, (this.x*tegelbreedte)+(tegelbreedte/2), (this.y*tegelbreedte)+(tegelbreedte/2), tegelbreedte, tegelbreedte);
            }
            if(this.x === 0 && mouseX <= (0*tegelbreedte)+(tegelbreedte/3) && mouseX >= 0 && mouseYcor === this.y){
                image(pijl3, (this.x*tegelbreedte)+(tegelbreedte/2), (this.y*tegelbreedte)+(tegelbreedte/2), tegelbreedte, tegelbreedte);
            }
            pop()
        }
    }

    this.klik = function(){
        let mouseXcor = Math.floor(  mouseX/tegelbreedte )
        let mouseYcor = Math.floor( mouseY/tegelbreedte )
        let _this = this

        if(this.y === 0 && mouseY <= (0*tegelbreedte)+(tegelbreedte/3) && mouseXcor === this.x){
            verplaatsTegels("y", 1, _this.x)
            console.log("verplaats naar beneden")
        }
        if(this.x === (vm.aantalTegelsPerRij-1) && mouseX >= ((vm.aantalTegelsPerRij-1)*tegelbreedte)+(tegelbreedte/3) && mouseX <= ((vm.aantalTegelsPerRij)*tegelbreedte) && mouseYcor === this.y){
                console.log("verplaats naar links")
                verplaatsTegels("x", -1, _this.y)
        }
        if(this.y === (vm.aantalTegelsPerRij-1) && mouseY >= ((vm.aantalTegelsPerRij-1)*tegelbreedte)+(tegelbreedte/3) && mouseXcor === this.x){
                console.log("verplaats naar boven")
                verplaatsTegels("y", -1, _this.x)
        }
        if(this.x === 0 && mouseX <= (0*tegelbreedte)+(tegelbreedte/3) && mouseX >= 0 && mouseYcor === this.y){
                console.log("verplaats naar rechts")
                verplaatsTegels("x", 1, _this.y)
        }
    }
}
function maakTegels(){
    for (let i = 0; i < vm.aantalTegelsPerRij; i++) {
        tegels.push([])
        for (let j = 0; j < vm.aantalTegelsPerRij; j++) {
            let randomTegel = Math.floor(Math.random() * 3);
            let randomRichting = Math.floor(Math.random() * 4);
            
            tegels[i].push(new tegel(j, i, false, randomTegel, randomRichting))
        }
    }

    let randomTegel = Math.floor(Math.random() * 3);
    let randomRichting = Math.floor(Math.random() * 4);
    reservetegel = new tegel(0, 0, true, randomTegel, randomRichting)

    // Geef tegelbreedte aan
    tegelbreedte = width / vm.aantalTegelsPerRij

    //Maak tegels dicht
    for (let i = 0; i < vm.aantalTegelsPerRij; i++) {
        for (let j = 0; j < vm.aantalTegelsPerRij; j++) {
            let tegel = tegels[i][j]
            let opening
            
            if(tegel.soort === 0){
                opening = {
                    top: true,
                    right: true,
                    bottom: false,
                    left: false,
                    }
            }
            if(tegel.soort === 1){
                opening = {
                    top: false,
                    right: true,
                    bottom: false,
                    left: true,
                    }
            }
            if(tegel.soort === 2){
                opening = {
                    top: false,
                    right: true,
                    bottom: true,
                    left: true,
                    }
            }
            nieuweOpening = draaiTegel(opening, tegel.richting)
            tegel.opening = nieuweOpening

        }
    }

    if(reservetegel){
        let tegel = reservetegel
        let opening
        
        if(tegel.soort === 0){
            opening = {
                top: true,
                right: true,
                bottom: false,
                left: false,
                }
        }
        if(tegel.soort === 1){
            opening = {
                top: false,
                right: true,
                bottom: false,
                left: true,
                }
        }
        if(tegel.soort === 2){
            opening = {
                top: false,
                right: true,
                bottom: true,
                left: true,
                }
        }
        nieuweOpening = draaiTegel(opening, tegel.richting)
        tegel.opening = nieuweOpening
    }

}

function draaiTegel(obj, aantal){
    let opening = obj
    for (let index = 0; index < aantal; index++) {
        let nieuweOpening = {
            top: opening.left,
            right: opening.top,
            bottom: opening.right,
            left: opening.bottom,
        }
        
        opening = nieuweOpening
    }

    return opening
}

function updateReserveTegel(){
    vm.reserveTegel.soort = reservetegel.soort
    vm.reserveTegel.richting = reservetegel.richting
}

function verplaatsTegels(asSoort, richting, vasteAs){

    // omlaag
    if( asSoort === "y" && richting === 1){
        let temp = Object.assign({}, reservetegel); 

        for (let i = vm.aantalTegelsPerRij-1; i > 0; i--) {
            if(i === vm.aantalTegelsPerRij-1){
                // nieuwe reservetegel
                reservetegel.soort      = tegels[i][vasteAs].soort
                reservetegel.richting   = tegels[i][vasteAs].richting
                reservetegel.opening    = tegels[i][vasteAs].opening
            }
            tegels[i][vasteAs].soort    = tegels[i-1][vasteAs].soort
            tegels[i][vasteAs].richting = tegels[i-1][vasteAs].richting
            tegels[i][vasteAs].opening  = tegels[i-1][vasteAs].opening
        }

        tegels[0][vasteAs].soort    = temp.soort
        tegels[0][vasteAs].richting = temp.richting
        tegels[0][vasteAs].opening  = temp.opening

        verplaatsSchatten('y', vasteAs, 1)
        verplaatsSpelers('y', vasteAs, 1)
    }
    // omhoog
    if( asSoort === "y" && richting === -1){
        let temp = Object.assign({}, reservetegel); 

        for (let i = 0; i < vm.aantalTegelsPerRij-1; i++) {
            if(i === 0){
                // nieuwe reservetegel
                reservetegel.soort      = tegels[i][vasteAs].soort
                reservetegel.richting   = tegels[i][vasteAs].richting
                reservetegel.opening    = tegels[i][vasteAs].opening
            }
            tegels[i][vasteAs].soort    = tegels[i+1][vasteAs].soort
            tegels[i][vasteAs].richting = tegels[i+1][vasteAs].richting
            tegels[i][vasteAs].opening  = tegels[i+1][vasteAs].opening
        }

        tegels[vm.aantalTegelsPerRij-1][vasteAs].soort    = temp.soort
        tegels[vm.aantalTegelsPerRij-1][vasteAs].richting = temp.richting
        tegels[vm.aantalTegelsPerRij-1][vasteAs].opening  = temp.opening

        verplaatsSchatten('y', vasteAs,-1)
        verplaatsSpelers('y', vasteAs,-1)
    }
    // links
    if( asSoort === "x" && richting === 1){
        let temp = Object.assign({}, reservetegel); 

        for (let i = vm.aantalTegelsPerRij-1; i > 0; i--) {
            if(i === vm.aantalTegelsPerRij-1){
                // nieuwe reservetegel
                reservetegel.soort      = tegels[vasteAs][i].soort
                reservetegel.richting   = tegels[vasteAs][i].richting
                reservetegel.opening    = tegels[vasteAs][i].opening
            }
            tegels[vasteAs][i].soort    = tegels[vasteAs][i-1].soort
            tegels[vasteAs][i].richting = tegels[vasteAs][i-1].richting
            tegels[vasteAs][i].opening  = tegels[vasteAs][i-1].opening
        }

        tegels[vasteAs][0].soort    = temp.soort
        tegels[vasteAs][0].richting = temp.richting
        tegels[vasteAs][0].opening  = temp.opening

        verplaatsSchatten('x', vasteAs, 1)
        verplaatsSpelers('x', vasteAs, 1)
    }
    // rechts
    if( asSoort === "x" && richting === -1){
        let temp = Object.assign({}, reservetegel); 

        for (let i = 0; i < vm.aantalTegelsPerRij-1; i++) {
            if(i === 0){
                // nieuwe reservetegel
                reservetegel.soort      = tegels[vasteAs][i].soort
                reservetegel.richting   = tegels[vasteAs][i].richting
                reservetegel.opening    = tegels[vasteAs][i].opening
            }
            tegels[vasteAs][i].soort    = tegels[vasteAs][i+1].soort
            tegels[vasteAs][i].richting = tegels[vasteAs][i+1].richting
            tegels[vasteAs][i].opening  = tegels[vasteAs][i+1].opening
        }

        tegels[vasteAs][vm.aantalTegelsPerRij-1].soort    = temp.soort
        tegels[vasteAs][vm.aantalTegelsPerRij-1].richting = temp.richting
        tegels[vasteAs][vm.aantalTegelsPerRij-1].opening  = temp.opening
    
        verplaatsSchatten('x', vasteAs,-1)
        verplaatsSpelers('x', vasteAs,-1)
    }

    
    updateReserveTegel()
    vm.stap = 1
}

// schatten
function schat(x, y, nummer){
    this.x = x
    this.y = y
    this.nummer = nummer

    this.draw = function(){
        push()
        imageMode(CENTER)
        image(schatten[this.nummer], (this.x*tegelbreedte)+(tegelbreedte/2), (this.y*tegelbreedte)+(tegelbreedte/2), tegelbreedte/2, tegelbreedte/2);
        pop()
    }
}
function verdeelSchatten(){
    let tel = 0
    while (tel < schatten.length) {
        randomX = Math.floor(Math.random() * vm.aantalTegelsPerRij);
        randomY = Math.floor(Math.random() * vm.aantalTegelsPerRij);

        if(!tegels[randomX][randomY].schat){
            schattenOpBord.push(new schat(randomX, randomY, tel))
            tegels[randomX][randomY].schat = true

            tel++
        }
    }
}

function verplaatsSchatten(as, getal, richting){
    for (const schat of schattenOpBord) {
        if(as === 'x'){
            if(schat.y === getal){
                schat.x += richting

                if(schat.x < 0){
                    schat.x = vm.aantalTegelsPerRij-1
                }
                if(schat.x > (vm.aantalTegelsPerRij-1)){
                    schat.x = 0
                }
            }
        }
        if(as === 'y'){
            if(schat.x === getal){
                schat.y += richting

                if(schat.y < 0){
                    schat.y = vm.aantalTegelsPerRij-1
                }
                if(schat.y > (vm.aantalTegelsPerRij-1)){
                    schat.y = 0
                }
            }
        }
    }
}

// spelers
function speler(x, y, speler, soort){
    this.x = x
    this.y = y
    this.speler = speler
    this.soort = soort

    this.draw = function(){
        push()
        imageMode(CENTER)
        image(helden[this.soort], (this.x*tegelbreedte)+(tegelbreedte/2), (this.y*tegelbreedte)+(tegelbreedte/2), tegelbreedte/2, tegelbreedte/1.8);
        pop()
    }

    this.move = function(x, y){
        this.x += x
        this.y += y

        for (const [index, schat] of schattenOpBord.entries()) {
            if(schat.x === this.x && schat.y === this.y){
                if((vm.spelers[vm.beurt].schatten[0].id-1) === index){
                    vm.spelers[vm.beurt].schatten.splice(0,1)
                    vm.spelers[vm.beurt].punten++
                    vm.checkVoorWinnaar();
                }
            }
        }
    }
}
function maakSpelers(){
    for (let i = 0; i < vm.aantalSpelers; i++) {
        var character = Number(vm.spelers[i].img.slice(11, 12));

        let randomX = Math.floor(Math.random() * vm.aantalTegelsPerRij);
        let randomY = Math.floor(Math.random() * vm.aantalTegelsPerRij);
        spelers.push(new speler(randomX, randomY, i, character))
    }
}
function bordSize(){
    let size = Number($("#bord").width())

    if(windowHeight < size){
        size = windowHeight-50
    }
    return size
}

function verplaatsSpelers(as, getal, richting){
    for (const speler of spelers) {
        if(as === 'x'){
            if(speler.y === getal){
                speler.x += richting

                if(speler.x < 0){
                    speler.x = vm.aantalTegelsPerRij-1
                }
                if(speler.x > (vm.aantalTegelsPerRij-1)){
                    speler.x = 0
                }
            }
        }
        if(as === 'y'){
            if(speler.x === getal){
                speler.y += richting

                if(speler.y < 0){
                    speler.y = vm.aantalTegelsPerRij-1
                }
                if(speler.y > (vm.aantalTegelsPerRij-1)){
                    speler.y = 0
                }
            }
        }
    }
}