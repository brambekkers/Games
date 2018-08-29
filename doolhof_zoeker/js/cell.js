function Cell(i, j){
    this.i = i;
    this.j = j;
    this.borders = [true, true, true, true]
    this.bezocht = false
    this.bezochtPoint = false
    this.highlight = false
    this.start = false
    this.eind = false

    this.show = function(){
        let x = this.i * maat
        let y = this.j * maat
        noStroke();
    


        // als bezocht
        if(this.bezocht){
            noStroke()
            fill(189,217,227)
            rect(x, y, maat, maat);  
        }
        if(this.bezochtPoint){
            noStroke()
            fill(132,151,158)
            rect(x, y, maat, maat);  
        }

        if(this.highlight){
            noStroke()
            fill(103,161,189)
            rect(x, y, maat, maat);  
        }

        if(this.start){
            noStroke()
            fill(129,212,152)
            rect(x, y, maat, maat);  
        }

        if(this.eind){
            noStroke()
            fill(255,111,105)
            rect(x, y, maat, maat);  
        }

        // randen
        stroke(0);
        strokeWeight(maat/20);
        if(this.borders[0]){
            line(x, y, x+maat, y);
        }
        if(this.borders[1]){
            line(x+maat, y, x+maat, y+maat);
        }
        if(this.borders[2]){
            line(x, y+maat, x+maat, y+maat);
        }
        if(this.borders[3]){
            line(x, y, x, y+maat);
        }
    }

    this.bekijkBuren = function() {
        let buren = []

        let top     = grid[index(i, j - 1)]
        let right   = grid[index(i + 1, j)]
        let bottom  = grid[index(i, j + 1)]
        let left    = grid[index(i - 1, j)]

        if(top && !top.bezocht){
            buren.push(top)
        }
        if(right && !right.bezocht){
            buren.push(right)
        }
        if(bottom && !bottom.bezocht){
            buren.push(bottom)
        }
        if(left && !left.bezocht){
            buren.push(left)
        }

        if( buren.length > 0) {
            let r = floor(random(0, buren.length))
            return buren[r]
        }else{
            return undefined
        }
    }
}