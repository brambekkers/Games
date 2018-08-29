let blokHoogte = 15
let blokBreedte = 2
let lvl = 1

function setup() {
    createCanvas(schermbreedte().w, schermbreedte().h);
    background(51);

    player = new player()
    ai = new ai()
    puck = new puck()
    achtergrond = new achtergrond()
}

function draw() {
    achtergrond.show()
    // players
    player.show()
    player.move()
    ai.show()
    ai.move() 
    // puck
    puck.show()
    puck.move()
}

let achtergrond = function(){

    this.show = function(){
        // achtergrond
        fill(51)
        rect(0,0, schermbreedte().w, schermbreedte().h);

        // achtergrond text
        fill(60)
        textSize(vakgroote()*10);
        textAlign(CENTER);
        strokeWeight(vakgroote()*0.5);
        stroke(20); 
        textStyle(BOLD);
        text('PONG', schermbreedte().w/2, schermbreedte().h/2) + (vakgroote()*5);  

        // lvl text
        noStroke();
        fill('rgba(255,255,255,0.5)');
        textSize(vakgroote()*2);
        text('level', schermbreedte().w/2, vakgroote()*4); 
        textSize(vakgroote()*4);
        text(lvl, schermbreedte().w/2, vakgroote()*8); 
    }
}

let player = function(){
    this.x = 1
    this.y = schermbreedte().h /2
    this.w = vakgroote() * blokBreedte
    this.h = vakgroote() * blokHoogte
    this.score = 0

    this.show = function(){
        fill(255)
        rect(this.x, this.y-(this.h/2), this.w, this.h)

        fill('rgba(255,255,255,0.5)');
        textSize(vakgroote()*4);
        text(this.score, vakgroote()*4, vakgroote()*6);
    }
    this.move = function(y){
        if(keyIsPressed && key == 's'  && !this.checkBotsing()){
            this.y += vakgroote()
        }
        if(keyIsPressed && key == 'w'  && !this.checkBotsing()){
            this.y -= vakgroote()
        }
    }
    this.checkBotsing = function(){
        let botsing = false
        if(this.y-(this.h/2) < 0){
            botsing = true
            this.y++
        }
        if(this.y+(this.h/2) > schermbreedte().h){
            botsing = true
            this.y--
        }
        return botsing
    }
}

let ai = function(){
    this.x = schermbreedte().w - vakgroote() * blokBreedte -2
    this.y =  schermbreedte().h /2
    this.w = vakgroote() * blokBreedte
    this.h = vakgroote() * blokHoogte
    this.score = 0

    this.show = function(){
        fill(255)
        rect(this.x, this.y-(this.h/2), this.w, this.h)

        fill('rgba(255,255,255,0.5)');
        textSize(vakgroote()*4);
        text(this.score, schermbreedte().w-(vakgroote()*6), vakgroote()*6);
    }
    this.move = function(y){
        if(keyIsPressed && key == '(' && !this.checkBotsing()){
            this.y += vakgroote()
        }
        if(keyIsPressed && key == '&' && !this.checkBotsing()){
            this.y -= vakgroote()
        }
    }

    this.checkBotsing = function(){
        let botsing = false
        if(this.y-(this.h/2) < 0){
            botsing = true
            this.y++
        }
        if(this.y+(this.h/2) > schermbreedte().h){
            botsing = true
            this.y--
        }
        return botsing
    }
}

let puck = function(){
    this.x = schermbreedte().w / 2
    this.y = schermbreedte().h / 2
    this.g = vakgroote()
    this.xspeed = 15
    this.yspeed = 2


    this.show = function(){
        fill("#dc4d3f")
        rect(this.x, this.y, this.g, this.g)
    }

    this.move = function(){
        checkBotsing()
        let lvlspeed
        if(this.xspeed > 0){
            lvlspeed = Math.abs(lvl)
        }else{
            lvlspeed = -Math.abs(lvl)
        }
        this.x += this.xspeed + lvlspeed
        this.y += this.yspeed

    }
    
    this.reset = function(){
        this.x = schermbreedte().w / 2
        this.y = schermbreedte().h / 2
    }
}

const checkBotsing = function(){
    if(puck.x > player.x && puck.x < (player.x + player.w) && puck.y > player.y-(player.h/2) && puck.y < (player.y + player.h-(player.h/2))){
        puck.xspeed = Math.abs(puck.xspeed);
    }
    if(puck.x > ai.x && puck.x < (ai.x + ai.w) && puck.y > ai.y-(ai.h/2) && puck.y < (ai.y + ai.h-(ai.h/2))){
        puck.xspeed = -Math.abs(puck.xspeed)
    }
    if(puck.y < 0){
        puck.yspeed = Math.abs(puck.yspeed)
    }
    if(puck.y > schermbreedte().h - puck.g){
        puck.yspeed = -Math.abs(puck.yspeed)
    }

    if(puck.x < 0){
        ai.score++
        puck.reset()
        lvl++
    }
    if(puck.x > schermbreedte().w){
        player.score++
        puck.reset()
        lvl++
    }
}

const schermbreedte = function() {
    return {w: windowWidth -20, h: windowHeight-20 };
}

const vakgroote = function(){
    return schermbreedte().w / 100
}