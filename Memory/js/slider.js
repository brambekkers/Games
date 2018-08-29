$('.pagenation').on('click', function() {
  $('.pagenation').removeClass('is-active');
  $(this).addClass('is-active');
})

// SLIDER bolletjes //

$('.page-01').on('click', function() {
  $('.block').removeClass('is-active');
  $('.block-01').addClass('is-active');
  // $('.block-01').addClass('animate-out');
  $('.pagenation').removeClass('is-active');
  $('.page-01').addClass('is-active');
})

$('.page-02').on('click', function() {
  $('.block').removeClass('is-active');
  $('.block-02').addClass('is-active');
  // $('.block-03').addClass('animate-out');
   $('.pagenation').removeClass('is-active');
  $('.page-02').addClass('is-active');
})

$('.page-03').on('click', function() {
  $('.block').removeClass('is-active');
  $('.block-03').addClass('is-active');
  // $('.block-03').addClass('animate-out');
   $('.pagenation').removeClass('is-active');
  $('.page-03').addClass('is-active');
})

$('.page-04').on('click', function() {
  $('.block').removeClass('is-active');
  $('.block-04').addClass('is-active');
  // $('.block-03').addClass('animate-out');
   $('.pagenation').removeClass('is-active');
  $('.page-04').addClass('is-active');
  $(".main_gegevens").delay(1000).fadeOut(2000).promise().done(function(){
     $(".container-fluid").fadeIn(1500);
  });
});
// EINDE SLIDER bolletjes //


// NAMEN INVOEREN //
var namen = document.querySelector("#namen")
namen.addEventListener("click", function(){
  voernamenin()
  wieisaandebeurt.textContent = speler1;
});
// EINDE NAMEN INVOEREN//


// HOEVEELHEID KAARTEN

kaarten.addEventListener("click", function(){
  var spelschuif  = document.querySelector("#spelschuif").value;
  speltype = Number(spelschuif)
  nieuwspel()
});
// EINDE HOEVEELHEID KAARTEN//


// SPELFUNCTIES //
$('.spelbutton-01').on('click', function() {
  $('.spelbutton').removeClass('is-active');
  $('.spelbutton-01').addClass('is-active');

  var speltype = $('#kaarttype1').text().toLowerCase();
  kaart_type = speltype
  kaarttypeuitzetten()

  document.body.style.backgroundImage = "url('./img/background_honden.jpg')"
})

$('.spelbutton-02').on('click', function() {
  $('.spelbutton').removeClass('is-active');
  $('.spelbutton-02').addClass('is-active');

  var speltype = $('#kaarttype2').text().toLowerCase();
  kaart_type = speltype
  kaarttypeuitzetten()

  document.body.style.backgroundImage = "url('./img/background_katten.jpg')"
})

$('.spelbutton-03').on('click', function() {
  $('.spelbutton').removeClass('is-active');
  $('.spelbutton-03').addClass('is-active');

  var speltype = $('#kaarttype3').text().toLowerCase();
  kaart_type = speltype
  kaarttypeuitzetten()

  document.body.style.backgroundImage = "url('./img/background_babys.jpg')"
})

$('.spelbutton-04').on('click', function() {
  $('.spelbutton').removeClass('is-active');
  $('.spelbutton-04').addClass('is-active');

  var speltype = $('#kaarttype4').text().toLowerCase();
  kaart_type = speltype
  kaarttypeuitzetten()

    document.body.style.backgroundImage = "url('./img/background_racefietsen.jpg')"
})
// EINDE SPELFUNCTIES //

function updateTextInput(val) {
  document.getElementById('textInput').value= val + " kaarten"; 
}




$(document).ready(function(){ 
  $("#titel").click(function() { 
    $("#titel").fadeOut(1000).promise().done(function(){
     $(".main_gegevens").fadeIn(1500);
  });
  });
});
