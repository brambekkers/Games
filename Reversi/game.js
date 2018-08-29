var app = new Vue({
    el: '#spel',
    data: {
      beurt: 0,
      beurtP0: true,
      beurtP1: false,
      gekliktVakjeCor: {
          r: null,
          k: null,
      },
      bordGroote: 10,
      scoreP0: 0,
      scoreP1: 0,
      bord: [],
    },
    created: function(){
        this.newGame()
        this.updateScore
    },
    computed: {
        tegenstander: function(){
            if(this.beurt === 0){
                return 1
            }else{
                return 0
            }
        },
        updateScore: function(){
            let tel0 = 0
            let tel1 = 0

            for (let i = 0; i < this.bordGroote; i++) {
                for (let j = 0; j < this.bordGroote; j++) {
                    if(this.bord[i][j].eigenaar === 0){
                        tel0++
                    }
                    if(this.bord[i][j].eigenaar === 1){
                        tel1++
                    }
                }     
            }

            this.scoreP0 = tel0
            this.scoreP1 = tel1
        }
    },
    methods: {
        gekliktVakje: function(r, k){
            // console.log('rij:'+r+' kolom:'+k)

            //check of vakje leeg is
            if( this.bord[r][k].eigenaar === null){
                if(this.checkOfZetMogelijkIs(r,k)){
                    this.bord[r][k].eigenaar = this.beurt
                    this.verwerkTegels(r,k)
                    this.checkWinnaar()
                    this.volgendeBeurt()
                }
            }else{
                this.resetGeklikteVakjes()
                if(this.bord[r][k].eigenaar === this.beurt){
                    this.bord[r][k].geklikt = !this.bord[r][k].geklikt
                    this.gekliktVakjeCor.r = r
                    this.gekliktVakjeCor.k = k
                }
            }
            this.updateScore
        },
        resetGeklikteVakjes: function(){
            for (let i = 0; i < this.bordGroote; i++) {
                for (let j = 0; j < this.bordGroote; j++) {
                    this.bord[i][j].geklikt = false
                }     
            }

            this.gekliktVakjeCor.r = null
            this.gekliktVakjeCor.k = null
        },
        checkOfZetMogelijkIs: function(r1, k1){
            let tegenstanderTegel = false
            let r2 = this.gekliktVakjeCor.r
            let k2 = this.gekliktVakjeCor.k

            //horizontaal
            if(r1 === r2){

                // controleer rechts
                if(k1 > k2){
                    for (let i = k2 + 1; i < k1; i++) {
                        if(this.bord[r1][i].eigenaar === null || this.bord[r1][i].eigenaar === this.beurt){
                            return false
                        }else{
                            tegenstanderTegel = true
                        }
                    }
                }
                // controleer links
                if(k1 < k2){
                    for (let i = k2 - 1; i > k1; i--) {
                        if(this.bord[r1][i].eigenaar === null || this.bord[r1][i].eigenaar === this.beurt){
                            return false
                        }else{
                            tegenstanderTegel = true
                        }
                    }
                }
            }
            //verticaal
            if(k1 === k2){
                // controleer beneden
                if(r1 > r2){
                    for (let i = r2 + 1; i < r1; i++) {
                        if(this.bord[i][k1].eigenaar === null || this.bord[i][k1].eigenaar === this.beurt){
                            return false
                        }else{
                            tegenstanderTegel = true
                        }
                    }
                }
                // controleer boven
                if(r1 < r2){
                    for (let i = r2 - 1; i > r1; i--) {
                        if(this.bord[i][k1].eigenaar === null || this.bord[i][k1].eigenaar === this.beurt){
                            return false
                        }else{
                            tegenstanderTegel = true
                        }
                    }
                }
            }
            //diagonaal

            // Check if diagonaal
            let diagonaalOplopend = false
            let diagonaalAflopend = false
            let diagonaalOplopendAflopend = false
            let diagonaalAflopendOplopend = false


            for (let i = this.bordGroote; i > 0; i--) {
                if((r1-i) === r2 && (k1-i) === k2){
                    diagonaalOplopend = true
                }
                if((r1+i) === r2 && (k1+i) === k2){
                    diagonaalAflopend = true
                }
                if((r1+i) === r2 && (k1-i) === k2){
                    diagonaalOplopendAflopend = true
                }
                if((r1-i) === r2 && (k1+i) === k2){
                    diagonaalAflopendOplopend = true
                }

            }

            if(diagonaalOplopend){
                for (let DO = 1; DO < this.bordGroote; DO++) {
                    if((r2+DO) === r1 && (k2+DO) === k1){
                        break
                    }
                    if(this.bord[r2+DO][k2+DO].eigenaar === null || this.bord[r2+DO][k2+DO].eigenaar === this.beurt){
                        return false
                    }
                    else{
                        tegenstanderTegel = true
                    }
                }
            }
            if(diagonaalAflopend){
                for (let DO = 1; DO < this.bordGroote; DO++) {
                    if((r2-DO) === r1 && (k2-DO) === k1){
                        break
                    }
                    if(this.bord[r2-DO][k2-DO].eigenaar === null || this.bord[r2-DO][k2-DO].eigenaar === this.beurt){
                        return false
                    }
                    else{
                        tegenstanderTegel = true
                    }
                }
            }
            if(diagonaalOplopendAflopend){
                for (let i = 1; i < this.bordGroote; i++) {
                    if((r2-i) === r1 && (k2+i) === k1){
                        break
                    }
                    if(this.bord[r2-i][k2+i].eigenaar === null || this.bord[r2-i][k2+i].eigenaar === this.beurt){
                        return false
                    }
                    else{
                        tegenstanderTegel = true
                    }
                }
            }
            if(diagonaalAflopendOplopend){
                for (let i = 1; i < this.bordGroote; i++) {
                    if((r2+i) === r1 && (k2-i) === k1){
                        break
                    }
                    if(this.bord[r2+i][k2-i].eigenaar === null || this.bord[r2+i][k2-i].eigenaar === this.beurt){
                        return false
                    }
                    else{
                        tegenstanderTegel = true
                    }
                }
            }
            return tegenstanderTegel
        },
        verwerkTegels: function(r1, k1){
            let r2 = this.gekliktVakjeCor.r
            let k2 = this.gekliktVakjeCor.k

            //horizontaal
            if(r1 === r2){
                // links
                if(k1 < k2){
                    for (let i = k2 - 1; i > k1; i--) {
                        this.bord[r1][i].eigenaar = this.beurt     
                    }
                }
                // rechts
                if(k1 > k2){
                    for (let i = k2 + 1; i < k1; i++) {
                        this.bord[r1][i].eigenaar = this.beurt
                    }
                }
            }
            //verticaal
            if(k1 === k2){
                // controleer boven
                if(r1 < r2){
                    for (let i = r2 - 1; i > r1; i--) {
                        this.bord[i][k1].eigenaar = this.beurt
                    }
                }
                // beneden
                if(r1 > r2){
                    for (let i = r2 + 1; i < r1; i++) {
                        this.bord[i][k1].eigenaar = this.beurt
                    }
                }
            }
            // Check if diagonaal
            let diagonaalOplopend = false
            let diagonaalAflopend = false
            let diagonaalOplopendAflopend = false
            let diagonaalAflopendOplopend = false

            for (let i = this.bordGroote; i > 0; i--) {
                if((r1-i) === r2 && (k1-i) === k2){
                    diagonaalOplopend = true
                }
                if((r1+i) === r2 && (k1+i) === k2){
                    diagonaalAflopend = true
                }
                if((r1+i) === r2 && (k1-i) === k2){
                    diagonaalOplopendAflopend = true
                }
                if((r1-i) === r2 && (k1+i) === k2){
                    diagonaalAflopendOplopend = true
                }
            }
            if(diagonaalOplopend){
                for (let DO = 1; DO < this.bordGroote; DO++) {
                    if((r2+DO) === r1 && (k2+DO) === k1){
                        break
                    }
                    this.bord[(r2+DO)][(k2+DO)].eigenaar = this.beurt

                }
            }
            if(diagonaalAflopend){
                for (let DO = 1; DO < this.bordGroote; DO++) {
                    if((r2-DO) === r1 && (k2-DO) === k1){
                        break
                    }
                    this.bord[r2-DO][k2-DO].eigenaar = this.beurt
                }
            }
            if(diagonaalOplopendAflopend){
                for (let DO = 1; DO < this.bordGroote; DO++) {
                    if((r2-DO) === r1 && (k2+DO) === k1){
                        break
                    }
                    this.bord[r2-DO][k2+DO].eigenaar = this.beurt
                }
            }
            if(diagonaalAflopendOplopend){
                for (let DO = 1; DO < this.bordGroote; DO++) {
                    if((r2+DO) === r1 && (k2-DO) === k1){
                        break
                    }
                    this.bord[r2+DO][k2-DO].eigenaar = this.beurt
                }
            }
        },
        newGame: function(){
            this.bord = []
            for (let i = 0; i < this.bordGroote; i++) {
                this.bord.push([])
                for (let j = 0; j < this.bordGroote; j++) {
                    this.bord[i].push({
                        eigenaar: null,
                        geklikt: false
                    })
                }
                
            }

            this.bord[4][4].eigenaar = 1
            this.bord[4][5].eigenaar = 0
            this.bord[5][4].eigenaar = 0
            this.bord[5][5].eigenaar = 1
        },
        volgendeBeurt: function(){
            if(this.beurt){
                this.beurt = 0
                this.beurtP0 = true
                this.beurtP1 = false
            }else{
                this.beurt = 1
                this.beurtP0 = false
                this.beurtP1 = true
            }
            this.resetGeklikteVakjes()
        },
        checkWinnaar: function(){
            let isErEenWinnaar = true

            for (let i = 0; i < this.bordGroote; i++) {
                for (let j = 0; j < this.bordGroote; j++) {
                    if(this.bord[i][j].eigenaar === null){
                        isErEenWinnaar = false
                    }
                }     
            }

            if(isErEenWinnaar){
                $('.winaarModal').modal('toggle')
            }
        }
    } 
  })