function Point(i, j){
    this.i = i;
    this.j = j;
    this.borders = [true, true, true, true]
    this.bezocht = false
    this.highlight = false
    this.start = false
    this.eind = false
    this.stack = []

    this.show = function(){
        let x = this.i * maat
        let y = this.j * maat
        noStroke()
        fill(227,189,217)
        ellipse(x+maat/2, y+maat/2, maat*0.7, maat*0.7);
        
    }

    this.move = function(y, x){
        this.i += x
        this.j += y
        let np = grid[index(this.i, this.j)]

        
        if(this.checkvoorhinder(y, x)){
            this.i -= x
            this.j -= y
        }else{
            this.stack.push(index(this.i, this.j))
            np.bezochtPoint = true
        }
    }


    this.checkvoorhinder = function(y, x){
        let teruggave
        let np = grid[index(this.i, this.j)]
        // check voor buitenranden
        if (this.i < 0 || this.i > aantal - 1 || this.j < 0 || this.j > aantal - 1) {
            return true
        }
        // check voor cellwanden
        if(np){
            if (x === -1) {
                if(np.borders[1]){
                    return true
                }
            }
            if (x === 1) {
                if(np.borders[3]){
                    return true
                }
            }
            if (y === -1) {
                if(np.borders[2]){
                    return true
                }
            }
            if (y === 1) {
                if(np.borders[0]){
                    return true
                }
            }
        }
        // check voor pointstack
        this.stack.forEach(nummer => {
            if (nummer === index(this.i, this.j) ) {
                teruggave = true
            }
        });

        return teruggave
    }

}