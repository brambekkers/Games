var uid

$( "#data" ).submit(function(event) {

    if($("#naam").val().length > 1){
        firebase.auth().signInAnonymously();
    }
    event.preventDefault();
});

firebase.auth().onAuthStateChanged(function(user) {

    checkWelkBord()
    // User is signed in.
   
});



function checkWelkBord(){
    let user = firebase.auth().currentUser
    

    if (firebase.auth().currentUser) {
        $("#login").hide();
        uid = user.uid;
        user.inGame = false;

        // update user name
        if($("#naam").val().length > 1){
            user.updateProfile({
                displayName: $("#naam").val(),
            })
        }

        // Kijk of user al aan een spel deelneemt
        if(games){
            Object.keys(games).forEach(function(key) {

                // kijk hoeveel spelers er in één level meedoen
                games[key].spelers.forEach(function(speler){
                    if(speler.id === uid){
                        user.inGame = key
                    }
                })  
            });
        }

        // Doe wat met de uitkomst of een speler in een game zit
        // Ja user is in game:
        if(user.inGame){
            $("#actiefBord").show();
            $("#gameList").hide();
            vulBordIn()
        }
        // niet in een game:
        else{
            $("#actiefBord").hide();
            $("#gameList").show();
        }
          
       


    // User is signed out.        
    } else {

        $("#login").show();
        $("#actiefBord").hide();
        $("#gameList").hide();
    }
}