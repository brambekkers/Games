let outside
let aantal = 4
let maat
let grid = []
let point
let stack = []
let huidigeScore
let topScore
let huidige
let fr = 50
let start = false
let startpunt
let eindpunt


function setup() {
    // maak canvas
    outside = document.getElementById('canvas').offsetWidth
    let myCanvas = createCanvas(outside, outside);
    myCanvas.parent("canvas");
    background(255);
    frameRate(fr)

    for (let j = 0; j < aantal; j++) {
        for (let i = 0; i < aantal; i++) {
            let cell = new Cell(i,j)
            grid.push(cell);  
        }      
    }
    maat = outside / aantal

    huidige = grid[0]
}

function windowResized() {
    if (aantal >= 5) {
        aantal--
    }
    start = false
    grid = []
    stack = []
    setup()
  }

function draw() {
    huidige.highlight = true
    for (let x = 0; x < grid.length; x++) {
        grid[x].show();
    }

    // maak huidige
    huidige.bezocht = true

    // STAP 1 - selecteer volgende
    let volgende = huidige.bekijkBuren()
    if (volgende) {
        huidige.highlight = false
        volgende.bezocht
    
    // STAP 2
        stack.push(huidige);

    // STAP 3 - Haal muren weg
        verwijderMuren(huidige, volgende);
    
    // STAP 4 - Zet volgende als huidige
        huidige = volgende
    }else if(stack.length > 0){
        huidige.highlight = false
        huidige = stack.pop();
    }else if(stack.length === 0){
        grid[0].highlight = false
        grid[0].show()
        
        //start het spel
        if(!start){
            maakStartEnEind()
            start = true
        }
    }


    if(start){
        point.show()
    }

    checkVoorWin()

}


function index(i, j) {
    if (i < 0 || j < 0 || i > aantal-1 || j > aantal-1) {
      return -1;
    }
    return i + j * aantal;
  }


function verwijderMuren(huidige, volgende){
    var y = huidige.i - volgende.i
    var x = huidige.j - volgende.j

    if(x === 1){
        huidige.borders[0] = false
        volgende.borders[2] = false
    }
    if(x === -1){
        huidige.borders[2] = false
        volgende.borders[0] = false
    }

    if(y === 1){
        huidige.borders[3] = false
        volgende.borders[1] = false
    }
    if(y === -1){
        huidige.borders[1] = false
        volgende.borders[3] = false
    }
}

function maakStartEnEind() {
    // start
    let zijdeBegin = floor(random(0, 2))
    let hokjeBegin = floor(random(0, aantal))
    if (zijdeBegin) {
        grid[hokjeBegin].start = true
        startpunt = hokjeBegin
    }else{                    
        grid[hokjeBegin * aantal].start = true
        startpunt = hokjeBegin * aantal
    }
    // eind
    let zijdeEind = floor(random(0, 2))
    let hokjeEind = floor(random(0, aantal))
    if (zijdeBegin) {
        grid[(grid.length - 1) - hokjeEind].eind = true
        eindpunt = (grid.length - 1) - hokjeEind
    }else{
        if (hokjeEind === 0) {
            grid[aantal-1].eind = true
            eindpunt = aantal-1
            
        }else{                 
        grid[(hokjeEind * aantal)-1].eind = true
        eindpunt = (hokjeEind * aantal)-1
        }
    }
    point = new Point(grid[startpunt].i,grid[startpunt].j)
}

function keyPressed() {
    if (start) {
        if (keyCode === LEFT_ARROW) {
            point.move(0, -1)  
        }else if (keyCode === RIGHT_ARROW) {
            point.move(0, 1)
        }else if (keyCode === UP_ARROW) {
            point.move(-1, 0)
        }else if (keyCode === DOWN_ARROW) {
            point.move(1, 0)
        }
    }
    
}

function checkVoorWin() {
    if(start){
        if(index(point.i, point.j) === eindpunt) {
            start = false
            grid = []
            stack = []
            aantal++

            setup()
        }
    }
}

function nieuwSpel(){
    aantal = 4
    start = false
    grid = []
    stack = []
    setup()
}

function resetSpel(){
    if (aantal >= 5) {
        aantal--
    }
    start = false
    grid = []
    stack = []
    setup()
    
}