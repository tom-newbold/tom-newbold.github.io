function randomPointInRange(x_range, y_range) { return createVector((random()-0.5)*x_range, (random()-0.5)*y_range); }
//var randomPoint;
function randomPoint() { return createVector((random()-0.5)*width, (random()-0.5)*height); }

const OFFSET = 0.5;

function field(x, y, attractors=[]) {
    if(attractors.length==0) {
        attractors = [createVector(0,0)];
    }
    var combined_vector = createVector(0,0);
    for(var p=0; p<attractors.length; p++) {
        var vec = createVector(x, y).sub(attractors[p]).rotate(pow(-1,p) * (HALF_PI + (noise(x/100, y/100)-0.5)*(OFFSET+noise(10+x**2, 10+y**2))));
        vec.mult(pow(10,4)/pow(vec.mag(),1.7));
        combined_vector.add(vec);
    }
    return combined_vector;
}

const K = 0.01;
function field_2(x, y, octaves=3) {
    var angle = 0;
    for(var j=0; j<octaves; j++) {
        angle += noise(x * pow(x/K, j) / 100, y * pow(y/K, j) / 100) / pow(j+1,3)
    }
    angle = 2*PI*angle;
    return createVector(Math.cos(angle)*250,Math.sin(angle)*250);
}


/*function innerAtBorder(x, y, field_func) {
    if(x==width/2) {
        return Math.sign
    }
}*/

class Particle {
    constructor(init_x, init_y) {
        this.x = init_x;
        this.y = init_y;
    }

    update(field_func) {
        var old_x = this.x
        var old_y = this.y
        var velocity = field_func(this.x, this.y);
        this.x += velocity.x;
        this.y += velocity.y;
        line(old_x, old_y, this.x, this.y);
        if(this.x>width/2 || this.x<-width/2 || this.y>height/2 || this.y<-height/2) {
            //while(field_func(this.x, this.y))
            var d = random()*2*(width + height);
            if(d<=2*width) {
                if(d<=width) {
                    this.y = height/2;
                    this.x = d - width/2;
                } else {
                    this.y = -height/2;
                    this.x = d - 3*width/2;
                }
            } else {
                d = d - 2*width
                if(d<=2*width+height) {
                    this.x = width/2;
                    this.y = d - height/2
                } else {
                    this.x = -width/2;
                    this.y = d - 3*height/2;
                }
            }
        }
        /*
        if(this.x>width/2 || this.x<-width/2) {
            this.x = -Math.sign(this.x)*width/2;
        }
        if(this.y>height/2 || this.y<-height/2) {
            this.y = -Math.sign(this.y)*height/2;
        }
        */
    }
}

let DELTA_TIME = 0.01;
let PARTICLES = [];
var attractors;
var field_func;

function setup() {
    createCanvas(displayWidth, displayHeight);

    //randomPoint = function() { return randomPointInRange(width, height); }
    attractors = Array.from({length: 10}, (v, i) => randomPoint());
    //field_func = function(x, y) { return field(x, y, attractors).mult(DELTA_TIME); }
    field_func = function(x, y) { return field(x, y, attractors).add(field_2(x, y, 2)).mult(DELTA_TIME); }
    background(0);
    stroke(255);
    PARTICLES = [];
    for(var i=0; i<500; i++) {
        var v = randomPoint();
        var p = new Particle(v.x, v.y);
        PARTICLES.push(p);
    }
}

function draw() {
    translate(width/2, height/2);
    //background(0, 0, 0, 15);
    background(0, 0, 0, 10+200*pow(Math.E, -frameCount/50));
    for(var i=0; i<attractors.length; i++) {
        attractors[i].x += (random()-0.5)/5;
        attractors[i].y += (random()-0.5)/5;
        //attractors[i].add(field_2(attractors[i].x, attractors[i].y).mult(0.01));
        ellipse(attractors[i].x, attractors[i].y,5);
    }
    for(var i=0; i<PARTICLES.length; i++) {
        PARTICLES[i].update(field_func);
    }
}