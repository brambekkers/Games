var spel_rij = 13;
var spel_kol = 13;
var aantalSpelers = 4;
var totaalAantalKolom = 1;
var actieveSpeler = 0;
var verplaatsTijd = 300;
var data = {};
var ClickKolomNummer;
var serie = [];
var straatinfo = {};
var straatinfoTotaal = {
	aantal: 0
};
var kleurspeler1 = "#f8d7da";
var kleurspeler2 = "#d4edda";
var kleurspeler3 = "#cce5ff";
var kleurspeler4 = "#fff3cd";
var geselecteerdekaart = null;
var geselecteerdekaartkant = 0;

// geluiden
var audioDiceRoll = "sounds/diceRoll.mp3"
var audioClick = "sounds/click.mp3"
var audioBord = "sounds/bord.mp3";
var audioVictory = "sounds/victory.mp3";



$(document).ready(function () {

	/////////////////////////////////////
	///////  Eerste keer starten  ///////
	/////////////////////////////////////

	console.log("Laat het spel beginnen!");
	PasBordAan()
	vulBord()
	verbergOnderdelen()
	maakSpelers()
	volgendeSpeler()
	updateGeld()
	rangeSlider();

	///////////////////////////////////////
	//////  Click, Change, functies  //////
	///////////////////////////////////////

	// Spelkaarten click
	$("#spelerskaarten").on('click', '.spelerskaarten_img', function () {
		new Audio(audioClick).play();
		clickKaartURL = $(this).attr("src")

		bootbox.alert({
			message: '<img src="' + clickKaartURL + '" style="width: 100%">',
			size: 'small',
			backdrop: true
		});
		$(".modal-footer").hide()
	});

	// RUilknop
	$("#ruilennaam_2").change(function () {
		$('#vastgoedRuilenKnop').prop('disabled', false);
	});

	// aankoop huizen clicker
	$(".spelkolom").click(function (event) {
		$('#huizenDoorvoeren').prop('disabled', true);
		ClickKolomNummer = kolomNaarNummer(event.target.id)

		// RUIL INFORMATIE
		if (handel[ClickKolomNummer].beschikbaar) {
			if (geselecteerdekaartkant == 1) {
				if (actieveSpeler == handel[ClickKolomNummer].eigenaar) {
					$(geselecteerdekaart).attr('src', 'img/' + ClickKolomNummer + '.png');
					$(geselecteerdekaart).removeClass("achtergrondRuilen");
					$("#ruilenbericht").html("Voeg nu een andere kaart toe van de tegenstander of maak de deal rond!");
				} else {
					$("#ruilenbericht").html("Je kunt alleen kaarten van jezelf toevoegen om te ruilen.");
				}
			} else if (geselecteerdekaartkant == 2) {
				if (handel[ClickKolomNummer].eigenaar == null) {
					$("#ruilenbericht").html("Deze kaart is niet in het bezit van iemand. Klik op een kaart die je tegenstander in bezit heeft.");
				} else if (handel[ClickKolomNummer].eigenaar == actieveSpeler) {
					$("#ruilenbericht").html("Je kunt niet met jezelf ruilen. Kies een andere kaart.");
				} else {
					$(geselecteerdekaart).attr('src', 'img/' + ClickKolomNummer + '.png');

					$("#ruilennaam_2 > option").each(function () {
						$(this).removeProp("selected", false)

						if (handel[ClickKolomNummer].eigenaar == $(this).val()) {
							$(this).prop("selected", true)
							$('#vastgoedRuilenKnop').prop('disabled', false);
						}
					});

					$(geselecteerdekaart).removeClass("achtergrondRuilen");
					$("#ruilenbericht").html("Voeg nog iets toe of maak de deal rond!");
				}
			}
		}
		// EINDE RUIL INFORMATIE


		// HUIZEN kopen HANDELING
		straatinfo = {}
		Object.keys(handel).forEach(function (key) {
			if (handel[key].serieNR == handel[ClickKolomNummer].serieNR) {
				serie.push(key)
				straatinfo[key] = {
					huizen: handel[key].huizen,
					prijs: Math.abs(handel[key].huis),
				}
			}
		});

		if (actieveSpeler == handel[ClickKolomNummer].eigenaar) {
			var heleStraatinbeheer = isHeleStraatvanZelfdeEigenaar(ClickKolomNummer)
			if (heleStraatinbeheer && handel[ClickKolomNummer].huis < 0) {
				var straatophypotheek = staanErNogStratenOpHypotheek(handel[ClickKolomNummer].serieNR)

				if (straatophypotheek) {
					$('#huizenKopenInfo').html("<h5> Vastgoed </h5> Je hebt <strong>" + handel[ClickKolomNummer].naam + "</strong> in beheer. Er staat echter in deze straat nog iets op hypotheek. Los je schuld in om te kunnen bouwen.")
					$('#huizenDoorvoeren').prop('disabled', true);
				} else {
					$("#huizenKopenSlider").show()
					var prijs = Math.abs(handel[ClickKolomNummer].huis)
					$('#huizenKopenInfo').html("<h5> Vastgoed </h5> De huizen voor <strong>" + handel[ClickKolomNummer].naam + "</strong> kosten  <strong>&euro;" + prijs + "</strong> per stuk.")
					$('#huizenDoorvoeren').prop('disabled', false);
					$(".range-slider__range").val(handel[ClickKolomNummer].huizen);
					$(".range-slider__value").html(handel[ClickKolomNummer].huizen);
				}


			} else if (ClickKolomNummer == 6 || ClickKolomNummer == 16 || ClickKolomNummer == 26 || ClickKolomNummer == 36 || ClickKolomNummer == 13 || ClickKolomNummer == 29) {
				$('#huizenKopenInfo').html("<h5> Vastgoed </h5> Je hebt <strong>" + handel[ClickKolomNummer].naam + "</strong> in beheer. Je echter geen huizen op deze plek bouwen.")
				$('#huizenDoorvoeren').prop('disabled', true);
			} else {
				$('#huizenKopenInfo').html("<h5> Vastgoed </h5> Je hebt <strong>" + handel[ClickKolomNummer].naam + "</strong> in beheer. Je kunt echter pas huizen kopen als je de gehele wijk in bezit hebt.")
				$('#huizenDoorvoeren').prop('disabled', true);
			}

			if (handel[ClickKolomNummer].hypotheek == false) {
				var huizenopstraat = staanErNogHuizenOpStraat(handel[ClickKolomNummer].serieNR)

				if (huizenopstraat) {
					$('#hypotheekInfo').html("<h5> Hypotheek </h5> <strong>" + handel[ClickKolomNummer].naam + "</strong> is van jou. Er staan echter nog wat huizen op deze plek of in de straat. Verkoop deze eerst voordat je deze op hypotheek kan leggen.")
				} else {
					$('#hypotheekInfo').html("<h5> Hypotheek </h5> <strong>" + handel[ClickKolomNummer].naam + "</strong> is van jou. Je krijgt <strong>&euro;" + handel[ClickKolomNummer].hypotheekprijs + " </strong> als je deze op hypotheek zet. Klik op 'aanpassen' om je hypotheek te beheren.")
					$('#hypotheekDoorvoeren').prop('disabled', false);
				}
			} else {
				$('#hypotheekInfo').html("<h5> Hypotheek </h5> <strong>" + handel[ClickKolomNummer].naam + "</strong> is van jou. Je moet <strong>&euro;" + Math.abs(handel[ClickKolomNummer].hypotheekprijs * 1.10) + " </strong> betalen om deze van hypotheek af te krijgen. Klik op 'aanpassen' om je hypotheek te beheren.")
				$('#hypotheekDoorvoeren').prop('disabled', false);
			}

		} else {
			$('#huizenKopenInfo').html("<h5> Vastgoed </h5> Je hebt <strong>" + handel[ClickKolomNummer].naam + "</strong> niet in beheer. Klik op je eigen vastgoed om huizen en hotels toe te voegen.")
			$('#hypotheekInfo').html("<h5> Hypotheek </h5> Je hebt <strong>" + handel[ClickKolomNummer].naam + "</strong> niet in beheer. Klik op je eigen vastgoed om je hypotheek te beheren.")
			$('#hypotheekDoorvoeren').prop('disabled', true);
			$('#huizenDoorvoeren').prop('disabled', true);
		}
	});

	$(".range-slider__range").change(function (event) {
		straatinfoTotaal = {
			aantal: 0
		}
		var aantalhuizenkopen = this.value
		straatinfo[ClickKolomNummer].huizen = aantalhuizenkopen
		checkoferevenveelstratenzijn = function () {
			for (var i = 0; i < 4; i++) {
				Object.keys(straatinfo).forEach(function (key) {
					if ((straatinfo[ClickKolomNummer].huizen - straatinfo[key].huizen) > 1) {
						straatinfo[key].huizen++
					} else if ((straatinfo[ClickKolomNummer].huizen - straatinfo[key].huizen) < -1) {
						straatinfo[key].huizen--
					} else {
						return true
					}
				});
			}
		}

		var Kostenoverzicht = "<h5> Overzicht kosten: </h5>"
		checkoferevenveelstratenzijn()

		Object.keys(straatinfo).forEach(function (key) {
			straatinfo[key].huizen -= handel[key].huizen
		});

		Object.keys(straatinfo).forEach(function (key) {
			straatinfoTotaal["aantal"] += Number(straatinfo[key].huizen)
			Kostenoverzicht += "<p class='text-left huizenkopenDetails'><strong> " + handel[key].naam + ":</strong> <br>Aantal huizen: " + straatinfo[key].huizen + "<br>Kosten:" + (straatinfo[key].huizen * straatinfo[key].prijs) + "<br></p>"
		});

		Kostenoverzicht += "<p class='huizenkopenDetails'><strong> Totaal:" + (straatinfoTotaal.aantal * straatinfo[ClickKolomNummer].prijs) + " euro</strong></p>"
		$('#huizenKopenInfo').html(Kostenoverzicht)
	});


});



////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////  VOORBEREIDING    //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

$(window).resize(function () {
	PasBordAan()
});

PasBordAan = function () {
	var breedteWindow = $(window).width()
	var hoogteWindow = $(window).height()
	var breedteZijbar = 400
	var hoogteZijbar = hoogteWindow - 40


	// Grootte van het speelveld
	if (breedteWindow - 470 > hoogteWindow - 40) {
		var breedteSpeelbord = hoogteWindow - 40
		$("#speelbord").width(breedteSpeelbord)
		$("#speelbord").height(breedteSpeelbord)

		var breedteZijbar = breedteWindow - hoogteWindow - 40

		$("#zijbar").width(breedteZijbar)
		$("#zijbar").height(hoogteZijbar)
		$("#divGooien").width(breedteZijbar)

	} else {
		var breedteSpeelbord = breedteWindow - 470
		$("#speelbord").width(breedteSpeelbord)
		$("#speelbord").height(breedteSpeelbord)

		$("#zijbar").width(breedteZijbar)
		$("#zijbar").height(hoogteZijbar)
		$("#divGooien").width(breedteWindow - hoogteWindow)
	}
}



vulBord = function () {
	for (var rijnummer = 1; rijnummer <= spel_rij; rijnummer++) {

		for (var kolomnummer = 1; kolomnummer <= spel_kol; kolomnummer++) {

			// Maak kolom en geef id
			var kolomId = "kolom_" + rijnummer + "_" + kolomnummer
			var kolomDiv = '<div id="' + kolomId + '"class="spelkolom subgrid"></div>'
			// Voeg kolom toe aan spel
			$(kolomDiv).appendTo('#speelbord');
			// // voeg achtergrond afbeelding toe
			// imageUrl = 'img/monopolyboard_'+totaalAantalKolom+'.png'
			// $('#'+kolomId).css('background-image', 'url(' + imageUrl + ')');

			$("#kolom_2_3 ,#kolom_2_4 ,#kolom_2_5 ,#kolom_2_6 ,#kolom_2_7 ,#kolom_2_8 ,#kolom_2_9 ,#kolom_2_10, kolom_2_11 ").addClass("huizen_beneden");
			$("#kolom_3_12 ,#kolom_4_12 ,#kolom_5_12 ,#kolom_6_12 ,#kolom_7_12 ,#kolom_8_12 ,#kolom_9_12 ,#kolom_10_12 ,#kolom_11_12 ").addClass("huizen_links");
			$("#kolom_12_3 ,#kolom_12_4 ,#kolom_12_5 ,#kolom_12_6 ,#kolom_12_7 ,#kolom_12_8 ,#kolom_12_9 ,#kolom_12_10 ,#kolom_12_11 ").addClass("huizen_boven");
			$("#kolom_3_2 ,#kolom_4_2 ,#kolom_5_2 ,#kolom_6_2 ,#kolom_7_2 ,#kolom_8_2 ,#kolom_9_2 ,#kolom_10_2 ,#kolom_11_2 ").addClass("huizen_rechts");
		}
	}

	$('<div id="vrijParkerenGeld"><p>€ 0</p></div>').appendTo('#kolom_2_1');
}



$(".spelersNaam").keyup(function () {
	var naamid = this.id.replace(/\D/g, '');
	data[naamid].naam = this.value
	updateGeld()
});

$(".sluitSpeler").click(function () {
	new Audio(audioClick).play();
	var verwijderid = this.id.replace(/\D/g, '');

	bootbox.confirm({
		message: "Weet je zeker dat je deze speler wilt verwijderen? Dit kan niet meer ongedaan worden gemaakt.",
		buttons: {
			confirm: {
				label: 'Ja, dat weet ik zeker!',
				className: 'btn-success'
			},
			cancel: {
				label: 'Onee, toch niet',
				className: 'btn-danger'
			}
		},
		callback: function (result) {
			new Audio(audioClick).play();
			if (result) {
				verwijderSpeler(verwijderid)
			}
		}
	});
});

verbergOnderdelen = function () {
	$('#kopen').hide();
	$('#versterken').hide();
	$("#actieBetalen").hide();
};

var handel = {
	0: {
		naam: null,
		tekoop: null,
		beschikbaar: null,
		prijs: null,
		eigenaar: null,
		serieNR: null,
		huur: null
	},
	1: {
		naam: "Start",
		tekoop: false,
		beschikbaar: false,
		prijs: 0,
		eigenaar: null,
		serieNR: 0,
		huur: []
	},
	2: {
		naam: "Bos- en lommerplein",
		tekoop: true,
		beschikbaar: true,
		prijs: -60,
		huis: -50,
		eigenaar: null,
		huizen: 0,
		serieNR: 1,
		serie: 2,
		huur: [2, 10, 30, 90, 160, 250],
		hypotheek: false,
		hypotheekprijs: 30,
		img: 'img/2.png'
	},
	3: {
		naam: "Algemeen fonds",
		tekoop: false,
		beschikbaar: false,
		prijs: 0,
		eigenaar: null,
		serieNR: 0,
		huur: []
	},
	4: {
		naam: "Jan van Galenstraat",
		tekoop: true,
		beschikbaar: true,
		prijs: -60,
		huis: -50,
		eigenaar: null,
		huizen: 0,
		serieNR: 1,
		serie: 2,
		huur: [4, 20, 60, 180, 320, 450],
		hypotheek: false,
		hypotheekprijs: 30,
		img: 'img/4.png'
	},
	5: {
		naam: "Belasting",
		tekoop: false,
		beschikbaar: false,
		prijs: -200,
		eigenaar: null,
		serieNR: 0,
		huur: []
	},
	6: {
		naam: "Station Zuid",
		tekoop: true,
		beschikbaar: true,
		prijs: -200,
		eigenaar: null,
		serieNR: 9,
		huur: [25, 50, 100, 200],
		hypotheek: false,
		hypotheekprijs: 100,
		img: 'img/6.png'
	},
	7: {
		naam: "Postjesweg",
		tekoop: true,
		beschikbaar: true,
		prijs: -100,
		huis: -50,
		eigenaar: null,
		huizen: 0,
		serieNR: 2,
		serie: 3,
		huur: [6, 30, 90, 270, 400, 550],
		hypotheek: false,
		hypotheekprijs: 50,
		img: 'img/7.png'
	},
	8: {
		naam: "Kans",
		tekoop: false,
		beschikbaar: false,
		prijs: 0,
		eigenaar: null,
		serieNR: 0,
		huur: []
	},
	9: {
		naam: "Surinameplein",
		tekoop: true,
		beschikbaar: true,
		prijs: -100,
		huis: -50,
		eigenaar: null,
		huizen: 0,
		serieNR: 2,
		serie: 3,
		huur: [6, 30, 90, 270, 400, 550],
		hypotheek: false,
		hypotheekprijs: 50,
		img: 'img/9.png'
	},
	10: {
		naam: "Kinkerstraat",
		tekoop: true,
		beschikbaar: true,
		prijs: -120,
		huis: -50,
		eigenaar: null,
		huizen: 0,
		serieNR: 2,
		serie: 3,
		huur: [8, 40, 100, 300, 440, 600],
		hypotheek: false,
		hypotheekprijs: 60,
		img: 'img/10.png'
	},
	11: {
		naam: "Slechts op bezoek",
		tekoop: false,
		beschikbaar: false,
		prijs: 0,
		eigenaar: null,
		serieNR: null,
		huur: []
	},
	12: {
		naam: "Middenweg",
		tekoop: true,
		beschikbaar: true,
		prijs: -140,
		huis: -100,
		eigenaar: null,
		huizen: 0,
		serieNR: 3,
		serie: 3,
		huur: [10, 50, 150, 450, 625, 750],
		hypotheek: false,
		hypotheekprijs: 70,
		img: 'img/12.png'
	},
	13: {
		naam: "Elektriciteitscentrale",
		tekoop: true,
		beschikbaar: true,
		prijs: -150,
		eigenaar: null,
		serieNR: 10,
		huur: [],
		hypotheek: false,
		hypotheekprijs: 75,
		img: 'img/13.png'
	},
	14: {
		naam: "Kruislaan",
		tekoop: true,
		beschikbaar: true,
		prijs: -140,
		huis: -100,
		eigenaar: null,
		huizen: 0,
		serieNR: 3,
		serie: 3,
		huur: [10, 50, 150, 450, 625, 750],
		hypotheek: false,
		hypotheekprijs: 70,
		img: 'img/14.png'
	},
	15: {
		naam: "Carolina MacGillavrylaan",
		tekoop: true,
		beschikbaar: true,
		prijs: -160,
		huis: -100,
		eigenaar: null,
		huizen: 0,
		serieNR: 3,
		serie: 3,
		huur: [12, 60, 180, 500, 700, 900],
		hypotheek: false,
		hypotheekprijs: 80,
		img: 'img/15.png'
	},
	16: {
		naam: "Station Lelylaan",
		tekoop: true,
		beschikbaar: true,
		prijs: -200,
		eigenaar: null,
		serieNR: 9,
		huur: [25, 50, 100, 200],
		hypotheek: false,
		hypotheekprijs: 100,
		img: 'img/16.png'
	},
	17: {
		naam: "Zeeburgerdijk",
		tekoop: true,
		beschikbaar: true,
		prijs: -180,
		huis: -100,
		eigenaar: null,
		huizen: 0,
		serieNR: 4,
		serie: 3,
		huur: [14, 70, 200, 550, 750, 950],
		hypotheek: false,
		hypotheekprijs: 90,
		img: 'img/17.png'
	},
	18: {
		naam: "Algemeen fonds",
		tekoop: false,
		beschikbaar: false,
		prijs: -0,
		eigenaar: null,
		serieNR: 0,
		huur: []
	},
	19: {
		naam: "Molukkenstraat",
		tekoop: true,
		beschikbaar: true,
		prijs: -180,
		huis: -100,
		eigenaar: null,
		huizen: 0,
		serieNR: 4,
		serie: 3,
		huur: [14, 70, 200, 550, 750, 950],
		hypotheek: false,
		hypotheekprijs: 90,
		img: 'img/19.png'
	},
	20: {
		naam: "Dappermarkt",
		tekoop: true,
		beschikbaar: true,
		prijs: -200,
		huis: -100,
		eigenaar: null,
		huizen: 0,
		serieNR: 4,
		serie: 3,
		huur: [16, 80, 220, 600, 800, 1000],
		hypotheek: false,
		hypotheekprijs: 100,
		img: 'img/20.png'
	},
	21: {
		naam: "Vrij parkeren",
		tekoop: false,
		beschikbaar: false,
		prijs: 0,
		eigenaar: null,
		serieNR: null,
		huur: []
	},
	22: {
		naam: "Overtoom",
		tekoop: true,
		beschikbaar: true,
		prijs: -220,
		huis: -150,
		eigenaar: null,
		huizen: 0,
		serieNR: 5,
		serie: 3,
		huur: [18, 90, 250, 700, 875, 1050],
		hypotheek: false,
		hypotheekprijs: 110,
		img: 'img/22.png'
	},
	23: {
		naam: "Kans",
		tekoop: false,
		beschikbaar: false,
		prijs: 0,
		eigenaar: null,
		serieNR: null,
		huur: []
	},
	24: {
		naam: "Nassaukade",
		tekoop: true,
		beschikbaar: true,
		prijs: -220,
		huis: -150,
		eigenaar: null,
		huizen: 0,
		serieNR: 5,
		serie: 3,
		huur: [18, 90, 250, 700, 875, 1050],
		hypotheek: false,
		hypotheekprijs: 110,
		img: 'img/24.png'
	},
	25: {
		naam: "Vondelstraat",
		tekoop: true,
		beschikbaar: true,
		prijs: -240,
		huis: -150,
		eigenaar: null,
		huizen: 0,
		serieNR: 5,
		serie: 3,
		huur: [20, 100, 300, 750, 925, 1100],
		hypotheek: false,
		hypotheekprijs: 120,
		img: 'img/25.png'
	},
	26: {
		naam: "Centraal Station",
		tekoop: true,
		beschikbaar: true,
		prijs: -200,
		eigenaar: null,
		serieNR: 9,
		huur: [25, 50, 100, 200],
		hypotheek: false,
		hypotheekprijs: 100,
		img: 'img/26.png'
	},
	27: {
		naam: "Rooseveltlaan",
		tekoop: true,
		beschikbaar: true,
		prijs: -260,
		huis: -150,
		eigenaar: null,
		huizen: 0,
		serieNR: 6,
		serie: 3,
		huur: [22, 110, 330, 800, 975, 1150],
		hypotheek: false,
		hypotheekprijs: 130,
		img: 'img/27.png'
	},
	28: {
		naam: "Amsteldijk",
		tekoop: true,
		beschikbaar: true,
		prijs: -260,
		huis: -150,
		eigenaar: null,
		huizen: 0,
		serieNR: 6,
		serie: 3,
		huur: [22, 110, 330, 800, 975, 1150],
		hypotheek: false,
		hypotheekprijs: 130,
		img: 'img/28.png'
	},
	29: {
		naam: "Waterleiding",
		tekoop: true,
		beschikbaar: true,
		prijs: -150,
		eigenaar: null,
		serieNR: 10,
		huur: [],
		hypotheek: false,
		hypotheekprijs: 75,
		img: 'img/29.png'
	},
	30: {
		naam: "Europaplein",
		tekoop: true,
		beschikbaar: true,
		prijs: -280,
		huis: -150,
		eigenaar: null,
		huizen: 0,
		serieNR: 6,
		serie: 3,
		huur: [24, 120, 360, 850, 1025, 1200],
		hypotheek: false,
		hypotheekprijs: 140,
		img: 'img/30.png'
	},
	31: {
		naam: "Naar de gevangenis",
		tekoop: false,
		beschikbaar: false,
		prijs: 0,
		eigenaar: null,
		serieNR: 0,
		huur: []
	},
	32: {
		naam: "Oosterburgergracht",
		tekoop: true,
		beschikbaar: true,
		prijs: -300,
		huis: -200,
		eigenaar: null,
		huizen: 0,
		serieNR: 7,
		serie: 3,
		huur: [26, 130, 390, 900, 1100, 1275],
		hypotheek: false,
		hypotheekprijs: 150,
		img: 'img/32.png'
	},
	33: {
		naam: "Ceintuurbaan",
		tekoop: true,
		beschikbaar: true,
		prijs: -300,
		huis: -200,
		eigenaar: null,
		huizen: 0,
		serieNR: 7,
		serie: 3,
		huur: [26, 130, 390, 900, 1100, 1275],
		hypotheek: false,
		hypotheekprijs: 150,
		img: 'img/33.png'
	},
	34: {
		naam: "Algemeen fonds",
		tekoop: false,
		beschikbaar: false,
		prijs: 0,
		eigenaar: null,
		serieNR: 0,
		huur: []
	},
	35: {
		naam: "Weesperplein",
		tekoop: true,
		beschikbaar: true,
		prijs: -320,
		huis: -200,
		eigenaar: null,
		huizen: 0,
		serieNR: 7,
		serie: 3,
		huur: [28, 150, 450, 1000, 1200, 1400],
		hypotheek: false,
		hypotheekprijs: 160,
		img: 'img/35.png'
	},
	36: {
		naam: "Station Duivendrecht",
		tekoop: true,
		beschikbaar: true,
		prijs: -200,
		eigenaar: null,
		serieNR: 9,
		huur: [25, 50, 100, 200],
		hypotheek: false,
		hypotheekprijs: 100,
		img: 'img/36.png'
	},
	37: {
		naam: "Kans",
		tekoop: false,
		beschikbaar: false,
		prijs: 0,
		eigenaar: null,
		serieNR: 0,
		huur: []
	},
	38: {
		naam: "Leidsestraat",
		tekoop: true,
		beschikbaar: true,
		prijs: -350,
		huis: -200,
		eigenaar: null,
		huizen: 0,
		serieNR: 8,
		serie: 2,
		huur: [35, 175, 500, 1100, 1300, 1500],
		hypotheek: false,
		hypotheekprijs: 175,
		img: 'img/38.png'
	},
	39: {
		naam: "Belasting",
		tekoop: false,
		beschikbaar: false,
		prijs: -100,
		eigenaar: null,
		serieNR: 0,
		huur: []
	},
	40: {
		naam: "Kalverstraat",
		tekoop: true,
		beschikbaar: true,
		prijs: -400,
		huis: -200,
		eigenaar: null,
		huizen: 0,
		serieNR: 8,
		serie: 2,
		huur: [50, 200, 600, 1400, 1700, 2000],
		hypotheek: false,
		hypotheekprijs: 200,
		img: 'img/40.png'
	},
	60: {
		naam: "Gevangenis",
		tekoop: false,
		beschikbaar: false,
		prijs: 0,
	}
}

var kansKaarten = [{
		naam: "Wegpiraat",
		bericht: "Boete voor te snel rijden &euro;15 ",
		prijsHuidigeSpeler: -15,
		prijsAndereSpeler: 0,
		nieuweplek: 0
	},
	{
		naam: "Collegegeld",
		bericht: "Je moet collegegeld betalen aan de Uni. Dit komt neer op 150 euro.",
		prijsHuidigeSpeler: -150,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Middenweg",
		bericht: "Ga verder naar de Middenweg. Indien u langs 'Start' komt, ontvangt je 200 euro.",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: 0,
		functie: function () {
			$('#algemeneInfoKnop').prop('disabled', true);
			var timeleft = speed / 1000;
			$("#algemeneInfoText").html("Ga verder naar de Middenweg. Indien je langs 'Start' komt, ontvangt je 200 euro.<br><br><strong><span id='countdowntimer'>" + timeleft + "</span><br><br></strong>");


			var downloadTimer = setInterval(function () {
				timeleft--;
				$("#countdowntimer").html(timeleft);
				if (timeleft <= 0)
					clearInterval(downloadTimer);
				var VSpeler = "#speler" + actieveSpeler
				var huidigeplek = $(VSpeler).parent().attr("id");
				var huidigepleknummer = kolomNaarNummer(huidigeplek)

				if (huidigepleknummer >= 12) {
					data[actieveSpeler].geld += 200
				}
			}, 1000);
		},
		verplaatsspeler: true,
		nieuweplek: 12
	},
	{
		naam: "Lelylaan",
		bericht: "Je wilt met de Trein. Je reist naar Station Lelylaan. Indien u langs 'Start' komt, ontvangt je 200 euro.",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: 0,
		functie: function () {
			$('#algemeneInfoKnop').prop('disabled', true);
			var timeleft = speed / 1000;
			$("#algemeneInfoText").html("Je wilt met de Trein. Je reist naar Station Lelylaan. Indien u langs 'Start' komt, ontvangt je 200 euro.<br><br><strong><span id='countdowntimer'>" + timeleft + "</span><br><br></strong>");


			var downloadTimer = setInterval(function () {
				timeleft--;
				$("#countdowntimer").html(timeleft);
				if (timeleft <= 0)
					clearInterval(downloadTimer);
				var VSpeler = "#speler" + actieveSpeler
				var huidigeplek = $(VSpeler).parent().attr("id");
				var huidigepleknummer = kolomNaarNummer(huidigeplek)

				if (huidigepleknummer >= 16) {
					data[actieveSpeler].geld += 200
				}
			}, 1000);
		},
		verplaatsspeler: true,
		nieuweplek: 16
	},
	{
		naam: "Start",
		bericht: "Reis in één keer door naar start.",
		prijsHuidigeSpeler: 200,
		prijsAndereSpeler: 0,
		verplaatsspeler: true,
		nieuweplek: 1
	},
	{
		naam: "Terug",
		bericht: "Ga drie plaatsen terug.",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: 0,
		functie: function () {
			$('#algemeneInfoKnop').prop('disabled', true);
			var timeleft = speed / 1000;
			$("#algemeneInfoText").html("Ga drie plaatsen terug. <br><br><strong><span id='countdowntimer'>" + timeleft + "</span><br><br></strong>");


			var downloadTimer = setInterval(function () {
				timeleft--;
				$("#countdowntimer").html(timeleft);
				if (timeleft <= 0)
					clearInterval(downloadTimer);
			}, 1000);



			setTimeout(function () {
				verplaatsSpeler('speler' + actieveSpeler, -3)

				setTimeout(function () {
					WatTeDoenOpDitVeld()
					$('#algemeneInfoKnop').prop('disabled', false);
				}, verplaatsTijd * 5)
			}, speed);


		},
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Gevangenis",
		bericht: "Ga direct naar de gevangenis. Ga niet langs 'Start'. Je ontvangt geen 200 euro.",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: 0,
		functie: function () {
			gevangenis()
		},
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Vondelstraat",
		bericht: "Ga verder naar de Vondelstraat. Indien je langs 'Start' komt pak je &euro;200",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: 0,
		functie: function () {
			$('#algemeneInfoKnop').prop('disabled', true);
			var timeleft = speed / 1000;
			$("#algemeneInfoText").html("Ga verder naar de Vondelstraat. Indien je langs 'Start' komt pak je &euro;200<br><br><strong><span id='countdowntimer'>" + timeleft + "</span><br><br></strong>");


			var downloadTimer = setInterval(function () {
				timeleft--;
				$("#countdowntimer").html(timeleft);
				if (timeleft <= 0)
					clearInterval(downloadTimer);
				var VSpeler = "#speler" + actieveSpeler
				var huidigeplek = $(VSpeler).parent().attr("id");
				var huidigepleknummer = kolomNaarNummer(huidigeplek)

				if (huidigepleknummer >= 25) {
					data[actieveSpeler].geld += 200
				}
			}, 1000);
		},
		verplaatsspeler: true,
		nieuweplek: 25
	},
	{
		naam: "Bankvoordeel",
		bericht: "De bank betaalt u &euro;50",
		prijsHuidigeSpeler: 50,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "REPAREREN",
		bericht: "Repareer uw huizen. Betaal voor elk huis &euro;25, betaal voor elk hotel &euro;100",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: 0,
		functie: function () {
			var aantalhuizenbelasting = 0;
			var aantalhotelsbelasting = 0;

			data[actieveSpeler].bezit.forEach(function (keyString) {
				var key = Number(keyString)

				if (handel[key].huizen < 5) {
					aantalhuizenbelasting += handel[key].huizen
				} else if (handel[key].huizen == 5) {
					aantalhotelsbelasting++
				}
			})
			aantalhotelsbelasting = aantalhotelsbelasting * 100
			aantalhuizenbelasting = aantalhuizenbelasting * 25

			$("#algemeneInfoText").html("Repareer uw huizen. Betaal voor elk huis &euro;25, betaal voor elk hotel &euro;100 <br><br><p>Voor jou wordt het bedrag: <br><strong>&euro; " + aantalhuizenbelasting + "</strong> voor huizen <br> <strong>&euro; " + aantalhotelsbelasting + "</strong> voor hotels</p>");

			data[actieveSpeler].geld -= aantalhotelsbelasting + aantalhuizenbelasting
			handel[21].prijs += aantalhotelsbelasting + aantalhuizenbelasting
		},
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "STRAATGELD",
		bericht: "U wordt aangeslagen voor straatgeld. &euro;40 per huis, &euro;115 per hotel",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: 0,
		functie: function () {
			var aantalhuizenbelasting = 0;
			var aantalhotelsbelasting = 0;

			data[actieveSpeler].bezit.forEach(function (keyString) {
				var key = Number(keyString)

				if (handel[key].huizen < 5) {
					aantalhuizenbelasting += handel[key].huizen
				} else if (handel[key].huizen == 5) {
					aantalhotelsbelasting++
				}
			})
			aantalhotelsbelasting = aantalhotelsbelasting * 115
			aantalhuizenbelasting = aantalhuizenbelasting * 40

			$("#algemeneInfoText").html("U wordt aangeslagen voor straatgeld. &euro;40 per huis, &euro;115 per hotel <br><br><p>Voor jou wordt het bedrag: <br><strong>&euro; " + aantalhuizenbelasting + "</strong> voor huizen <br> <strong>&euro; " + aantalhotelsbelasting + "</strong> voor hotels</p>");

			data[actieveSpeler].geld -= aantalhotelsbelasting + aantalhuizenbelasting;
			handel[21].prijs += aantalhotelsbelasting + aantalhuizenbelasting;
		},
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Verzekering",
		bericht: "Uw bouwverzekering vervalt, je ontvangt &euro;150",
		prijsHuidigeSpeler: 150,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Dronken",
		bericht: "Je wordt dronken aangehouden op de fiets... 20 euro boete",
		prijsHuidigeSpeler: -20,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Kalverstraat",
		bericht: "Ga in één keer door naar de Kalverstraat.",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: 0,
		functie: function () {
			$('#algemeneInfoKnop').prop('disabled', true);
			var timeleft = speed / 1000;
			$("#algemeneInfoText").html("Ga in één keer door naar de Kalverstraat.<br><br><strong><span id='countdowntimer'>" + timeleft + "</span><br><br></strong>");


			var downloadTimer = setInterval(function () {
				timeleft--;
				$("#countdowntimer").html(timeleft);
				if (timeleft <= 0)
					clearInterval(downloadTimer);
				var VSpeler = "#speler" + actieveSpeler
				var huidigeplek = $(VSpeler).parent().attr("id");
				var huidigepleknummer = kolomNaarNummer(huidigeplek)

				if (huidigepleknummer >= 40) {
					data[actieveSpeler].geld += 200
				}
			}, 1000);
		},
		verplaatsspeler: true,
		nieuweplek: 40
	},
	{
		naam: "Kruiswoordpuzzel",
		bericht: "Je hebt een kruiswoordpuzzel gewonnen en ontvangt 100 euro.",
		prijsHuidigeSpeler: 100,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
]

var algemeenfondsKaarten = [{
		naam: "Erfenis",
		bericht: "Je erft 100 euro",
		prijsHuidigeSpeler: 100,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Aandelen",
		bericht: "U ontvangt rente van 7% preferente aandelen, je ontvangt &euro;25",
		prijsHuidigeSpeler: 25,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Vergissing",
		bericht: "Een vergissing van de bank in uw voordeel, je ontvangt &euro;200",
		prijsHuidigeSpeler: 200,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Ga terug",
		bericht: "Ga terug naar Bos- en lommerplein",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: 0,
		verplaatsspeler: true,
		nieuweplek: 2
	},
	{
		naam: "Naar de gevangenis",
		bericht: "Ga direct naar de gevangenis. Ga niet langs start, u ontvangt geen &euro;200",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: 0,
		functie: function () {
			gevangenis()
		},
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Verjaardag",
		bericht: "Je bent jarig en ontvangt van iedere speler 20 euro.",
		prijsHuidigeSpeler: 0,
		prijsAndereSpeler: -20,
		functie: function () {
			data[actieveSpeler].geld += aantalSpelers * 20
		},
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Schoonheidswedstrijd",
		bericht: "U hebt de tweede prijs in een schoonheidswedstrijd gewonnen en ontvangt 50 euro",
		prijsHuidigeSpeler: 50,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Doktersrekening",
		bericht: "Betaal uw doktersrekening &euro;100",
		prijsHuidigeSpeler: -100,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Verzekeringspremie",
		bericht: "Betaal uw verzekeringspremie &euro;50",
		prijsHuidigeSpeler: -50,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Airbnb",
		bericht: "Door verhuur van Airbnb ontvangt u 50 euro",
		prijsHuidigeSpeler: 50,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Lijfrente",
		bericht: "Lijfrente vervalt, u ontvangt &euro;100",
		prijsHuidigeSpeler: 100,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "inkomstenbelasting",
		bericht: "Restitutie inkomstenbelasting, u ontvangt &euro;20",
		prijsHuidigeSpeler: 20,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Ziekenhuiskosten",
		bericht: "Betaal de Ziekenhuiskosten &euro;100",
		prijsHuidigeSpeler: 20,
		prijsAndereSpeler: 0,
		verplaatsspeler: false,
		nieuweplek: 0
	},
	{
		naam: "Naar start",
		bericht: "Je hebt de wind in de rug! Ga verder naar start",
		prijsHuidigeSpeler: 200,
		prijsAndereSpeler: 0,
		verplaatsspeler: true,
		nieuweplek: 1
	}
]


maakSpelers = function () {
	for (var i = 1; i <= aantalSpelers; i++) {
		var speler = '<div id="speler' + i + '" class="spelers"></div>'
		$(speler).appendTo('#kolom_13_13');

		var startgeld = 1500
		var spelersnaam = "Speler" + i

		data[i] = {
			actief: true,
			naam: spelersnaam,
			geld: startgeld,
			bezit: [],
			gevangenis: false,
			gevangenisWorpen: 0,
			vrijgelaten: false
		}
	}
}

$(function () {
	$(".spelers").draggable({
		revert: true
	});
});

verwijderSpeler = function (id) {
	data[id].actief = false
	aantalSpelers--
	$("#overzichtspeler" + id).remove()
	$("#speler" + id).remove()
	data[id].bezit.forEach(function (nummer) {
		handel[nummer].tekoop = true
		handel[nummer].hypotheek = false
		handel[nummer].huizen = 0
		handel[nummer].eigenaar = null
		vastgoedBeheer(0, nummer)
		kleurAchtergrond(nummer, 0)
	});

	if (id == actieveSpeler) {
		volgendeSpeler()

		setTimeout(function () {
			$("#versterken ,#kopen").hide("fast", function () {
				// zet acties uit
				$("#huizenKopenDiv").hide()
				$("#vastgoedRuilen").hide()
				$("#hypotheekDiv").hide()

				$("#gooien").show("fast", function () {
					$("#stapKopen").removeClass("list-group-item-warning")
					$("#stapVersterken").removeClass("list-group-item-primary")
					$("#stapGooien").addClass("list-group-item-success")
					$('#beurtBeeindigen').prop('disabled', false);
				});
			});
		}, 500);
	}

	hebbenWeEenWinnaar()
}


////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   BEURT HANDELINGEN   ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////
//////////////////////   GOOIEN   //////////////////////
////////////////////////////////////////////////////////

var uitkomstWorp
// STAP 1: Gooien
$("#roll").click(function () {
	$('#roll').prop('disabled', true);
	new Audio(audioClick).play();
	uitkomstWorp = roll()
	spelStap(2)
});


////////////////////////////////////////////////////////
/////////////////   KOPEN / BETALEN   //////////////////
////////////////////////////////////////////////////////

// STAP 2: Kopen
$("#kaartKopen").click(function () {
	new Audio(audioClick).play();
	$('#kaartKopen').prop('disabled', true);
	handelVerwerken("kopen")

	checkOfdubbelGegooid()

});

// STAP 2: NietKopen
$("#kaartNietKopen").click(function () {
	new Audio(audioClick).play();
	$('#kaartNietKopen').prop('disabled', true);

	checkOfdubbelGegooid()
});

// STAP 2: Betalen
$("#kaartBetalen").click(function () {
	new Audio(audioClick).play();
	$('#kaartBetalen').prop('disabled', true);
	handelVerwerken("betalen")

	checkOfdubbelGegooid()
});

// STAP 2: Algemeen info knop "verder"
$("#algemeneInfoKnop").click(function () {
	new Audio(audioClick).play();
	$('#algemeneInfoKnop').prop('disabled', true);

	checkOfdubbelGegooid()
});

// STAP 2: In de gevangenis en vrij gekocht 
$("#GevangenisKnop").click(function () {
	new Audio(audioClick).play();
	$('#GevangenisKnop').prop('disabled', true);
	handelVerwerken("gevangenis")

	checkOfdubbelGegooid()
});

////////////////////////////////////////////////////////
///////////////////   VERSTERKEN   /////////////////////
////////////////////////////////////////////////////////

// STAP 3: huizen kopen
$("#huizenKopenKnop").click(function () {
	new Audio(audioClick).play();
	$('#huizenKopenKnop').prop('disabled', true);
	setTimeout(function () {
		$("#versterkKnoppen").hide("fast", function () {
			$("#huizenKopenSlider").hide()
			$("#huizenKopenDiv").show("fast", function () {
				$('#huizenKopenInfo').html("<h5> Vastgoed </h5> Klik op een straat om het vastgoed te beheren")
				$('#huizenKopenKnop').prop('disabled', false);
			});
		});
	}, 500);
});


// STAP 3: Vastgoed ruilen
$("#ruilenMetAnderen").click(function () {
	new Audio(audioClick).play();
	$('#ruilenMetAnderen').prop('disabled', true);

	setTimeout(function () {
		$("#versterkKnoppen").hide("fast", function () {
			$("#vastgoedRuilen").show("fast", function () {
				$('#ruilenMetAnderen').prop('disabled', false);
				geselecteerdekaart = null
				geselecteerdekaartkant = 0;
				$("#ruilHuidigeSpeler_plus ,#ruilAndereSpeler_plus").removeClass("achtergrondRuilen");
				$("#ruilHuidigeSpeler_plus ,#ruilAndereSpeler_plus").attr('src', 'img/plus.png');

			});
		});
	}, 500);
});


// STAP 3: hypotheek beheren
$("#hypotheekBeheren").click(function () {
	new Audio(audioClick).play();
	$('#hypotheekBeheren').prop('disabled', true);
	setTimeout(function () {
		$("#versterkKnoppen").hide("fast", function () {
			$("#huizenKopenSlider").hide()

			$("#hypotheekDiv").show("fast", function () {
				$('#hypotheekInfo').html("<h5> Hypotheek </h5> Klik op een straat om de hypotheek te beheren")
				$('#hypotheekBeheren').prop('disabled', false);
			});
		});
	}, 500);
});


// STAP 3: Beurt beeindigen
$("#beurtBeeindigen").click(function () {
	new Audio(audioClick).play();
	$('#beurtBeeindigen').prop('disabled', true);

	var failliet = checkOfFailliet(actieveSpeler)

	if (failliet) {
		bootbox.confirm({
			message: "Weet je zeker dat je niet meer uit de rode cijfers kunt komen? Als je nu op doorgaan klikt ben je AF en mag je niet meer meedoen.",
			buttons: {
				cancel: {
					label: '<i class="fa fa-times"></i> Ik los het op!',
					className: 'btn-success'
				},
				confirm: {
					label: '<i class="fa fa-check"></i> Doorgaan',
					className: 'btn-danger'
				}
			},
			callback: function (result) {
				new Audio(audioClick).play();
				if (result) {
					verwijderSpeler(actieveSpeler)

					spelStap(1)
				} else {
					$('#beurtBeeindigen').prop('disabled', false);
				}
			}
		});
	} else {
		spelStap(1)
	}
});



/////////////////////////////////////
///////  3. SUBONDERDEEL  ///////////
/////////////////////////////////////


// SUBSTAP 3: Huizen verwerken
$("#huizenDoorvoeren").click(function () {
	new Audio(audioClick).play();
	$('#huizenDoorvoeren').prop('disabled', true);
	handelVerwerken("huizen")

	setTimeout(function () {
		$("#huizenKopenDiv").hide("fast", function () {
			$("#versterkKnoppen").show("fast", function () {});
		});
	}, 500);
});

// SUBSTAP 3: DAADWERKEIJK RUILEN
$("#vastgoedRuilenKnop").click(function () {
	new Audio(audioClick).play();
	VerwerkHandel()

	geselecteerdekaart = null;
	geselecteerdekaartkant = 0;
	$("#ruilHuidigeSpeler_plus").removeClass("achtergrondRuilen");
	$("#ruilAndereSpeler_plus").removeClass("achtergrondRuilen");

	$("#ruilHuidigeSpeler_plus").attr('src', 'img/plus.png');
	$("#ruilAndereSpeler_plus").attr('src', 'img/plus.png');

	$("#ruil_geld_1").val(0)
	$("#ruil_geld_2").val(0)

	$('#vastgoedRuilenKnop').prop('disabled', true);
});


// SUBSTAP 3: HYPOTHEEK DOORVOEREN
$("#hypotheekDoorvoeren").click(function () {
	new Audio(audioClick).play();
	if (handel[ClickKolomNummer].hypotheek) {
		handel[ClickKolomNummer].hypotheek = false;
		handel[ClickKolomNummer].img = "img/" + ClickKolomNummer + ".png";
		data[actieveSpeler].geld -= (handel[ClickKolomNummer].hypotheekprijs * 1.1)
	} else {
		handel[ClickKolomNummer].hypotheek = true;
		handel[ClickKolomNummer].img = "img/hypotheek" + handel[ClickKolomNummer].hypotheekprijs + ".png";
		data[actieveSpeler].geld += handel[ClickKolomNummer].hypotheekprijs
	}

	$('#hypotheekInfo').html("<h5> Hypotheek </h5> Hypotheek aanvraag verwerkt! Klik op één van je straten om nog een hypotheek te beheren.")
	$('#hypotheekDoorvoeren').prop('disabled', true);

	kleurAchtergrond(ClickKolomNummer, actieveSpeler)
	updateGeld();
	updateSpelersKaarten();
});



// SUBSTAP 3: terug
$(".VersterkenTerug").click(function () {
	new Audio(audioClick).play();
	$('.VersterkenTerug').prop('disabled', true);

	setTimeout(function () {
		$("#huizenKopenDiv ,#vastgoedRuilen, #hypotheekDiv").hide("fast", function () {

			$("#versterkKnoppen").show("fast", function () {
				$('.VersterkenTerug').prop('disabled', false);
				geselecteerdekaart = null
			});
		});
	}, 500);
});


$("#ruilHuidigeSpeler_plus ,#ruilAndereSpeler_plus").click(function () {
	new Audio(audioClick).play();
	$("#ruilHuidigeSpeler_plus ,#ruilAndereSpeler_plus").removeClass("achtergrondRuilen");
	$(this).addClass("achtergrondRuilen");
	geselecteerdekaart = "#" + this.id

	if ($(this).attr("src") != "img/plus.png") {
		$(this).removeClass("achtergrondRuilen");
		geselecteerdekaart = null;
		geselecteerdekaartkant = 0;
		$("#ruilenbericht").html("Je hebt je oude kaart verwijderd. Klik op een zijde waar je een ruilkaart zou willen toevoegen.")

		$(this).attr('src', 'img/plus.png');
	}

	if (this.id == "ruilHuidigeSpeler_plus") {
		$("#ruilenbericht").html("Klik op één van je eigen kaarten van het spelbord. Dit is de kaart die je wilt ruilen.")
		geselecteerdekaartkant = 1;
	} else {
		$("#ruilenbericht").html("Klik op een kaart van een tegenstander. Deze kaart zal geruild worden met jouw kaart.")
		geselecteerdekaartkant = 2;
	}
});




checkOfdubbelGegooid = function () {
	// als je dubbel hebt gegooid -> terug naar gooien
	if (dubbelGegooid) {
		dubbelGegooidTeller++

		if (dubbelGegooidTeller >= 3) {
			$("#actieKopen ,#actieBetalen ,#koopknop ,#betaalknop ,#kaartKopen ,#kaartNietKopen ,#koopInfo ,#algemeneInfo ,#GevangenisKnop").hide();

			dubbelGegooid = false
			gevangenis()
			$("#algemeneInfo").show();
			$("#algemeneInfoText").html("<h5 class='font-weight-bold'>Naar het gevang</h5> Je hebt drie keer dubbel gegooid. Je moet nu <strong>direct</strong> naar de gevangenis!");
		} else {
			setTimeout(function () {
				$("#kopen").hide("fast", function () {
					$('#roll').prop('disabled', false);
					$("#gooien").show("fast", function () {
						$("#stapKopen").removeClass("list-group-item-warning")
						$("#stapGooien").addClass("list-group-item-success")
					});
				});
			}, 500);
		}
	} else {
		spelStap(3)
	}
	setTimeout(function () {
		$('#kaartKopen').prop('disabled', false);
		$('#kaartNietKopen').prop('disabled', false);
		$('#kaartBetalen').prop('disabled', false);
		$('#algemeneInfoKnop').prop('disabled', false);
		$('#GevangenisKnop').prop('disabled', false);
	}, 500);
}

////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////   VERPLAATSEN     //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

spelStap = function (stap) {

	verwijderStapKleur = function(){
		// stap kleur verwijderen
		$("#stapGooien").removeClass("list-group-item-success")
		$("#stapKopen").removeClass("list-group-item-warning")
		$("#stapVersterken").removeClass("list-group-item-primary")
	}

	if (stap == 1) {
		setTimeout(function () {
			$("#versterken").hide("fast", function () {
				$("#gooien").show("fast", function () {
					verwijderStapKleur()
					$("#stapGooien").addClass("list-group-item-success")
					$('#spelTitel').html("Gooien")
					$('#beurtBeeindigen').prop('disabled', false);
					volgendeSpeler()
				});
			});
		}, 500);
	} else if (stap == 2) {
		var speleraanzet = "speler" + actieveSpeler

		setTimeout(function () {
			verplaatsSpeler(speleraanzet, uitkomstWorp.ogen)
			setTimeout(function () {
				WatTeDoenOpDitVeld()
				$("#gooien").hide("fast", function () {
					$("#kopen").show("fast", function () {
						verwijderStapKleur()
						$("#stapKopen").addClass("list-group-item-warning")
						$('#spelTitel').html("Kopen")
						$('#roll').prop('disabled', false);
					});
				});
			}, verplaatsTijd * (AantalOgen + 2));
		}, speed);
	} else {
		setTimeout(function () {
			$("#kopen").hide("fast", function () {
				// zet acties uit
				$("#huizenKopenDiv ,#vastgoedRuilen, #hypotheekDiv").hide()

				$("#versterken").show("fast", function () {
					verwijderStapKleur()
					$("#stapVersterken").addClass("list-group-item-primary")
					$('#spelTitel').html("Versterken")
				});
			});
		}, 500);
	}
}




verplaatsSpeler = function (speler, zetten) {
	var VSpeler = "#" + speler

	// Gevangenis worp
	if (data[actieveSpeler].gevangenis) {
		var nieuwPlekNummer = 11 + zetten
		var nieuwKolom = nummerNaarKolom(nieuwPlekNummer)
		if (dubbelGegooid) {
			$(VSpeler).appendTo(nieuwKolom);
			data[actieveSpeler].vrijgelaten = false
			data[actieveSpeler].gevangenisWorpen = 0
			data[actieveSpeler].gevangenis = false
		} else if (data[actieveSpeler].vrijgelaten) {
			$(VSpeler).appendTo(nieuwKolom);
			data[actieveSpeler].vrijgelaten = false
			data[actieveSpeler].gevangenisWorpen = 0
			data[actieveSpeler].gevangenis = false
		} else {
			gevangenis()
		}
	}
	// gewone worp
	else {
		var zettenOver = zetten
		var richting = 1
		var teMakenZetten = setInterval(function () {

			if (zetten > 0) {
				zettenOver--;
				richting = 1
			} else {
				zettenOver++;
				richting = -1
			}


			// vindt de parent div van speler
			var huidigeplek = $(VSpeler).parent().attr("id");
			var huidigepleknummer = kolomNaarNummer(huidigeplek)
			var nieuwPlekNummer = huidigepleknummer + richting
			var nieuwKolom = nummerNaarKolom(nieuwPlekNummer)

			// speler komt langs start en ontvangt 200
			if (nieuwPlekNummer > 40) {
				data[actieveSpeler].geld += 200
				updateGeld()
			}

			new Audio(audioBord).play();
			$(VSpeler).appendTo(nieuwKolom);


			if (zettenOver == 0)
				clearInterval(teMakenZetten);
		}, verplaatsTijd);

	}

}

function kolomNaarNummer(huidigeplek) {
	if (huidigeplek == "kolom_13_13" || huidigeplek == "kolom_13_12" || huidigeplek == "kolom_12_12" || huidigeplek == "kolom_12_13") {
		var nummerOpBord = 1
	} else if (huidigeplek == "kolom_13_11" || huidigeplek == "kolom_12_11") {
		var nummerOpBord = 2
	} else if (huidigeplek == "kolom_13_10" || huidigeplek == "kolom_12_10") {
		var nummerOpBord = 3
	} else if (huidigeplek == "kolom_13_9" || huidigeplek == "kolom_12_9") {
		var nummerOpBord = 4
	} else if (huidigeplek == "kolom_13_8" || huidigeplek == "kolom_12_8") {
		var nummerOpBord = 5
	} else if (huidigeplek == "kolom_13_7" || huidigeplek == "kolom_12_7") {
		var nummerOpBord = 6
	} else if (huidigeplek == "kolom_13_6" || huidigeplek == "kolom_12_6") {
		var nummerOpBord = 7
	} else if (huidigeplek == "kolom_13_5" || huidigeplek == "kolom_12_5") {
		var nummerOpBord = 8
	} else if (huidigeplek == "kolom_13_4" || huidigeplek == "kolom_12_4") {
		var nummerOpBord = 9
	} else if (huidigeplek == "kolom_13_3" || huidigeplek == "kolom_12_3") {
		var nummerOpBord = 10
	} else if (huidigeplek == "kolom_13_1") {
		var nummerOpBord = 11
	} else if (huidigeplek == "kolom_11_1" || huidigeplek == "kolom_11_2") {
		var nummerOpBord = 12
	} else if (huidigeplek == "kolom_10_1" || huidigeplek == "kolom_10_2") {
		var nummerOpBord = 13
	} else if (huidigeplek == "kolom_9_1" || huidigeplek == "kolom_9_2") {
		var nummerOpBord = 14
	} else if (huidigeplek == "kolom_8_1" || huidigeplek == "kolom_8_2") {
		var nummerOpBord = 15
	} else if (huidigeplek == "kolom_7_1" || huidigeplek == "kolom_7_2") {
		var nummerOpBord = 16
	} else if (huidigeplek == "kolom_6_1" || huidigeplek == "kolom_6_2") {
		var nummerOpBord = 17
	} else if (huidigeplek == "kolom_5_1" || huidigeplek == "kolom_5_2") {
		var nummerOpBord = 18
	} else if (huidigeplek == "kolom_4_1" || huidigeplek == "kolom_4_2") {
		var nummerOpBord = 19
	} else if (huidigeplek == "kolom_3_1" || huidigeplek == "kolom_3_2") {
		var nummerOpBord = 20
	} else if (huidigeplek == "kolom_1_1") {
		var nummerOpBord = 21
	} else if (huidigeplek == "kolom_1_3" || huidigeplek == "kolom_2_3") {
		var nummerOpBord = 22
	} else if (huidigeplek == "kolom_1_4" || huidigeplek == "kolom_2_4") {
		var nummerOpBord = 23
	} else if (huidigeplek == "kolom_1_5" || huidigeplek == "kolom_2_5") {
		var nummerOpBord = 24
	} else if (huidigeplek == "kolom_1_6" || huidigeplek == "kolom_2_6") {
		var nummerOpBord = 25
	} else if (huidigeplek == "kolom_1_7" || huidigeplek == "kolom_2_7") {
		var nummerOpBord = 26
	} else if (huidigeplek == "kolom_1_8" || huidigeplek == "kolom_2_8") {
		var nummerOpBord = 27
	} else if (huidigeplek == "kolom_1_9" || huidigeplek == "kolom_2_9") {
		var nummerOpBord = 28
	} else if (huidigeplek == "kolom_1_10" || huidigeplek == "kolom_2_10") {
		var nummerOpBord = 29
	} else if (huidigeplek == "kolom_1_11" || huidigeplek == "kolom_2_11") {
		var nummerOpBord = 30
	} else if (huidigeplek == "kolom_1_13") {
		var nummerOpBord = 31
	} else if (huidigeplek == "kolom_3_13" || huidigeplek == "kolom_3_12") {
		var nummerOpBord = 32
	} else if (huidigeplek == "kolom_4_13" || huidigeplek == "kolom_4_12") {
		var nummerOpBord = 33
	} else if (huidigeplek == "kolom_5_13" || huidigeplek == "kolom_5_12") {
		var nummerOpBord = 34
	} else if (huidigeplek == "kolom_6_13" || huidigeplek == "kolom_6_12") {
		var nummerOpBord = 35
	} else if (huidigeplek == "kolom_7_13" || huidigeplek == "kolom_7_12") {
		var nummerOpBord = 36
	} else if (huidigeplek == "kolom_8_13" || huidigeplek == "kolom_8_12") {
		var nummerOpBord = 37
	} else if (huidigeplek == "kolom_9_13" || huidigeplek == "kolom_9_12") {
		var nummerOpBord = 38
	} else if (huidigeplek == "kolom_10_13" || huidigeplek == "kolom_10_12") {
		var nummerOpBord = 39
	} else if (huidigeplek == "kolom_11_13" || huidigeplek == "kolom_11_12") {
		var nummerOpBord = 40
	}

	// Gevangenis
	else if (huidigeplek == "kolom_12_2") {
		var nummerOpBord = 60
	}

	return nummerOpBord
}

function nummerNaarKolom(nieuwpleknummer) {
	if (nieuwpleknummer == 1) {
		var kolomOpBord = "#kolom_13_13"
	} else if (nieuwpleknummer == 2) {
		var kolomOpBord = "#kolom_13_11"
	} else if (nieuwpleknummer == 3) {
		var kolomOpBord = "#kolom_13_10"
	} else if (nieuwpleknummer == 4) {
		var kolomOpBord = "#kolom_13_9"
	} else if (nieuwpleknummer == 5) {
		var kolomOpBord = "#kolom_13_8"
	} else if (nieuwpleknummer == 6) {
		var kolomOpBord = "#kolom_13_7"
	} else if (nieuwpleknummer == 7) {
		var kolomOpBord = "#kolom_13_6"
	} else if (nieuwpleknummer == 8) {
		var kolomOpBord = "#kolom_13_5"
	} else if (nieuwpleknummer == 9) {
		var kolomOpBord = "#kolom_13_4"
	} else if (nieuwpleknummer == 10) {
		var kolomOpBord = "#kolom_13_3"
	} else if (nieuwpleknummer == 11) {
		var kolomOpBord = "#kolom_13_1"
	} else if (nieuwpleknummer == 12) {
		var kolomOpBord = "#kolom_11_1"
	} else if (nieuwpleknummer == 13) {
		var kolomOpBord = "#kolom_10_1"
	} else if (nieuwpleknummer == 14) {
		var kolomOpBord = "#kolom_9_1"
	} else if (nieuwpleknummer == 15) {
		var kolomOpBord = "#kolom_8_1"
	} else if (nieuwpleknummer == 16) {
		var kolomOpBord = "#kolom_7_1"
	} else if (nieuwpleknummer == 17) {
		var kolomOpBord = "#kolom_6_1"
	} else if (nieuwpleknummer == 18) {
		var kolomOpBord = "#kolom_5_1"
	} else if (nieuwpleknummer == 19) {
		var kolomOpBord = "#kolom_4_1"
	} else if (nieuwpleknummer == 20) {
		var kolomOpBord = "#kolom_3_1"
	} else if (nieuwpleknummer == 21) {
		var kolomOpBord = "#kolom_1_1"
	} else if (nieuwpleknummer == 22) {
		var kolomOpBord = "#kolom_1_3"
	} else if (nieuwpleknummer == 23) {
		var kolomOpBord = "#kolom_1_4"
	} else if (nieuwpleknummer == 24) {
		var kolomOpBord = "#kolom_1_5"
	} else if (nieuwpleknummer == 25) {
		var kolomOpBord = "#kolom_1_6"
	} else if (nieuwpleknummer == 26) {
		var kolomOpBord = "#kolom_1_7"
	} else if (nieuwpleknummer == 27) {
		var kolomOpBord = "#kolom_1_8"
	} else if (nieuwpleknummer == 28) {
		var kolomOpBord = "#kolom_1_9"
	} else if (nieuwpleknummer == 29) {
		var kolomOpBord = "#kolom_1_10"
	} else if (nieuwpleknummer == 30) {
		var kolomOpBord = "#kolom_1_11"
	} else if (nieuwpleknummer == 31) {
		var kolomOpBord = "#kolom_1_13"
	} else if (nieuwpleknummer == 32) {
		var kolomOpBord = "#kolom_3_13"
	} else if (nieuwpleknummer == 33) {
		var kolomOpBord = "#kolom_4_13"
	} else if (nieuwpleknummer == 34) {
		var kolomOpBord = "#kolom_5_13"
	} else if (nieuwpleknummer == 35) {
		var kolomOpBord = "#kolom_6_13"
	} else if (nieuwpleknummer == 36) {
		var kolomOpBord = "#kolom_7_13"
	} else if (nieuwpleknummer == 37) {
		var kolomOpBord = "#kolom_8_13"
	} else if (nieuwpleknummer == 38) {
		var kolomOpBord = "#kolom_9_13"
	} else if (nieuwpleknummer == 39) {
		var kolomOpBord = "#kolom_10_13"
	} else if (nieuwpleknummer == 40) {
		var kolomOpBord = "#kolom_11_13"
	} else if (nieuwpleknummer == 41) {
		var kolomOpBord = "#kolom_13_13"
	} else if (nieuwpleknummer == 42) {
		var kolomOpBord = "#kolom_13_11"
	} else if (nieuwpleknummer == 43) {
		var kolomOpBord = "#kolom_13_10"
	} else if (nieuwpleknummer == 44) {
		var kolomOpBord = "#kolom_13_9"
	} else if (nieuwpleknummer == 45) {
		var kolomOpBord = "#kolom_13_8"
	} else if (nieuwpleknummer == 46) {
		var kolomOpBord = "#kolom_13_7"
	} else if (nieuwpleknummer == 47) {
		var kolomOpBord = "#kolom_13_6"
	} else if (nieuwpleknummer == 48) {
		var kolomOpBord = "#kolom_13_5"
	} else if (nieuwpleknummer == 49) {
		var kolomOpBord = "#kolom_13_4"
	} else if (nieuwpleknummer == 50) {
		var kolomOpBord = "#kolom_13_3"
	} else if (nieuwpleknummer == 51) {
		var kolomOpBord = "#kolom_13_1"
	} else if (nieuwpleknummer == 52) {
		var kolomOpBord = "#kolom_11_1"
	}

	// gevangenis
	else if (nieuwpleknummer == 60) {
		var kolomOpBord = "#kolom_12_2"
	}

	return kolomOpBord
}

function vastgoedNaarKolom(nummer) {

	if (nummer == 2) {
		var kolomOpBord = "#kolom_12_11"
	} else if (nummer == 3) {
		var kolomOpBord = "#kolom_12_10"
	} else if (nummer == 4) {
		var kolomOpBord = "#kolom_12_9"
	} else if (nummer == 5) {
		var kolomOpBord = "#kolom_12_8"
	} else if (nummer == 6) {
		var kolomOpBord = "#kolom_12_7"
	} else if (nummer == 7) {
		var kolomOpBord = "#kolom_12_6"
	} else if (nummer == 8) {
		var kolomOpBord = "#kolom_12_5"
	} else if (nummer == 9) {
		var kolomOpBord = "#kolom_12_4"
	} else if (nummer == 10) {
		var kolomOpBord = "#kolom_12_3"
	} else if (nummer == 12) {
		var kolomOpBord = "#kolom_11_2"
	} else if (nummer == 13) {
		var kolomOpBord = "#kolom_10_2"
	} else if (nummer == 14) {
		var kolomOpBord = "#kolom_9_2"
	} else if (nummer == 15) {
		var kolomOpBord = "#kolom_8_2"
	} else if (nummer == 16) {
		var kolomOpBord = "#kolom_7_2"
	} else if (nummer == 17) {
		var kolomOpBord = "#kolom_6_2"
	} else if (nummer == 18) {
		var kolomOpBord = "#kolom_5_2"
	} else if (nummer == 19) {
		var kolomOpBord = "#kolom_4_2"
	} else if (nummer == 20) {
		var kolomOpBord = "#kolom_3_2"
	} else if (nummer == 22) {
		var kolomOpBord = "#kolom_2_3"
	} else if (nummer == 23) {
		var kolomOpBord = "#kolom_2_4"
	} else if (nummer == 24) {
		var kolomOpBord = "#kolom_2_5"
	} else if (nummer == 25) {
		var kolomOpBord = "#kolom_2_6"
	} else if (nummer == 26) {
		var kolomOpBord = "#kolom_2_7"
	} else if (nummer == 27) {
		var kolomOpBord = "#kolom_2_8"
	} else if (nummer == 28) {
		var kolomOpBord = "#kolom_2_9"
	} else if (nummer == 29) {
		var kolomOpBord = "#kolom_2_10"
	} else if (nummer == 30) {
		var kolomOpBord = "#kolom_2_11"
	} else if (nummer == 32) {
		var kolomOpBord = "#kolom_3_12"
	} else if (nummer == 33) {
		var kolomOpBord = "#kolom_4_12"
	} else if (nummer == 34) {
		var kolomOpBord = "#kolom_5_12"
	} else if (nummer == 35) {
		var kolomOpBord = "#kolom_6_12"
	} else if (nummer == 36) {
		var kolomOpBord = "#kolom_7_12"
	} else if (nummer == 37) {
		var kolomOpBord = "#kolom_8_12"
	} else if (nummer == 38) {
		var kolomOpBord = "#kolom_9_12"
	} else if (nummer == 39) {
		var kolomOpBord = "#kolom_10_12"
	} else if (nummer == 40) {
		var kolomOpBord = "#kolom_11_12"
	}


	return kolomOpBord
}

function kleurAchtergrond(plek, speler) {
	var kleurp1 = 'rgba(255,0,0,.3)';
	var kleurp2 = 'rgba(0,255,0,.3)';
	var kleurp3 = 'rgba(0,0,255,.3)';
	var kleurp4 = 'rgba(255,255,0,.3)';

	var kleurhypotheekp1 = 'repeating-linear-gradient(45deg,rgba(255,0,0,.3),rgba(255,0,0,.3) 5%,rgba(21,21,21, 0.8) 5%,rgba(21,21,21, 0.8) 10%)'
	var kleurhypotheekp2 = 'repeating-linear-gradient(45deg,rgba(0,255,0,.3),rgba(0,255,0,.3) 5%,rgba(21,21,21, 0.8) 5%,rgba(21,21,21, 0.8) 10%)'
	var kleurhypotheekp3 = 'repeating-linear-gradient(45deg,rgba(0,0,255,.3),rgba(0,0,255,.3) 5%,rgba(21,21,21, 0.8) 5%,rgba(21,21,21, 0.8) 10%)'
	var kleurhypotheekp4 = 'repeating-linear-gradient(45deg,rgba(255,255,0,.3),rgba(255,255,0,.3) 5%,rgba(21,21,21, 0.8) 5%,rgba(21,21,21, 0.8) 10%)'

	if (plek == 2) {
		var kolomA = "#kolom_13_11"
		var kolomB = "#kolom_12_11"
	} else if (plek == 3) {
		var kolomA = "#kolom_13_10"
		var kolomB = "#kolom_12_10"
	} else if (plek == 4) {
		var kolomA = "#kolom_13_9"
		var kolomB = "#kolom_12_9"
	} else if (plek == 5) {
		var kolomA = "#kolom_13_8"
		var kolomB = "#kolom_12_8"
	} else if (plek == 6) {
		var kolomA = "#kolom_13_7"
		var kolomB = "#kolom_12_7"
	} else if (plek == 7) {
		var kolomA = "#kolom_13_6"
		var kolomB = "#kolom_12_6"
	} else if (plek == 8) {
		var kolomA = "#kolom_13_5"
		var kolomB = "#kolom_12_5"
	} else if (plek == 9) {
		var kolomA = "#kolom_13_4"
		var kolomB = "#kolom_12_4"
	} else if (plek == 10) {
		var kolomA = "#kolom_13_3"
		var kolomB = "#kolom_12_3"
	} else if (plek == 12) {
		var kolomA = "#kolom_11_1"
		var kolomB = "#kolom_11_2"
	} else if (plek == 13) {
		var kolomA = "#kolom_10_1"
		var kolomB = "#kolom_10_2"
	} else if (plek == 14) {
		var kolomA = "#kolom_9_1"
		var kolomB = "#kolom_9_2"
	} else if (plek == 15) {
		var kolomA = "#kolom_8_1"
		var kolomB = "#kolom_8_2"
	} else if (plek == 16) {
		var kolomA = "#kolom_7_1"
		var kolomB = "#kolom_7_2"
	} else if (plek == 17) {
		var kolomA = "#kolom_6_1"
		var kolomB = "#kolom_6_2"
	} else if (plek == 18) {
		var kolomA = "#kolom_5_1"
		var kolomB = "#kolom_5_2"
	} else if (plek == 19) {
		var kolomA = "#kolom_4_1"
		var kolomB = "#kolom_4_2"
	} else if (plek == 20) {
		var kolomA = "#kolom_3_1"
		var kolomB = "#kolom_3_2"
	} else if (plek == 22) {
		var kolomA = "#kolom_1_3"
		var kolomB = "#kolom_2_3"
	} else if (plek == 23) {
		var kolomA = "#kolom_1_4"
		var kolomB = "#kolom_2_4"
	} else if (plek == 24) {
		var kolomA = "#kolom_1_5"
		var kolomB = "#kolom_2_5"
	} else if (plek == 25) {
		var kolomA = "#kolom_1_6"
		var kolomB = "#kolom_2_6"
	} else if (plek == 26) {
		var kolomA = "#kolom_1_7"
		var kolomB = "#kolom_2_7"
	} else if (plek == 27) {
		var kolomA = "#kolom_1_8"
		var kolomB = "#kolom_2_8"
	} else if (plek == 28) {
		var kolomA = "#kolom_1_9"
		var kolomB = "#kolom_2_9"
	} else if (plek == 29) {
		var kolomA = "#kolom_1_10"
		var kolomB = "#kolom_2_10"
	} else if (plek == 30) {
		var kolomA = "#kolom_1_11"
		var kolomB = "#kolom_2_11"
	} else if (plek == 32) {
		var kolomA = "#kolom_3_13"
		var kolomB = "#kolom_3_12"
	} else if (plek == 33) {
		var kolomA = "#kolom_4_13"
		var kolomB = "#kolom_4_12"
	} else if (plek == 34) {
		var kolomA = "#kolom_5_13"
		var kolomB = "#kolom_5_12"
	} else if (plek == 35) {
		var kolomA = "#kolom_6_13"
		var kolomB = "#kolom_6_12"
	} else if (plek == 36) {
		var kolomA = "#kolom_7_13"
		var kolomB = "#kolom_7_12"
	} else if (plek == 37) {
		var kolomA = "#kolom_8_13"
		var kolomB = "#kolom_8_12"
	} else if (plek == 38) {
		var kolomA = "#kolom_9_13"
		var kolomB = "#kolom_9_12"
	} else if (plek == 39) {
		var kolomA = "#kolom_10_13"
		var kolomB = "#kolom_10_12"
	} else if (plek == 40) {
		var kolomA = "#kolom_11_13"
		var kolomB = "#kolom_11_12"
	}


	// stel achtergrond kleur in
	if (speler == 0) {
		$(kolomA).css("background", "");
		$(kolomB).css("background", "");
	}
	if (speler == 1 && handel[plek].hypotheek == false) {
		$(kolomA).css("background", kleurp1);
		$(kolomB).css("background", kleurp1);
	} else if (speler == 2 && handel[plek].hypotheek == false) {
		$(kolomA).css("background", kleurp2);
		$(kolomB).css("background", kleurp2);
	} else if (speler == 3 && handel[plek].hypotheek == false) {
		$(kolomA).css("background", kleurp3);
		$(kolomB).css("background", kleurp3);
	} else if (speler == 4 && handel[plek].hypotheek == false) {
		$(kolomA).css("background", kleurp4);
		$(kolomB).css("background", kleurp4);
	}
	if (speler == 1 && handel[plek].hypotheek == true) {
		$(kolomA).css("background", kleurhypotheekp1);
		$(kolomB).css("background", kleurhypotheekp1);
	} else if (speler == 2 && handel[plek].hypotheek == true) {
		$(kolomA).css("background", kleurhypotheekp2);
		$(kolomB).css("background", kleurhypotheekp2);
	} else if (speler == 3 && handel[plek].hypotheek == true) {
		$(kolomA).css("background", kleurhypotheekp3);
		$(kolomB).css("background", kleurhypotheekp3);
	} else if (speler == 4 && handel[plek].hypotheek == true) {
		$(kolomA).css("background", kleurhypotheekp4);
		$(kolomB).css("background", kleurhypotheekp4);
	}
}



// GOOIEN met de dobbelstenen
var ANGLE = {
	1: {
		x: -10,
		y: -10,
		z: 0
	},
	2: {
		x: -10,
		y: 260,
		z: 0
	},
	3: {
		x: 80,
		y: 0,
		z: 10
	},
	4: {
		x: 260,
		y: 0,
		z: -10
	},
	5: {
		x: 260,
		y: 0,
		z: 80
	},
	6: {
		x: -10,
		y: 170,
		z: 90
	}
};
var AantalOgen = 0
var dubbelGegooid = false
var dubbelGegooidTeller = 0
var dices = Array.prototype.slice.call(document.querySelectorAll('.cubic'));
var speed = 3000;

var angleGenerator = function angleGenerator() {
	var factor = Math.floor(1 + Math.random() * 6);
	// check of er dubbel is gegooid
	if (AantalOgen > 0) {
		if (AantalOgen == factor) {
			dubbelGegooid = true;
		} else {
			dubbelGegooid = false;
		}
	}

	AantalOgen = AantalOgen + factor

	var _ANGLE$factor = ANGLE[factor],
		x = _ANGLE$factor.x,
		y = _ANGLE$factor.y,
		z = _ANGLE$factor.z;

	return {
		x: x + 3600,
		y: y + 3600,
		z: z + 3600,
	};
};

var roll = function roll() {
	AantalOgen = 0;
	dubbelGegooid = false;

	new Audio(audioDiceRoll).play();


	dices.forEach(function (dice) {
		var _angleGenerator = angleGenerator(),
			x = _angleGenerator.x,
			y = _angleGenerator.y,
			z = _angleGenerator.z;
		dice.style.cssText = '\n            -webkit-transform: none;\n                    transform: none;\n        ';

		setTimeout(function () {
			// request render
			dice.style.cssText = '\n                -webkit-transition-duration: ' + speed + 'ms;\n                        transition-duration: ' + speed + 'ms;\n                -webkit-transform: rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(' + z + 'deg);\n                        transform: rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(' + z + 'deg);\n            ';
		}, 10);
	});
	return {
		ogen: AantalOgen,
		dubbel: dubbelGegooid
	}
};


volgendeSpeler = function () {
	actieveSpeler++

	if (actieveSpeler > 4) {
		actieveSpeler = 1
	}


	if (data[actieveSpeler].actief) {
		// overzichtsbalk maak speler actief
		var overzichtspeler = '#overzichtspeler' + actieveSpeler
		$(".overzichtspelers").addClass("nietactief");
		$(overzichtspeler).removeClass("nietactief");
		updateGeld()
	} else {
		volgendeSpeler();
	}
	geselecteerdekaart = null;
	geselecteerdekaartkant = 0;
	dubbelGegooidTeller = 0
	updateSpelersKaarten();
	updateRuilPartners();
}

updateGeld = function () {
	//voer geld door hoofdpagina	
	$("#spelersBudgetDetailInvullen").html("&euro; " + data[actieveSpeler].geld);
	$("#spelersNaamDetail").html(data[actieveSpeler].naam);
	$("#ruilennaam_1").html(data[actieveSpeler].naam);

	if (actieveSpeler == 1) {
		$("#spelersNaamDetail").css("background-color", kleurspeler1);
	} else if (actieveSpeler == 2) {
		$("#spelersNaamDetail").css("background-color", kleurspeler2);
	} else if (actieveSpeler == 3) {
		$("#spelersNaamDetail").css("background-color", kleurspeler3);
	} else if (actieveSpeler == 4) {
		$("#spelersNaamDetail").css("background-color", kleurspeler4);
	}

	// Voer geld door bovenbalk
	for (var i = 1; i <= 4; i++) {
		spelerbudgetbovenbalk = "#spelersBudget" + i
		$(spelerbudgetbovenbalk).html("<strong>&euro; " + data[i].geld + "</strong>");
	}
	$("#vrijParkerenGeld > p").html("<strong>&euro; " + handel[21].prijs + "</strong>");
}


WatTeDoenOpDitVeld = function () {
	$("#actieKopen ,#actieBetalen ,#koopknop ,#betaalknop ,#kaartKopen ,#kaartNietKopen ,#koopInfo ,#algemeneInfo ,#GevangenisKnop").hide();

	var VSpeler = "#speler" + actieveSpeler
	// vindt de parent div van speler
	var huidigeplek = $(VSpeler).parent().attr("id");
	var huidigepleknummer = kolomNaarNummer(huidigeplek)
	// vind de informatie over de huidige plek
	var handelinfo = handel[huidigepleknummer]
	var prijs = Math.abs(handelinfo.prijs)

	if (handel[huidigepleknummer].eigenaar == actieveSpeler) {
		$("#algemeneInfo").show();
		$('#spelTitel').html("In bezit")
		$("#algemeneInfoText").html("Je hebt deze plek in bezit! Rust lekker uit of versterk je positie op het veld.");
	} else {

		// speler kan de kaart kopen
		if (handelinfo.beschikbaar && handelinfo.tekoop) {
			// Juiste velden actieveren
			$("#actieKopen").show();
			$("#kaartKopen").show();
			$("#kaartNietKopen").show();
			$("#koopInfo").show();
			$('#koopknop').show();

			$('#spelTitel').html("Kopen?")
			$("#koopNaam").html("<strong>" + handelinfo.naam + "</strong>");
			$("#koopPrijs").html("Prijs: <strong>&euro;" + prijs + "</strong>");
			$('#handelImg').prop('src', handelinfo.img);
		}

		// speler moet huurbetalen aan andere speler
		if (handelinfo.beschikbaar && !handelinfo.tekoop) {

			if (handelinfo.hypotheek) {
				$('#spelTitel').html("OP HYPOTHEEK")
				$("#algemeneInfo").show();
				$("#algemeneInfoText").html("Je hebt geluk, " + handelinfo.naam + "  staat op hypotheek!");
			} else {
				var huurprijs = checkHoeveelBetalen()
				$("#actieBetalen").show();
				$('#betaalknop').show();
				$('#betaalInfo').show();
				$('#spelTitel').html("BETALEN")

				if (handel[huidigepleknummer].huur.length == 6) {
					$("#betaalInfo").html("Je moet de huur voor je verblijf betalen aan " + data[handelinfo.eigenaar].naam + ". De kosten zijn: <strong>&euro;" + huurprijs + "</strong>");
				} else if (handel[huidigepleknummer].huur.length == 4) {
					$("#betaalInfo").html("De trein is niet goedkoop. Betaal: <strong>&euro;" + huurprijs + "</strong> aan " + data[handelinfo.eigenaar].naam);
				} else if (huidigepleknummer == 13 || huidigepleknummer == 29) {
					var beidenutsbedrijven = isHeleStraatvanZelfdeEigenaar(huidigepleknummer)
					if (beidenutsbedrijven) {
						$("#betaalInfo").html("<p>Je moet betalen voor sociale voorzieningen. Betaal: <strong>&euro;" + huurprijs + "</strong> aan " + data[handelinfo.eigenaar].naam + " omdat hij beide nutsbedrijven heeft.</p>");

					} else {
						$("#betaalInfo").html("<p>Je moet betalen voor sociale voorzieningen. Betaal: <strong>&euro;" + huurprijs + "</strong> aan " + data[handelinfo.eigenaar].naam + " voor enkel '" + handelinfo.naam + "'.</p>");

					}
				}
			}

		}

		// speler moet belasting betalen
		if (!handelinfo.beschikbaar && !handelinfo.tekoop && handelinfo.prijs < 0) {
			$('#spelTitel').html(handelinfo.naam)
			// Juiste velden activeren
			$("#algemeneInfo").show();
			$("#algemeneInfoText").html("Je moet belasting betalen voor een totaal van <strong>&euro;" + prijs + "</strong>");

			$("#koopPrijs").html("Kosten: <strong>&euro;" + prijs + "</strong>");
			handelVerwerken("betalen")
		}

		// Slechts op bezoek
		if (huidigepleknummer == 11) {
			$('#spelTitel').html("Slechts op bezoek")
			$("#algemeneInfo").show();
			$("#algemeneInfoText").html("Je bent op bezoek in de gevangenis. Kijk lekker rond!");
		}
		// Vrij Parkeren
		if (huidigepleknummer == 21) {
			$('#spelTitel').html("Vrij parkeren!!!")
			$("#algemeneInfo").show();
			$("#algemeneInfoText").html("Wat een geluk! Je mag vrij parkeren! <br> Daarnaast verdien je ook nog: <strong>&euro;" + prijs + "</strong>");
			handelVerwerken("vrijParkeren")
		}
		// Naar de gevangenis
		if (huidigepleknummer == 31) {
			$('#spelTitel').html("Naar het gevang!")
			$("#algemeneInfo").show();
			$("#algemeneInfoText").html("Houdt de dief! Je moet direct naar de gevangenis");
			gevangenis();
		}
		// Start
		if (huidigepleknummer == 1) {
			$('#spelTitel').html("Start")
			$("#algemeneInfo").show();
			$("#algemeneInfoText").html("Je staat op start. Lekker even uitrusten!");
		}

		// Kanskaart
		if (handelinfo.naam == "Kans") {
			$("#algemeneInfo").show();
			var randomK = Math.floor((Math.random() * kansKaarten.length));
			var kanskaart = kansKaarten[randomK]

			$('#spelTitel').html(kanskaart.naam)
			$("#algemeneInfoText").html(kanskaart.bericht);

			handelVerwerken("actiekaart", kanskaart)
		}

		// Algemeen fonds
		if (handelinfo.naam == "Algemeen fonds") {
			$("#algemeneInfo").show();
			var randomAF = Math.floor((Math.random() * algemeenfondsKaarten.length));
			var afkaart = algemeenfondsKaarten[randomAF]

			$('#spelTitel').html(afkaart.naam)
			$("#algemeneInfoText").html(afkaart.bericht);

			handelVerwerken("actiekaart", afkaart)
		}

		// Gevangenis
		if (handelinfo.naam == "Gevangenis") {
			$("#algemeneInfo").show();
			$('#spelTitel').html("Gevangenis")
			if (data[actieveSpeler].gevangenisWorpen == 3 && !dubbelGegooid) {
				$("#algemeneInfoText").html("Je hebt weer niet dubbel gegooid. Betaal nu <strong>&euro; 50</strong>! Je bent wel per direct vrijgelaten en mag volgende beurt weer verder.");
				handelVerwerken("gevangenis")
			} else {
				$("#GevangenisKnop").show();
				$("#algemeneInfoText").html("Je zit in de gevangenis. Je hebt zojuist <strong>niet</strong> dubbel gegooid. Je hebt nog " + (3 - data[actieveSpeler].gevangenisWorpen) + " keer om het te proberen.");
			}
		}
	}

}

handelVerwerken = function (actie, object) {
	var dataSpeler = data[actieveSpeler]
	var VSpeler = "#speler" + actieveSpeler
	// vindt de parent div van speler
	var huidigeplek = $(VSpeler).parent().attr("id");
	var huidigepleknummer = kolomNaarNummer(huidigeplek)
	// vind de informatie over de huidige plek
	var handelinfo = handel[huidigepleknummer]

	if (actie == "kopen") {
		// Haal geld van rekening
		dataSpeler.geld = dataSpeler.geld + handelinfo.prijs
		// zet bezit op naam en haal handel van de markt
		dataSpeler.bezit.push(huidigepleknummer);
		handelinfo.eigenaar = actieveSpeler;
		handelinfo.tekoop = false;
		kleurAchtergrond(huidigepleknummer, actieveSpeler)
	}
	if (actie == "betalen") {
		bedrag = checkHoeveelBetalen()

		// haal geld van rekening
		dataSpeler.geld -= bedrag
		handel[21].prijs += bedrag
		// zet geld op rekening van eigenaar
		if (handelinfo.eigenaar) {
			handel[21].prijs -= bedrag
			data[handelinfo.eigenaar].geld += bedrag
		}
	}
	if (actie == "actiekaart") {
		dataSpeler.geld = dataSpeler.geld + object.prijsHuidigeSpeler

		for (var i = 1; i <= 4; i++) {
			if (!(i == actieveSpeler)) {
				data[i].geld = data[i].geld + object.prijsAndereSpeler
			}
		}
		// Als er moet worden betaalt schrijf dan geld bij naar 'vrij parkeren'
		if (object.prijsHuidigeSpeler < 0) {
			handel[21].prijs += Math.abs(object.prijsHuidigeSpeler)
		}
		// als een kans- algemeenfondskaartje een actie heeft
		if (object.functie) {
			object.functie()
		}
		// als een kans- algemeenfondskaartje een verplaating heeft
		if (object.verplaatsspeler) {
			setTimeout(function () {
				var nieuwKolom = nummerNaarKolom(object.nieuweplek)
				$(VSpeler).appendTo(nieuwKolom);

				setTimeout(function () {
					$("#versterken").hide("fast", function () {
						$("#kopen").show("fast", function () {
							$("#stapVersterken").removeClass("list-group-item-primary")
							$("#stapKopen").addClass("list-group-item-warning")
							WatTeDoenOpDitVeld()
						});
					});
				}, 1000);
			}, 3000);
		}
	}
	if (actie == "gevangenis") {
		dataSpeler.geld -= 50;
		handel[21].prijs += 50

		dataSpeler.vrijgelaten = true;
	}
	if (actie == "vrijParkeren") {
		dataSpeler.geld += handel[21].prijs
		handel[21].prijs = 0
	}
	if (actie == "huizen") {
		dataSpeler.geld += straatinfoTotaal["aantal"] * handel[ClickKolomNummer].huis
		Object.keys(straatinfo).forEach(function (key) {
			straatinfoTotaal["aantal"] += Number(straatinfo[key].huizen)

			var aantalHuizenPlaatsen = straatinfo[key].huizen + handel[key].huizen

			vastgoedBeheer(aantalHuizenPlaatsen, key)
			handel[key].huizen = aantalHuizenPlaatsen
		});
	}
	updateGeld()
	updateSpelersKaarten()
}

isHeleStraatvanZelfdeEigenaar = function (nummer) {
	var handelinfo = handel[nummer]
	var Straat = []
	var heleStraat = true

	if (handelinfo.eigenaar == null) {
		return false
	} else {

		Object.keys(handel).forEach(function (key) {
			if (handel[key].serieNR == handelinfo.serieNR) {
				Straat.push(handel[key])
			}
		});

		Straat.forEach(function (obj) {
			if (obj.eigenaar != Straat[0].eigenaar) {
				heleStraat = false
			}
		});

		if (heleStraat) {
			return true
		} else {
			return false
		}
	}
}

hoeveelVanSerie = function (nummer) {
	var handelinfo = handel[nummer]
	var serie = []
	var serievaneigenaar = []


	Object.keys(handel).forEach(function (key) {
		if (handel[key].serieNR == handelinfo.serieNR) {
			serie.push(handel[key])
		}
	});

	serie.forEach(function (obj) {
		if (obj.eigenaar === handelinfo.eigenaar) {
			serievaneigenaar.push(obj.eigenaar);
		}
	});

	return serievaneigenaar.length

}

staanErNogHuizenOpStraat = function (serieNRStraat) {
	var aantalhuizenomteverkopen = 0

	Object.keys(handel).forEach(function (key) {
		if (handel[key].serieNR == serieNRStraat) {

			if (handel[key].huizen > 0) {
				aantalhuizenomteverkopen += handel[key].huizen
			}
		}
	});

	if (aantalhuizenomteverkopen > 0) {
		return true
	} else {
		return false
	}
}

staanErNogStratenOpHypotheek = function (serieNRStraat) {
	var stratenophypotheek = 0

	Object.keys(handel).forEach(function (key) {
		if (handel[key].serieNR == serieNRStraat) {

			if (handel[key].hypotheek) {
				stratenophypotheek++
			}
		}
	});

	if (stratenophypotheek > 0) {
		return true
	} else {
		return false
	}
}

checkHoeveelBetalen = function () {
	var dataSpeler = data[actieveSpeler]
	var VSpeler = "#speler" + actieveSpeler
	// vindt de parent div van speler
	var huidigeplek = $(VSpeler).parent().attr("id");
	var huidigepleknummer = kolomNaarNummer(huidigeplek)
	var handelinfo = handel[huidigepleknummer]
	var aantalhuizen = handelinfo.huizen

	// BELASTING
	if (!handelinfo.beschikbaar && !handelinfo.tekoop && handelinfo.prijs < 0) {
		return Math.abs(handelinfo.prijs)
	}


	// HUUR
	if (handel[huidigepleknummer].huur.length == 6) {
		var heleStraat = isHeleStraatvanZelfdeEigenaar(huidigepleknummer)

		// HELE straat en geen huizen
		if (heleStraat && handelinfo.huizen == 0) {
			return handelinfo.huur[aantalhuizen] * 2
		} else {

			return handelinfo.huur[aantalhuizen]
		}
	}

	// STATIONS
	if (handel[huidigepleknummer].huur.length == 4) {
		var stationinbezit = hoeveelVanSerie(huidigepleknummer) - 1
		return handelinfo.huur[stationinbezit]
	}

	// NUTSBEDRIJVEN
	if (handel[huidigepleknummer].huur.length == 0) {
		var aantalnutsbedrijven = hoeveelVanSerie(huidigepleknummer)
		if (aantalnutsbedrijven == 1) {
			return uitkomstWorp.ogen * 4
		} else {
			return uitkomstWorp.ogen * 10
		}
	}
}

gevangenis = function () {
	var dataSpeler = data[actieveSpeler]
	var VSpeler = "#speler" + actieveSpeler
	var gevangenis = nummerNaarKolom(60)

	if (!dataSpeler.gevangenis) {
		$(VSpeler).appendTo(gevangenis);
		dataSpeler.gevangenis = true
	} else if (dataSpeler.gevangenisWorpen < 3) {
		dataSpeler.gevangenisWorpen++

	} else if (dataSpeler.gevangenisWorpen == 3 && !dubbelGegooid) {
		handelVerwerken("gevangenis")
	}
}

updateSpelersKaarten = function () {
	var plek_serie = []
	$("#spelerskaarten_tr").empty();

	// bekijk welke serie er is gekoppelt aan de straten
	data[actieveSpeler].bezit.forEach(function (plek) {
		plek_serie.push(handel[plek].serieNR)
	});

	// haal dubbel serie nummers weg
	Array.prototype.unique = function () {
		return this.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		});
	}

	// maak straat kolommen
	var straten = plek_serie.unique();
	straten.forEach(function (nr) {
		$("#spelerskaarten_tr").append("<td id='serie" + nr + "' class='spelerskaarten_td'></td>");
	});

	// Plaats
	var hoogteindex = 100
	data[actieveSpeler].bezit.forEach(function (plek) {
		$("#serie" + handel[plek].serieNR).append("<img class='spelerskaarten_img' src='" + handel[plek].img + "' class='spelerskaarten_img'></img>");

		$('#spelerskaarten_img' + plek).css("z-index", hoogteindex);
		hoogteindex++
	});

	// maak breedte van straten
	// bepaal de afstand tussen de kaarten afhankelijk van de hoeveelheid
	if (straten.length <= 3) {
		var breedte_tabel = ($("#spelerskaarten").width() / straten.length) - (straten.length * 10)
	}
	if (straten.length > 3 && straten.length <= 5) {
		var breedte_tabel = ($("#spelerskaarten").width() / straten.length) - (straten.length * 5)
	}
	if (straten.length > 5) {
		var breedte_tabel = ($("#spelerskaarten").width() / straten.length) - (straten.length * 3)
	}
	$(".spelerskaarten_img").css("width", breedte_tabel);
	$(".spelerskaarten_td").each(function (index) {
		$(this).find("img:eq(1)").css("margin-top", breedte_tabel / 3);
		$(this).find("img:eq(2)").css("margin-top", (breedte_tabel / 3) * 2);
		$(this).find("img:eq(3)").css("margin-top", (breedte_tabel / 3) * 3);
	});
}

updateRuilPartners = function () {
	$("#ruilennaam_2").empty()
	$("#ruilennaam_2").append("<option selected disabled>Kiezen...</option>")

	Object.keys(data).forEach(function (key) {
		if (key != actieveSpeler) {
			$("#ruilennaam_2").append("<option value='" + key + "'>" + data[key].naam + "</option>")
		}
	});
}



vastgoedBeheer = function (aantalhuizen, plek) {
	vastgoedKolom = vastgoedNaarKolom(plek)

	$(vastgoedKolom).empty();

	var maat = 0
	var paddingclass = ""
	var blockclass = ""



	// check of er een block property moet worden toegevoegd
	if (plek > 11 && plek < 21 || plek > 31 && plek < 41) {
		blockclass = "d-block"
	} else {
		if (aantalhuizen <= 4) {
			paddingclass = "vastgoedDIVPadding"
		}
	}


	// maak kolom
	$(vastgoedKolom).append("<div id='vastgoedDIV_" + plek + "' class='vastgoedDIV'></div>");
	var breedte = $(".vastgoedDIV").width()
	var hoogte = $(".vastgoedDIV").height()

	// check de breedte van een cell
	if (breedte > hoogte) {
		maat = hoogte
	} else {
		maat = breedte
	}

	// plaats huizen
	if (aantalhuizen <= 4) {

		for (var i = 0; i < aantalhuizen; i++) {
			$("#vastgoedDIV_" + plek).append("<img src='img/huis.png' class='huisIcon " + blockclass + paddingclass + "'></img>");
		}
		$(".huisIcon").css("width", maat / 2);
	}

	// plaats hotels
	else {
		$("#vastgoedDIV_" + plek).append("<img src='img/hotel.png' class='hotelIcon'></img>");
		$(".hotelIcon").css("width", maat);
	}
}


var rangeSlider = function () {
	var slider = $('.range-slider'),
		range = $('.range-slider__range'),
		value = $('.range-slider__value');

	slider.each(function () {

		value.each(function () {
			var value = $(this).prev().attr('value');
			$(this).html(value);
		});

		range.on('input', function () {
			$('.range-slider__value').html(this.value);
		});
	});
};


checkOfFailliet = function (speler) {
	if (data[speler].geld < 0) {
		return true
	} else {
		return false
	}
}

hebbenWeEenWinnaar = function (speler) {
	var aantalSpelendeSpelers = []
	var WINNAAR
	Object.keys(data).forEach(function (key) {
		if (data[key].actief == true) {
			aantalSpelendeSpelers.push(key)
		}
	});
	if (aantalSpelendeSpelers.length < 2) {
		WINNAAR = aantalSpelendeSpelers[0]
		new Audio(audioVictory).play();
		bootbox.alert({
			message: "<div class='row'><div class='col-4'>" +
				"<img src='img/mrmono_show_rechts.png' class='img-fluid'>" +
				"</div><div class='col-8 py-5 px-0'>" +
				"<h5 class='text-center'>We hebben een winnaar</h5>" +
				"<h3 class='text-center'>" + data[WINNAAR].naam + "</h3>" +
				"<p class='text-center pt-5'>Van harte gefeliciteerd met de overwinning! Je hebt terecht gewonnen en erg goed gespeeld!</p>" +
				"<p class='text-center'>Nog een potje?</p>" +
				"</div></div>",
			size: 'large',
			buttons: {
				ok: {
					label: 'JAAAAAAA...',
					className: 'btn-success'
				}
			},
			callback: function () {
				location.reload();
			}
		});
	}
}

VerwerkHandel = function () {
	var ruilspeler = $("#ruilennaam_2").val()
	var kaart1 = Number(($('#ruilHuidigeSpeler_plus').attr('src')).replace(/\D/g, ''));
	var kaart2 = Number(($('#ruilAndereSpeler_plus').attr('src')).replace(/\D/g, ''));
	var geld1 = Number($("#ruil_geld_1").val());
	var geld2 = Number($("#ruil_geld_2").val());



	// verwerk geld
	data[actieveSpeler].geld -= geld1
	data[actieveSpeler].geld += geld2
	data[ruilspeler].geld -= geld2
	data[ruilspeler].geld += geld1

	// verwerk kaarten
	if (kaart1 > 0 || handel[kaart1].huizen == 0) {
		// Verwissel kaart eigenaar op 'handel' niveau
		handel[Number(kaart1)].eigenaar = Number(ruilspeler)
		// Verwissel achtergrondkleur
		kleurAchtergrond(kaart1, ruilspeler)
		// Verwissel kaart eigenaar op 'data' niveau
		data[actieveSpeler].bezit = jQuery.grep(data[actieveSpeler].bezit, function (value) {
			return value != kaart1;
		});
		data[ruilspeler].bezit.push(kaart1)
	}
	if (kaart2 > 0 || handel[kaart2].huizen == 0) {
		// Verwissel kaart eigenaar op 'handel' niveau
		handel[Number(kaart2)].eigenaar = Number(actieveSpeler)
		// Verwissel achtergrondkleur
		kleurAchtergrond(kaart2, actieveSpeler)
		// Verwissel kaart eigenaar op 'data' niveau
		data[ruilspeler].bezit = jQuery.grep(data[ruilspeler].bezit, function (value) {
			return value != kaart2;
		});
		data[actieveSpeler].bezit.push(kaart2)
	}

	updateGeld();
	updateSpelersKaarten()
}


// full screen
var enterFullscreen = function (el) {
	if (el.requestFullscreen) {
		el.requestFullscreen();
	} else if (el.msRequestFullscreen) {
		el.msRequestFullscreen();
	} else if (el.mozRequestFullScreen) {
		el.mozRequestFullScreen();
	} else if (el.webkitRequestFullscreen) {
		el.webkitRequestFullscreen();
	} else {
		noFullscreenSupport();
	}
	PasBordAan()
};

var exitFullscreen = function () {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else {
		noFullscreenSupport();
	}
	PasBordAan()
};

var noFullscreenSupport = function () {
	alert('Your browser does not support the Fullscreen API.');
};

$("#fullscreen-button").click(function (e) {

	new Audio(audioClick).play();
	e.preventDefault();
	if ((window.innerWidth === screen.width && window.innerHeight === screen.height) || (window.fullScreen)) {
		exitFullscreen();
	} else {
		enterFullscreen(document.documentElement);
	}

	$("i", this).toggleClass("fa-expand fa-compress");
});

var audioMuted = false
$("#sound-button").click(function (e) {


	if (audioMuted) {
		audioDiceRoll = "sounds/diceRoll.mp3";
		audioClick = "sounds/click.mp3";
		audioBord = "sounds/bord.mp3";
		audioVictory = "sounds/victory.mp3";
		new Audio(audioClick).play();
		audioMuted = false;
	} else {
		audioDiceRoll = "sounds/null.mp3";
		audioClick = "sounds/null.mp3";
		audioBord = "sounds/null.mp3";
		audioVictory = "sounds/null.mp3";

		audioMuted = true;
	}


	$("i", this).toggleClass("fa-volume-up fa-volume-off");
});

$("#newgame-button").click(function (e) {
	new Audio(audioClick).play();
	bootbox.confirm({
		message: "<div class='row'><div class='col-6'>" +
			"<img src='img/mrmono_schrik.png' class='img-fluid'>" +
			"</div><div class='col-6 py-5 px-0'>" +
			"<h5 class='text-center'>Wil je herstarten?</h5>" +
			"<p class='text-center'>Wil je stoppen met het huidige spel en opnieuw beginnen?</p>" +
			"</div></div>",
		buttons: {
			confirm: {
				label: 'Ja doe maar',
				className: 'btn-success'
			},
			cancel: {
				label: 'Onee, toch niet',
				className: 'btn-danger'
			}
		},
		callback: function (result) {
			new Audio(audioClick).play();
			if (result) {
				location.reload();
			}
		}
	});

});