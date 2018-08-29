let vm = new Vue({
    el: '#spel',
    data: {
        // instellingen
        aantalSpelers: 0,
        aantalTegelsPerRij: 7,
        aantalSchattenPerSpeler: 4,
        spelers: [],

        // Spel stats
        splashscreen: true,
        winnaar: false,
        beurt: 0,
        stap: 0,
        reserveTegel: {
            soort: 0,
            richting: 0
        }
        
    },
    watch: {
        aantalSpelers: function(){
            this.spelers = []
            for (let i = 0; i < this.aantalSpelers; i++) {
                let imglink = this.imgscr()
                this.spelers.push({naam: "", img: imglink, schatten: [], punten: 0})
            }

            this.aantalSpelers = this.spelers.length
        }
    },
    computed: {
        naamSpeler: function(){
            if(this.spelers[this.beurt]){
                return this.spelers[this.beurt].naam
            }
        },
        avatarSpeler: function(){
            if(this.spelers[this.beurt]){
                return this.spelers[this.beurt].img
            }
        },
        tegelSoort: function(){
            if(this.reserveTegel.soort === 0){
                return 'img/hoekstuk_afgerond.png'
            }
            if(this.reserveTegel.soort === 1){
                return 'img/rechtstuk_afgerond.png'
            }
            if(this.reserveTegel.soort === 2){
                return 'img/tstuk_afgerond.png'
            }
        },
        tegelRichting: function(){
            if(this.reserveTegel.richting === 1){
                return 'transform: rotate(90deg);'
            }
            if(this.reserveTegel.richting === 2){
                return 'transform: rotate(180deg);'
            }
            if(this.reserveTegel.richting === 3){
                return 'transform: rotate(270deg);'
            }
        },
        kaartjes: function(){
            if(this.spelers[this.beurt].schatten.length >= 3){
                return 'paper-3'
            }
            if(this.spelers[this.beurt].schatten.length === 2){
                return 'paper-2'
            }
            if(this.spelers[this.beurt].schatten.length === 1){
                return 'paper-1'
            }
        },
    },
    methods: {
        volgendeBeurt: function(){
            if(this.beurt < this.aantalSpelers-1){
                this.beurt++
            }
            else{
                this.beurt = 0
            }
            this.stap--
        },
        imgscr: function(){
            return 'img/helden/' + Math.floor(Math.random() * 7) + '.png'
        },
        schatSpeler: function(){
            if(this.spelers.length > 0){
                if(this.spelers[this.beurt].schatten[0]){
                    return 'img/schatten/' + this.spelers[this.beurt].schatten[0].id + '.png'
                }else{
                    return false
                }
            }
        },
        veranderCharacter: function(n){
            this.spelers[n].img = this.imgscr()
        },
        startGame: function(){
            this.splashscreen = false

            setTimeout(function(){setup()}, 100)
            this.verdeelSchatKaarten()

        },
        checkVoorWinnaar: function(){
            if(this.spelers[this.beurt].schatten.length === 0){
                this.winnaar = true
            }
        },
        verdeelSchatKaarten: function(){
            for (const speler of this.spelers) {
                speler.schatten = []

                while (speler.schatten.length < this.aantalSchattenPerSpeler) {
                    randomSchat = Math.floor(Math.random() * 14)+1;
                    SchatLink = 'img/schatten/' + randomSchat + '.png'
                    if(speler.schatten.length > 0){
                        let heeftSchat = false
                        for (const schat of speler.schatten) {
                            if(schat.id === randomSchat){
                                heeftSchat = true
                            }
                        }
                        if(!heeftSchat){
                            speler.schatten.push({id: randomSchat, img: SchatLink})
                        }
                    }else{
                        speler.schatten.push({id: randomSchat, img: SchatLink})
                    }
                    
                }
            }
        }
    }
})