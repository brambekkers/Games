
var seconds = 1;
var hoogste_score = 0;
var score = 0;
var antwoord = 0;
var gedrukt = "";
var aan = "" ;
var cancel = setInterval(incrementSeconds, 3000);
var check = setTimeout(kondeze, 2500);
var nummer = document.getElementById('nummer');
var hoogstescore = document.querySelector("#hoogstescore")
var antwoord = document.querySelector("#antwoord")
var aanknop = document.querySelector("#aanknop")
var ping = document.querySelector("#button1")
var pong = document.querySelector("#button2")
var pingpong = document.querySelector("#button3")
var uitleg = document.querySelector("#uitleg")
var pijlen = document.querySelector("#pijlen")



// Aan knop //
aanknop.addEventListener("click", function(){
	seconds = 1;
	aan = true;
	nummer.style.color="#333";
// 	uitleg.style.display = "none";
//	pijlen.style.display = "none";
	antwoord.textContent = "";
});



// Ping knop//
ping.addEventListener("click", function(){
	gedrukt = true;
	if ((seconds / 15) % 1 === 0) {
		verloren()
	}
	else {
		var antwoord = seconds / 3;
		goedfout(antwoord)
	}
});


// Pong knop//
pong.addEventListener("click", function(){
	gedrukt = true;
	if ((seconds / 15) % 1 === 0) {
		verloren()
	}
	else {
		var antwoord = seconds / 5;
		goedfout(antwoord)
	}
	
});


// PingPong knop//
pingpong.addEventListener("click", function(){
	gedrukt = true;
	if ((seconds / 15) % 1 === 0) {
		goedgedaan()
	}
	else{
		verloren()

	}
});



// teller //
function incrementSeconds() {
	if (aan) {
    	seconds += 1;
    	setTimeout(kondeze, 2990)
    	nummer.innerText = seconds ;
    	if (seconds > hoogste_score) {
    		hoogste_score = seconds - 1
    	}
    }
	else {
		nummer.innerText = seconds ;
	}
}


// goed fout//
function goedfout(n){
	if (isInt(n)) {
		goedgedaan()
	}
	else {
		verloren()
	}
}


// Gewonnen //
function goedgedaan(){
	console.log("goed gedaan")
}

// interger check //
function isInt(n) {
   return n % 1 === 0;
}




function kondeze(){
	if ((seconds / 15) % 1 === 0) {
		if(gedrukt){
		gedrukt = false;	
		}
		else{
			verloren();
			antwoord.textContent = "deze kon door 15 worden gedeeld";
		}
	}
	else if ((seconds / 5) % 1 === 0) {
		if(gedrukt){
		gedrukt = false;	
		}
		else{
			verloren();
			antwoord.textContent = "deze kon door 5 worden gedeeld";
		}
	}
	else if ((seconds / 3) % 1 === 0) {
		if(gedrukt){
		gedrukt = false;	
		}
		else{
			verloren();
			antwoord.textContent = "deze kon door 3 worden gedeeld";
		}
	}
	else{
			
	}
}


// Verloren //
function verloren(){
	aan = false;
	console.log("verloren");
	nummer.style.color="#c11d00";
	hoogstescore.textContent = "Hoogste score: "+ hoogste_score	;
	nummer.innerText = "Jammer joh!" ;
	uitleg.style.display = "block";
	pijlen.style.display = "block";
}