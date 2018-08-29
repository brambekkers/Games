var kaart_type = "honden";
var memory_array12 = [
	'./img/'+kaart_type+'/1.jpg', './img/'+kaart_type+'/1.jpg', 
	'./img/'+kaart_type+'/2.jpg', './img/'+kaart_type+'/2.jpg', 
	'./img/'+kaart_type+'/3.jpg', './img/'+kaart_type+'/3.jpg',
	'./img/'+kaart_type+'/4.jpg', './img/'+kaart_type+'/4.jpg',
	'./img/'+kaart_type+'/5.jpg', './img/'+kaart_type+'/5.jpg',
	'./img/'+kaart_type+'/6.jpg', './img/'+kaart_type+'/6.jpg',
];

var memory_array24 = [
	'./img/'+kaart_type+'/1.jpg', './img/'+kaart_type+'/1.jpg', 
	'./img/'+kaart_type+'/2.jpg', './img/'+kaart_type+'/2.jpg', 
	'./img/'+kaart_type+'/3.jpg', './img/'+kaart_type+'/3.jpg',
	'./img/'+kaart_type+'/4.jpg', './img/'+kaart_type+'/4.jpg',
	'./img/'+kaart_type+'/5.jpg', './img/'+kaart_type+'/5.jpg',
	'./img/'+kaart_type+'/6.jpg', './img/'+kaart_type+'/6.jpg',
	'./img/'+kaart_type+'/7.jpg', './img/'+kaart_type+'/7.jpg',
	'./img/'+kaart_type+'/8.jpg', './img/'+kaart_type+'/8.jpg',
	'./img/'+kaart_type+'/9.jpg', './img/'+kaart_type+'/9.jpg',
	'./img/'+kaart_type+'/10.jpg', './img/'+kaart_type+'/10.jpg',
	'./img/'+kaart_type+'/11.jpg', './img/'+kaart_type+'/11.jpg',
	'./img/'+kaart_type+'/12.jpg', './img/'+kaart_type+'/12.jpg',
];

var memory_array36 = [
	'./img/'+kaart_type+'/1.jpg', './img/'+kaart_type+'/1.jpg', 
	'./img/'+kaart_type+'/2.jpg', './img/'+kaart_type+'/2.jpg', 
	'./img/'+kaart_type+'/3.jpg', './img/'+kaart_type+'/3.jpg',
	'./img/'+kaart_type+'/4.jpg', './img/'+kaart_type+'/4.jpg',
	'./img/'+kaart_type+'/5.jpg', './img/'+kaart_type+'/5.jpg',
	'./img/'+kaart_type+'/6.jpg', './img/'+kaart_type+'/6.jpg',
	'./img/'+kaart_type+'/7.jpg', './img/'+kaart_type+'/7.jpg',
	'./img/'+kaart_type+'/8.jpg', './img/'+kaart_type+'/8.jpg',
	'./img/'+kaart_type+'/9.jpg', './img/'+kaart_type+'/9.jpg',
	'./img/'+kaart_type+'/10.jpg', './img/'+kaart_type+'/10.jpg',
	'./img/'+kaart_type+'/11.jpg', './img/'+kaart_type+'/11.jpg',
	'./img/'+kaart_type+'/12.jpg', './img/'+kaart_type+'/12.jpg',
	'./img/'+kaart_type+'/13.jpg', './img/'+kaart_type+'/13.jpg',
	'./img/'+kaart_type+'/14.jpg', './img/'+kaart_type+'/14.jpg',
	'./img/'+kaart_type+'/15.jpg', './img/'+kaart_type+'/15.jpg',
	'./img/'+kaart_type+'/16.jpg', './img/'+kaart_type+'/16.jpg',
	'./img/'+kaart_type+'/17.jpg', './img/'+kaart_type+'/17.jpg',
	'./img/'+kaart_type+'/18.jpg', './img/'+kaart_type+'/18.jpg',
];

var memory_array48 = [
	'./img/'+kaart_type+'/1.jpg', './img/'+kaart_type+'/1.jpg', 
	'./img/'+kaart_type+'/2.jpg', './img/'+kaart_type+'/2.jpg', 
	'./img/'+kaart_type+'/3.jpg', './img/'+kaart_type+'/3.jpg',
	'./img/'+kaart_type+'/4.jpg', './img/'+kaart_type+'/4.jpg',
	'./img/'+kaart_type+'/5.jpg', './img/'+kaart_type+'/5.jpg',
	'./img/'+kaart_type+'/6.jpg', './img/'+kaart_type+'/6.jpg',
	'./img/'+kaart_type+'/7.jpg', './img/'+kaart_type+'/7.jpg',
	'./img/'+kaart_type+'/8.jpg', './img/'+kaart_type+'/8.jpg',
	'./img/'+kaart_type+'/9.jpg', './img/'+kaart_type+'/9.jpg',
	'./img/'+kaart_type+'/10.jpg', './img/'+kaart_type+'/10.jpg',
	'./img/'+kaart_type+'/11.jpg', './img/'+kaart_type+'/11.jpg',
	'./img/'+kaart_type+'/12.jpg', './img/'+kaart_type+'/12.jpg',
	'./img/'+kaart_type+'/13.jpg', './img/'+kaart_type+'/13.jpg',
	'./img/'+kaart_type+'/14.jpg', './img/'+kaart_type+'/14.jpg',
	'./img/'+kaart_type+'/15.jpg', './img/'+kaart_type+'/15.jpg',
	'./img/'+kaart_type+'/16.jpg', './img/'+kaart_type+'/16.jpg',
	'./img/'+kaart_type+'/17.jpg', './img/'+kaart_type+'/17.jpg',
	'./img/'+kaart_type+'/18.jpg', './img/'+kaart_type+'/18.jpg',
	'./img/'+kaart_type+'/19.jpg', './img/'+kaart_type+'/19.jpg',
	'./img/'+kaart_type+'/20.jpg', './img/'+kaart_type+'/20.jpg',
	'./img/'+kaart_type+'/21.jpg', './img/'+kaart_type+'/21.jpg',
	'./img/'+kaart_type+'/22.jpg', './img/'+kaart_type+'/22.jpg', 
	'./img/'+kaart_type+'/23.jpg', './img/'+kaart_type+'/23.jpg',
	'./img/'+kaart_type+'/24.jpg', './img/'+kaart_type+'/24.jpg',
];


var memory_values = [];
var memory_tile_ids = [];
var tiles_flipped = 0;
var nieuwe_instellingen = document.querySelector("#nieuwe_instellingen")
var beurt = 1;
var inputspeler1 = document.getElementById("inputspeler1").value;
var inputspeler2 = document.getElementById("inputspeler2").value;
var naam1 = document.querySelector("#naam1");
var naam2 = document.querySelector("#naam2");
var punten1 = document.querySelector("#score1");
var punten2 = document.querySelector("#score2");
var wieisaandebeurt = document.querySelector("#wieisaandebeurt");
var score1 = 0;
var score2 = 0;
var winnaar = "";
var totalescore = 0;
var speler1 = "speler 1";
var speler2 = "speler 2";


// VOER NAMEN IN
function voernamenin() {
    speler1 = document.getElementById("inputspeler1").value;
    document.getElementById("naam1").innerHTML = speler1 + ': ';
    speler2 = document.getElementById("inputspeler2").value;
    document.getElementById("naam2").innerHTML = speler2 + ': ';    	
}

// SCHUDDEN
Array.prototype.memory_tile_shuffle = function () {
	var i = this.length, j, temp;
	while(--i > 0){
		j = Math.floor(Math.random() * (i+1));
		temp = this[j];
		this[j] = this[i];
		this[i] = temp;
	}
}

// BUTTONS IN-GAME
$('#nieuw_spel').on('click', function() {
  nieuwspel()
})
$('#nieuwe_instellingen').on('click', function() {
	$('.block').removeClass('is-active');
  	$('.block-01').addClass('is-active');
  // $('.block-01').addClass('animate-out');
  	$('.pagenation').removeClass('is-active');
  	$('.page-01').addClass('is-active');
    
    $(".container-fluid").fadeOut(1000).promise().done(function(){
    $(".main_gegevens").fadeIn(1500);
  });
})

// EINDE BUTTON IN-GAME






// NIEUW SPEL
function nieuwspel(){
	tiles_flipped = 0;
	var output = '';
 //    memory_array.memory_tile_shuffle();
	// for(var i = 0; i < memory_array; i++){
		if (speltype == 12) {
			memory_array12.memory_tile_shuffle();
			for(var i = 0; i < speltype; i++){
				output += '<div id="tile_'+i+'" class="col-sm-5 col-md-4 col-lg-2 square" style="max-width: 19% !important;" onclick="memoryFlipTile(this,\''+memory_array12[i]+'\')"></div>';
			}
		}
		if (speltype == 24) {
			memory_array24.memory_tile_shuffle();
			for(var i = 0; i < speltype; i++){
			output += '<div id="tile_'+i+'" class="col-sm-4 col-md-2 col-lg-2 square" style="max-width: 14% !important;" onclick="memoryFlipTile(this,\''+memory_array24[i]+'\')"></div>';
			}
		}
		if (speltype == 36) {
			memory_array36.memory_tile_shuffle();
			for(var i = 0; i < speltype; i++){
			output += '<div id="tile_'+i+'" class="col-sm-4 col-md-2 col-lg-1 square" style="max-width: 9% !important;" onclick="memoryFlipTile(this,\''+memory_array36[i]+'\')"></div>';
			}
		}
		if (speltype == 48) {
			memory_array48.memory_tile_shuffle();
			for(var i = 0; i < speltype; i++){
			output += '<div id="tile_'+i+'" class="col-sm-4 col-md-2 col-lg-1 square" style="max-width: 10% !important;" onclick="memoryFlipTile(this,\''+memory_array48[i]+'\')"></div>';
			}
		}
	document.getElementById('memory_board').innerHTML = output;

	score1 = 0
	score2 = 0
	punten1.textContent = score1;
	punten2.textContent = score2;
}

// VERANDERSPELER
function veranderSpeler(){
	if (beurt === 1) {
		beurt = 2
		wieisaandebeurt.textContent = speler2;
	}
	else {
		beurt = 1
		wieisaandebeurt.textContent = speler1;
	}
}

// KLIK FUNCTIE
function memoryFlipTile(tile,val){
	if(tile.innerHTML == "" && memory_values.length < 2){
		tile.style.background = 'url(' + val + ')';
		tile.style.backgroundSize = "100% 100%"
		if(memory_values.length == 0){
			memory_values.push(val);
			memory_tile_ids.push(tile.id);
		} else if(memory_values.length == 1){
			memory_values.push(val);
			memory_tile_ids.push(tile.id);
			if(memory_values[0] == memory_values[1]){
				tiles_flipped += 2;
				// Clear both arrays
				memory_values = [];
            	memory_tile_ids = [];
            	if (beurt == 1) {
            		score1++
            		totalescore++
            		punten1.textContent = score1;
            	}
            	else{
            		score2++
            		totalescore++
            		punten2.textContent = score2;
            	}
				// Check to see if the whole board is cleared
				if((totalescore*2) == speltype){
					if(score1<score2){
						winnaar = speler2
					}
					else{
						winnaar = speler1
					}
					document.getElementById('memory_board').innerHTML = "";
					document.getElementById('memory_board').innerHTML = '<span id="finale"><h3>De winnaar is</h3><br><br><h1>'+ winnaar +'</h1></span>'
				}
			} else {
				function flip2Back(){
				    // Flip the 2 tiles back over
				    var tile_1 = document.getElementById(memory_tile_ids[0]);
				    var tile_2 = document.getElementById(memory_tile_ids[1]);
				    tile_1.style.background = 'url(./img/tile_bg.jpg) no-repeat';
				    tile_1.style.backgroundSize = "100% 100%"
            	    tile_1.innerHTML = "";
				    tile_2.style.background = 'url(./img/tile_bg.jpg) no-repeat';
				    tile_2.style.backgroundSize = "100% 100%"
            	    tile_2.innerHTML = "";
				    // Clear both arrays
				    memory_values = [];
            	    memory_tile_ids = [];
            	    veranderSpeler()
				}
				setTimeout(flip2Back, 1500);
			}
		}
	}
}

function kaarttypeuitzetten(){
memory_array12 = [
	'./img/'+kaart_type+'/1.jpg', './img/'+kaart_type+'/1.jpg', 
	'./img/'+kaart_type+'/2.jpg', './img/'+kaart_type+'/2.jpg', 
	'./img/'+kaart_type+'/3.jpg', './img/'+kaart_type+'/3.jpg',
	'./img/'+kaart_type+'/4.jpg', './img/'+kaart_type+'/4.jpg',
	'./img/'+kaart_type+'/5.jpg', './img/'+kaart_type+'/5.jpg',
	'./img/'+kaart_type+'/6.jpg', './img/'+kaart_type+'/6.jpg',
];

memory_array24 = [
	'./img/'+kaart_type+'/1.jpg', './img/'+kaart_type+'/1.jpg', 
	'./img/'+kaart_type+'/2.jpg', './img/'+kaart_type+'/2.jpg', 
	'./img/'+kaart_type+'/3.jpg', './img/'+kaart_type+'/3.jpg',
	'./img/'+kaart_type+'/4.jpg', './img/'+kaart_type+'/4.jpg',
	'./img/'+kaart_type+'/5.jpg', './img/'+kaart_type+'/5.jpg',
	'./img/'+kaart_type+'/6.jpg', './img/'+kaart_type+'/6.jpg',
	'./img/'+kaart_type+'/7.jpg', './img/'+kaart_type+'/7.jpg',
	'./img/'+kaart_type+'/8.jpg', './img/'+kaart_type+'/8.jpg',
	'./img/'+kaart_type+'/9.jpg', './img/'+kaart_type+'/9.jpg',
	'./img/'+kaart_type+'/10.jpg', './img/'+kaart_type+'/10.jpg',
	'./img/'+kaart_type+'/11.jpg', './img/'+kaart_type+'/11.jpg',
	'./img/'+kaart_type+'/12.jpg', './img/'+kaart_type+'/12.jpg',
];

memory_array36 = [
	'./img/'+kaart_type+'/1.jpg', './img/'+kaart_type+'/1.jpg', 
	'./img/'+kaart_type+'/2.jpg', './img/'+kaart_type+'/2.jpg', 
	'./img/'+kaart_type+'/3.jpg', './img/'+kaart_type+'/3.jpg',
	'./img/'+kaart_type+'/4.jpg', './img/'+kaart_type+'/4.jpg',
	'./img/'+kaart_type+'/5.jpg', './img/'+kaart_type+'/5.jpg',
	'./img/'+kaart_type+'/6.jpg', './img/'+kaart_type+'/6.jpg',
	'./img/'+kaart_type+'/7.jpg', './img/'+kaart_type+'/7.jpg',
	'./img/'+kaart_type+'/8.jpg', './img/'+kaart_type+'/8.jpg',
	'./img/'+kaart_type+'/9.jpg', './img/'+kaart_type+'/9.jpg',
	'./img/'+kaart_type+'/10.jpg', './img/'+kaart_type+'/10.jpg',
	'./img/'+kaart_type+'/11.jpg', './img/'+kaart_type+'/11.jpg',
	'./img/'+kaart_type+'/12.jpg', './img/'+kaart_type+'/12.jpg',
	'./img/'+kaart_type+'/13.jpg', './img/'+kaart_type+'/13.jpg',
	'./img/'+kaart_type+'/14.jpg', './img/'+kaart_type+'/14.jpg',
	'./img/'+kaart_type+'/15.jpg', './img/'+kaart_type+'/15.jpg',
	'./img/'+kaart_type+'/16.jpg', './img/'+kaart_type+'/16.jpg',
	'./img/'+kaart_type+'/17.jpg', './img/'+kaart_type+'/17.jpg',
	'./img/'+kaart_type+'/18.jpg', './img/'+kaart_type+'/18.jpg',
];

memory_array48 = [
	'./img/'+kaart_type+'/1.jpg', './img/'+kaart_type+'/1.jpg', 
	'./img/'+kaart_type+'/2.jpg', './img/'+kaart_type+'/2.jpg', 
	'./img/'+kaart_type+'/3.jpg', './img/'+kaart_type+'/3.jpg',
	'./img/'+kaart_type+'/4.jpg', './img/'+kaart_type+'/4.jpg',
	'./img/'+kaart_type+'/5.jpg', './img/'+kaart_type+'/5.jpg',
	'./img/'+kaart_type+'/6.jpg', './img/'+kaart_type+'/6.jpg',
	'./img/'+kaart_type+'/7.jpg', './img/'+kaart_type+'/7.jpg',
	'./img/'+kaart_type+'/8.jpg', './img/'+kaart_type+'/8.jpg',
	'./img/'+kaart_type+'/9.jpg', './img/'+kaart_type+'/9.jpg',
	'./img/'+kaart_type+'/10.jpg', './img/'+kaart_type+'/10.jpg',
	'./img/'+kaart_type+'/11.jpg', './img/'+kaart_type+'/11.jpg',
	'./img/'+kaart_type+'/12.jpg', './img/'+kaart_type+'/12.jpg',
	'./img/'+kaart_type+'/13.jpg', './img/'+kaart_type+'/13.jpg',
	'./img/'+kaart_type+'/14.jpg', './img/'+kaart_type+'/14.jpg',
	'./img/'+kaart_type+'/15.jpg', './img/'+kaart_type+'/15.jpg',
	'./img/'+kaart_type+'/16.jpg', './img/'+kaart_type+'/16.jpg',
	'./img/'+kaart_type+'/17.jpg', './img/'+kaart_type+'/17.jpg',
	'./img/'+kaart_type+'/18.jpg', './img/'+kaart_type+'/18.jpg',
	'./img/'+kaart_type+'/19.jpg', './img/'+kaart_type+'/19.jpg',
	'./img/'+kaart_type+'/20.jpg', './img/'+kaart_type+'/20.jpg',
	'./img/'+kaart_type+'/21.jpg', './img/'+kaart_type+'/21.jpg',
	'./img/'+kaart_type+'/22.jpg', './img/'+kaart_type+'/22.jpg', 
	'./img/'+kaart_type+'/23.jpg', './img/'+kaart_type+'/23.jpg',
	'./img/'+kaart_type+'/24.jpg', './img/'+kaart_type+'/24.jpg',
];
};



// function checkvoorwinnaar(){
// 	if 
// }



// function finale(){
// winaar = bram
// output = '<div id="finale"><h3>De winnaar is</h3><h1>'+ winnaar +'</h1></div>'
// document.getElementById('memory_board').innerHTML = output;
// }