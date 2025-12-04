BLACK_POINT = 10;
WHITE_POINT = 220;

N=200;
R=5;
INTERP_FROM = 25;
INTERP_TO = 100;
BUFFER = 1.05*INTERP_TO;

function randomPointInRange(x_range, y_range) { return createVector((random()-0.5)*x_range, (random()-0.5)*y_range); }
function randomPoint() { return createVector((random()-0.5)*(width+2*BUFFER), (random()-0.5)*(height+2*BUFFER)); }

class Particle {
    constructor(init_x, init_y, grid_x, grid_y) {
        this.x = init_x;
        this.y = init_y;

        this.volatility = 1;
        
        this.setRandAngle();
    }

    setGridPosition(grid_x, grid_y) {
        this.grid_x = grid_x;
        this.grid_y = grid_y;
    }

    setRandAngle() {
        this.angle = random()*Math.PI*2;
        this.velocity = createVector(Math.cos(this.angle), Math.sin(this.angle));
    }

    update() {
        this.angle += (random()-0.5)*this.volatility*Math.PI/16;
        this.velocity = createVector(Math.cos(this.angle), Math.sin(this.angle));
    
        this.x += this.velocity.x*this.volatility;
        this.y += this.velocity.y*this.volatility;


        if(this.x>BUFFER+width/2 || this.x<-BUFFER-width/2 || this.y>BUFFER+height/2 || this.y<-BUFFER-height/2) {
            this.setRandAngle();
            var d = random()*2*(width + height);
            if(d<=2*width) {
                if(d<=width) {
                    this.y = BUFFER + height/2;
                    this.x = d - BUFFER - width/2;
                } else {
                    this.y = - BUFFER - height/2;
                    this.x = d - 3*(2*BUFFER + width)/2;
                }
            } else {
                d = d - 2*width
                if(d<=2*width+height) {
                    this.x = BUFFER + width/2;
                    this.y = d - BUFFER - height/2
                } else {
                    this.x = - BUFFER - width/2;
                    this.y = d - 3*(2*BUFFER + height)/2;
                }
            }
        }
    }

    draw(neighbors) {
        for(var i=0; i<neighbors.length; i++) {
            var other = neighbors[i];
            var d = dist(this.x, this.y, other.x, other.y);
            if(d<=INTERP_TO) {
                stroke(WHITE_POINT, map(d, INTERP_FROM, INTERP_TO, 255, 0));
                line(this.x, this.y, other.x, other.y);
            }
        }
        noStroke();
        fill(255);
        ellipse(this.x, this.y, R);

        this.volatility = 1.25 + 1/(1+neighbors.length**2)
    }
}

class GridParticleStore {
    constructor(square_side_length) {
        this.allPariticles = [];
        this.square_side_length = square_side_length;
        var horizontalSquareCount = 2*Math.ceil(2*BUFFER + width / square_side_length/2);
        var verticalSquareCount = 2*Math.ceil(2*BUFFER + height / square_side_length/2);
        // even so can be centred on 0,0
        this.grid = new Array(horizontalSquareCount);
        for(var i=0; i<horizontalSquareCount; i++) {
            this.grid[i] = new Array(verticalSquareCount);
            for(var j=0; j<verticalSquareCount; j++) {
                this.grid[i][j] = [];
            }
        }
    }
    
    calculateGridPosition(particle) {
        var grid_x = Math.floor((particle.x + BUFFER + width/2) / this.square_side_length);
        var grid_y = Math.floor((particle.y + BUFFER + height/2) / this.square_side_length);
        return createVector(Math.max(0, Math.min(this.grid.length-1, grid_x)), Math.max(0, Math.min(this.grid[0].length-1, grid_y)));
    }

    addParticle(particle) {
        var gridPos = this.calculateGridPosition(particle);
        particle.setGridPosition(gridPos.x, gridPos.y);
        this.grid[particle.grid_x][particle.grid_y].push(particle);
        this.allPariticles.push(particle);
    }

    iterateParticles(){
        // update all particles
        for(var i=0; i<this.allPariticles.length; i++) {
            var p = this.allPariticles[i];
            this.grid[p.grid_x][p.grid_y].splice(p, 1);
            p.update();
            var gridPos = this.calculateGridPosition(p);
            p.setGridPosition(gridPos.x, gridPos.y);
            this.grid[p.grid_x][p.grid_y].push(p);
        }
        // draw
        for(var i=0; i<this.allPariticles.length; i++) {
            var neighbors = [];
            var p = this.allPariticles[i];
            for(var dx=-1; dx<=1; dx++) {
                for(var dy=-1; dy<=1; dy++) {
                    var nx = p.grid_x + dx;
                    var ny = p.grid_y + dy;
                    if(nx>=0 && nx<this.grid.length && ny>=0 && ny<this.grid[0].length) {
                        neighbors = neighbors.concat(this.grid[nx][ny]);
                    }
                }
            }
            this.allPariticles[i].draw(neighbors);
        }
    }
}

let PARTICLE_SYSTEM;

function setup() {
    var canvas = createCanvas(displayWidth, displayHeight);

    console.log(displayDensity());
    
    N = Math.floor(displayDensity() * width*height/30000);
    console.log(width+height)
    INTERP_FROM = Math.floor(50 * displayDensity() * (width**2 + height**2)/(3840**2 + 2160**2));
    console.log(INTERP_FROM)
    INTERP_TO = 4*INTERP_FROM;
    console.log(INTERP_TO)
    BUFFER = 1.05*INTERP_TO;
    console.log(BUFFER)
    

	canvas.parent('constellation-canvas');

    background(BLACK_POINT);
    stroke(WHITE_POINT);
    PARTICLE_SYSTEM = new GridParticleStore(INTERP_TO);
    for(var i=0; i<N; i++) {
        var v = randomPoint();
        var p = new Particle(v.x, v.y);
        PARTICLE_SYSTEM.addParticle(p);
    }
}

function draw() {
    background(BLACK_POINT);
    translate(width/2, height/2);
    PARTICLE_SYSTEM.iterateParticles();
}