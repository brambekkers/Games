// VAR AANGEVEN

var kleuren = randomkleuren(6);
var vierkanten = document.querySelectorAll(".square");
var gekozenkleur = kieskleur()
var titelkleur = document.querySelector("#titelkleur")
var bericht = document.querySelector("#score")
var titel = document.querySelector("#titel")
var nieuw = document.querySelector("#nieuw")
var resetbutton = document.querySelector("#nieuw")
var makkelijkbutton = document.querySelector("#makkelijk")
var moeilijkbutton = document.querySelector("#moeilijk")
var uitlegbutton = document.querySelector("#uitleg")
var uitlegkader = document.querySelector("#uitlegkader")
var niveaumoeilijk = true;
var hoogstescore = document.querySelector("#hoogstescore")
var hoogstescoreinpunten = 0;

uitlegkader.style.display = "none";


// MAKKELIJK BUTTON
makkelijkbutton.addEventListener("click", function(){
	makkelijkbutton.classList.add("geselecteerd")
	moeilijkbutton.classList.remove("geselecteerd")
	kleuren = randomkleuren(3)
	gekozenkleur = kieskleur()
	titelkleur.textContent = gekozenkleur;
	niveaumoeilijk = false;
	for (var i = 0; i < vierkanten.length; i++) {
		vierkanten[i].style.background = kleuren[i];

	}
	for (var i = 3; i < vierkanten.length; i++) {
		vierkanten[i].style.display = "none";

	}
});


// MOEILIJK BUTTON
moeilijkbutton.addEventListener("click", function(){
	moeilijkbutton.classList.add("geselecteerd")
	makkelijkbutton.classList.remove("geselecteerd")
	kleuren = randomkleuren(6)
	gekozenkleur = kieskleur()
	titelkleur.textContent = gekozenkleur;
	niveaumoeilijk = true;
	for (var i = 0; i < vierkanten.length; i++) {
		vierkanten[i].style.background = kleuren[i];

	}
	for (var i = 3; i < vierkanten.length; i++) {
		vierkanten[i].style.display = "initial";

	} 	
});


// UITLEG BUTTON
uitlegbutton.addEventListener("click", function(){
	uitlegkader.style.display = "initial";
});

// KLIK OP UITLEG KADER
uitlegkader.addEventListener("click", function(){
	uitlegkader.style.display = "none";
});


// VOEG KLEUR TOE AAN VIERKANTEN (eerste keer)

for (var i = 0; i < vierkanten.length; i++) {
	/*VOEG KLEUREN TOE AAN VIERKANTEN*/
	vierkanten[i].style.background = kleuren[i];

	// /*KLIK OP VIERKANTEN*/
	vierkanten[i].addEventListener("click", function(){
		var gekliktekleur = this.style.background;

		if (gekliktekleur === gekozenkleur){
			bericht.textContent = "Goed geraden!";
			titel.style.background = gekozenkleur;
			nieuw.textContent = "Nieuw spel?";
			hoogstescoreinpunten++

			veranderallekleuren()
		}
		else{
			this.style.background="#232323";
			bericht.textContent = "Probeer opnieuw"
			hoogstescoreinpunten = 0;
		}
	hoogstescore.textContent = "Hoogste score: "+ hoogstescoreinpunten	
	});
}

titelkleur.textContent = gekozenkleur;


// RESET BUTTON

resetbutton.addEventListener("click", function(){
bericht.textContent = "";
nieuw.textContent = "Andere kleuren?";

	if (moeilijkbutton) {
		kleuren = randomkleuren(6)
		gekozenkleur = kieskleur()
		titelkleur.textContent = gekozenkleur;
		for (var i = 0; i < vierkanten.length; i++) {
			vierkanten[i].style.background = kleuren[i];

		}	
	}
	else {
		kleuren = randomkleuren(3)
		gekozenkleur = kieskleur()
		titelkleur.textContent = gekozenkleur;
		for (var i = 0; i < vierkanten.length; i++) {
		vierkanten[i].style.background = kleuren[i];
		}
	}
})





// FUNCTIONS

function veranderallekleuren(){
	for (var i = 0; i < vierkanten.length; i++) {
		vierkanten[i].style.background = gekozenkleur;

	}
}

function kieskleur(){
	var random = Math.floor(Math.random() * kleuren.length)
	return kleuren[random]
}

function randomkleuren(num){
	var arr = [];
	for (var i = 0; i < num; i++) {
	arr.push(randomkleurmaker())	
	}
	return arr;
}

function randomkleurmaker(){
	var r = Math.floor(Math.random() * 256)
	var g = Math.floor(Math.random() * 256)
	var b = Math.floor(Math.random() * 256)

	return "rgb(" + r + ", " + g + ", " + b + ")";
}
