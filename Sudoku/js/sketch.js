let bodyB =  window.innerWidth/100*60;
let bodyH =  window.innerHeight/100*60;
let vakje = 0
let fr = 15
let sudoku
let gekozenNummer = 0
let gekozenVakje = {x: null, y: null}
let lvl = "easy"

let sudokuArray = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
]

function preload() {
    maakUniekBord()
    while (sudoku.includes(0)) {
        maakUniekBord()
    }
}

function setup() {
    maakCanvas();
    maakRaster();
    frameRate(fr)


    voegSudokuToeAanArray()
    stelLvlIn()
}

function mouseClicked() {
    let clickX = Math.floor(mouseX/vakje)
    let clickY = Math.floor(mouseY/vakje)
    
    // zet gekozen vakje
    if (clickX >= 0 && clickX < 9) {
        if (clickY >= 0 && clickY < 9) {
            gekozenVakje = {x: clickX, y:clickY}
            gekozenNummer = sudokuArray[clickY][clickX]
        }  
    }

    // zet gekozen nummer 
    if (clickY >= 10 && clickY < 11) {
        if (clickX >= 0 && clickX < 9) {
           gekozenNummer = clickX+1

           if (gekozenVakje.x || gekozenVakje.x === 0) {
               sudokuArray[gekozenVakje.y][gekozenVakje.x] = gekozenNummer
           }
        }  
    }

    // zet niveau 
    if (clickX >= 10 && clickX < 12) {
        if (clickY === 1 ) {
            lvl = "easy"
        }
        else if (clickY === 3 ) {
            lvl = "medium"
        } 
        else if (clickY === 5 ) {
            lvl = "hard"
        } 
        else if (clickY === 7 ) {
            lvl = "extreme"
        }


        if (clickY === 1 || clickY === 3 || clickY === 5  || clickY === 7) {
            vex.dialog.confirm({
                message: "Wil je een nieuw spel op '"+ lvl +"' starten?",
                callback: function (value) {
                    if (value) {
                        preload()
                        setup()
                        gekozenNummer = 0
                        gekozenVakje = {x: null, y: null}
                    }                 
                }
            })
        }
           
    }
}

function maakCanvas() {
    if (bodyB < bodyH) {
        vakje = bodyB / 9
    } else {
        vakje = bodyH / 9
    }
    createCanvas((vakje*12)+20, (vakje*12)+20);
}

function maakAchtergrond(){
    fill('rgb(255,255,255)');
    // maak dikke rij rondom
    strokeWeight(5)
    rect(0+10, 0+10, (vakje*9), (vakje*9));

    // onder
    fill('rgb(82,85,100)');
    rect(0+10, (vakje*10)+10, (vakje*9), vakje);
}

function maakRaster() {
    fill('rgba(255,255,255,0)');
    // maak dikke rij rondom
    strokeWeight(5)
    rect(0+10, 0+10, (vakje*9), (vakje*9));

    // onder
    fill('rgba(82,85,100,0)');
    rect(0+10, (vakje*10)+10, (vakje*9), vakje);
    strokeWeight(3)
    // niveaus
    textSize(32);
    textAlign(CENTER,CENTER);
    fill('rgb(85,173,122)');
    rect((vakje*10)+10, (vakje*1)+10, (vakje*2), (vakje*1));
    fill(255, 255, 255);
    text("Easy", (vakje*11)+10, (vakje*1.5)+10);
    fill('rgb(253,182,50)');
    rect((vakje*10)+10, (vakje*3)+10, (vakje*2), (vakje*1));
    fill(255, 255, 255);
    text("Medium", (vakje*11)+10, (vakje*3.5)+10);
    fill('rgb(243,115,56)');
    rect((vakje*10)+10, (vakje*5)+10, (vakje*2), (vakje*1));
    fill(255, 255, 255);
    text("Hard", (vakje*11)+10, (vakje*5.5)+10);
    fill('rgb(194,35,38)');
    rect((vakje*10)+10, (vakje*7)+10, (vakje*2), (vakje*1));
    fill(255, 255, 255);
    text("Extreme", (vakje*11)+10, (vakje*7.5)+10);



    // maak drie dikke vakken rij rondom
    let vakbreedte = vakje*3

    for (let y = 0; y < 2; y++) {
        strokeWeight(3)
        line(0+10, vakbreedte+10, (vakje*9)+10, vakbreedte+10);
        line(vakbreedte+10, 0+10, vakbreedte+10, (vakje*9)+10);
        vakbreedte += vakje*3   
    }
        

    // maak raster 9x9
    let hoogte = 0
    strokeWeight(1)
    sudokuArray.forEach(rij => {
        //raster 9x9
        line(0+10, hoogte+10, (vakje*9)+10, hoogte+10);
        line(hoogte+10, 0+10, hoogte+10, (vakje*9)+10);

        // raster onder
        line(hoogte+10, (vakje*10)+10, hoogte+10, (vakje*11)+10);
        hoogte += vakje
    });
    
    
}


function draw() {
    maakAchtergrond()
    gekozenVakjes()
    maakRaster()
    vulCijfersIn()
}

function vulCijfersIn() {
    let Rij = 1
    let Kolom = 1

    sudokuArray.forEach(rij => {
        let rijAfstand = Rij * vakje - (vakje/2)
        rij.forEach(nummer => {
            let kolomAfstand = Kolom * vakje - (vakje/2)
            if(nummer !== 0){
                textSize(32);
                textAlign(CENTER,CENTER);
                fill(47, 45, 46);
                text(nummer, kolomAfstand+10, rijAfstand+10);
            }
            Kolom++
        })
        Rij++
        Kolom = 1
    });   

    let cijfer = 1
    let afstand = vakje/2
    for (let i = 0; i < 9; i++) {
        fill(255, 255, 255);
        text(cijfer, afstand+10, (vakje*10)+(vakje/2)+10);    
        afstand += vakje
        cijfer++
    }
}

function maakUniekBord() { 
    maakBordLeeg()
    sudoku = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

    
    // ... and we solve it!!
    solve(sudoku);
    
    // given a sudoku cell, returns the row
    function returnRow(cell) {
        return Math.floor(cell / 9);
    }
    
    // given a sudoku cell, returns the column
    function returnCol(cell) {
        return cell % 9;
    }
    
    // given a sudoku cell, returns the 3x3 block
    function returnBlock(cell) {
        return Math.floor(returnRow(cell) / 3) * 3 + Math.floor(returnCol(cell) / 3);
    }
    
    // given a number, a row and a sudoku, returns true if the number can be placed in the row
    function isPossibleRow(number,row,sudoku) {
        for (var i=0; i<=8; i++) {
            if (sudoku[row*9+i] == number) {
                return false;
            }
        }
        return true;
    }
    
    // given a number, a column and a sudoku, returns true if the number can be placed in the column
    function isPossibleCol(number,col,sudoku) {
        for (var i=0; i<=8; i++) {
            if (sudoku[col+9*i] == number) {
                return false;
            }
        }
        return true;
    }
    
    // given a number, a 3x3 block and a sudoku, returns true if the number can be placed in the block
    function isPossibleBlock(number,block,sudoku) {
        for (var i=0; i<=8; i++) {
            if (sudoku[Math.floor(block/3)*27+i%3+9*Math.floor(i/3)+3*(block%3)] == number) {
                return false;
            }
        }
        return true;
    }
    
    // given a cell, a number and a sudoku, returns true if the number can be placed in the cell
    function isPossibleNumber(cell,number,sudoku) {
        var row = returnRow(cell);
        var col = returnCol(cell);
        var block = returnBlock(cell);
        return isPossibleRow(number,row,sudoku) && isPossibleCol(number,col,sudoku) && isPossibleBlock(number,block,sudoku);
    }
    
    // given a row and a sudoku, returns true if it's a legal row
    function isCorrectRow(row,sudoku) {
        var rightSequence = new Array(1,2,3,4,5,6,7,8,9);
        var rowTemp= new Array();
        for (var i=0; i<=8; i++) {
            rowTemp[i] = sudoku[row*9+i];
        }
        rowTemp.sort();
        return rowTemp.join() == rightSequence.join();
    }
    
    // given a column and a sudoku, returns true if it's a legal column
    function isCorrectCol(col,sudoku) {
        var rightSequence = new Array(1,2,3,4,5,6,7,8,9);
        var colTemp= new Array();
        for (var i=0; i<=8; i++) {
            colTemp[i] = sudoku[col+i*9];
        }
        colTemp.sort();
        return colTemp.join() == rightSequence.join();
    }
    
    // given a 3x3 block and a sudoku, returns true if it's a legal block 
    function isCorrectBlock(block,sudoku) {
        var rightSequence = new Array(1,2,3,4,5,6,7,8,9);
        var blockTemp= new Array();
        for (var i=0; i<=8; i++) {
            blockTemp[i] = sudoku[Math.floor(block/3)*27+i%3+9*Math.floor(i/3)+3*(block%3)];
        }
        blockTemp.sort();
        return blockTemp.join() == rightSequence.join();
    }
    
    // given a sudoku, returns true if the sudoku is solved
    function isSolvedSudoku(sudoku) {
        for (var i=0; i<=8; i++) {
            if (!isCorrectBlock(i,sudoku) || !isCorrectRow(i,sudoku) || !isCorrectCol(i,sudoku)) {
                return false;
            }
        }
        return true;
    }
    
    // given a cell and a sudoku, returns an array with all possible values we can write in the cell
    function determinePossibleValues(cell,sudoku) {
        var possible = new Array();
        for (var i=1; i<=9; i++) {
            if (isPossibleNumber(cell,i,sudoku)) {
                possible.unshift(i);
            }
        }
        return possible;
    }
    
    // given an array of possible values assignable to a cell, returns a random value picked from the array
    function determineRandomPossibleValue(possible,cell) {
        var randomPicked = Math.floor(Math.random() * possible[cell].length);
        return possible[cell][randomPicked];
    }
    
    // given a sudoku, returns a two dimension array with all possible values 
    function scanSudokuForUnique(sudoku) {
        var possible = new Array();
        for (var i=0; i<=80; i++) {
            if (sudoku[i] == 0) {
                possible[i] = new Array();
                possible[i] = determinePossibleValues(i,sudoku);
                if (possible[i].length==0) {
                    return false;
                }
            }
        }
        return possible;
    }
    
    // given an array and a number, removes the number from the array
    function removeAttempt(attemptArray,number) {
        var newArray = new Array();
        for (var i=0; i<attemptArray.length; i++) {
            if (attemptArray[i] != number) {
                newArray.unshift(attemptArray[i]);
            }
        }
        return newArray;
    }
    
    // given a two dimension array of possible values, returns the index of a cell where there are the less possible numbers to choose from
    function nextRandom(possible) {
        var max = 9;
        var minChoices = 0;
        for (var i=0; i<=80; i++) {
            if (possible[i]!=undefined) {
                if ((possible[i].length<=max) && (possible[i].length>0)) {
                    max = possible[i].length;
                    minChoices = i;
                }
            }
        }
        return minChoices;
    }
    
    // given a sudoku, solves it
    function solve(sudoku) {
        var saved = new Array();
        var savedSudoku = new Array();
        var i=0;
        var nextMove;
        var whatToTry;
        var attempt;
        while (!isSolvedSudoku(sudoku)) {
            i++;
            nextMove = scanSudokuForUnique(sudoku);
            if (nextMove == false) {
                nextMove = saved.pop();
                sudoku = savedSudoku.pop();
            }
            whatToTry = nextRandom(nextMove);
            attempt = determineRandomPossibleValue(nextMove,whatToTry);
            if (nextMove[whatToTry].length>1) {
                nextMove[whatToTry] = removeAttempt(nextMove[whatToTry],attempt);
                saved.push(nextMove.slice());
                savedSudoku.push(sudoku.slice());
            }
            sudoku[whatToTry] = attempt;
        }
    }
}

function stelLvlIn() {
    let niveau
    if(lvl === "easy"){
        niveau = new Array(45).fill(0);
    }
    else if(lvl === "medium"){
        niveau = new Array(54).fill(0);
    }
    else if(lvl === "hard"){
        niveau = new Array(63).fill(0);
    }
    else if(lvl === "extreme"){
        niveau = new Array(72).fill(0);
    }

    let loop = true
    do{
        let randomNummerX = Math.floor(Math.random() * 9);
        let randomNummerY = Math.floor(Math.random() * 9);
        if (sudokuArray[randomNummerX][randomNummerY] > 0) {
            
            sudokuArray[randomNummerX][randomNummerY] = 0
            niveau.pop()
            if(niveau.length < 1){
                loop = false
            }
        }
    } while (loop) 
}

function gekozenVakjes(){
    strokeWeight(1)
    // nummer
    if (gekozenNummer !== 0) {
        fill('rgb(50,53,64)');
        rect((vakje*(gekozenNummer-1))+10, (vakje*10)+12.5, vakje, vakje-5);
    }

    // veld
    if (gekozenVakje.x || gekozenVakje.x === 0) {
        fill('#cccccc');
        rect((vakje*gekozenVakje.x)+10, (vakje*gekozenVakje.y)+10, vakje, vakje);
    }

    // niveau
}

function voegSudokuToeAanArray(){
    sudokuArray = [];
    
    for (let i = 0; i < 9; i++) {
        sudokuArray.push(sudoku.splice(0,9))
    }
}


function maakBordLeeg(){
    sudokuArray.forEach(rij => {
        rij.fill(0);
    }); 
}


