function preload() {
	fontItalic = loadFont('fonts/RobotoCondensed-Italic.ttf');
	fontThinItalic = loadFont('fonts/RobotoCondensed-LightItalic.ttf');
}

function colourInterpolate4(colour_a, colour_b, colour_c, colour_d, value_x, value_y) {
    var a_scale = 1-(value_x**2 + value_y**2)/2;
    var b_scale = 1-((1-value_x)**2 + value_y**2)/2;
    var c_scale = 1-(value_x**2 + (1-value_y)**2)/2;
    var d_scale = 1-((1-value_x)**2 + (1-value_y)**2)/2;
    var r = red(colour_a)*a_scale + red(colour_b)*b_scale + red(colour_c)*c_scale + red(colour_d)*d_scale;
    var g = green(colour_a)*a_scale + green(colour_b)*b_scale + green(colour_c)*c_scale + green(colour_d)*d_scale;
    var b = blue(colour_a)*a_scale + blue(colour_b)*b_scale + blue(colour_c)*c_scale + blue(colour_d)*d_scale;
    return color(r,g,b);
}

function colourInterpolate(colour_a, colour_b, value) {
    var r = red(colour_a)*(1-value) + red(colour_b)*value;
    var g = green(colour_a)*(1-value) + green(colour_b)*value;
    var b = blue(colour_a)*(1-value) + blue(colour_b)*value;
    return color(r,g,b);
}

function Vector2D(x, y) {
    return {'x': x, 'y': y};
}

function mult(v, s) {
    return {'x': s*v.x, 'y': s*v.y};
}

function add(v1, v2) {
    return {'x': v1.x + v2.x, 'y': v1.y + v2.y};
}

function sub(v1, v2) {
    return add(v1, mult(v2, -1));
}

class Leaf {
    constructor(x, y, angle, length, colour) {
        this.position = Vector2D(x, y);
        this.angle = angle;
        this.length = length;
        this.width = length/2; // make this input
        this.c1_fact = random();
        this.c1_prime_fact = random();
        this.c2_fact = random();
        this.c2_prime_fact = random();
        this.recalcPoints();
        this.colour = colour;
    }

    recalcPoints() {
        this.endpoint = this.getEndpoint();
        this.c1 = this.getControlPoint(true, false, this.c1_fact); // use factors
        this.c1_prime = this.getControlPoint(true, true, this.c1_prime_fact);
        this.c2 = this.getControlPoint(false, false, this.c2_fact);
        this.c2_prime = this.getControlPoint(false, true, this.c2_prime_fact);
    }

    getEndpoint() {
        return Vector2D(this.position.x + Math.sin(this.angle)*this.length, this.position.y + Math.cos(this.angle)*this.length);
    }

    getControlPoint(is_base_point, is_prime, factor) {
        //var l_half = mult(sub(this.endpoint, this.position),1/2);
        //var l_half_perp = mult(sub(Vector2D(-this.endpoint.y, this.endpoint.x), Vector2D(-this.position.y, this.position.x)),1/2);
        var l_half = mult(Vector2D(Math.sin(this.angle),Math.cos(this.angle)),this.length/2);
        var l_half_perp = mult(Vector2D(-Math.cos(this.angle),Math.sin(this.angle)),this.width/2);
        if(is_prime) {
            l_half_perp = mult(l_half_perp,-1);
        }
        if(is_base_point) {
            return add(add(this.position,l_half_perp), mult(l_half, factor))
        } else {
            return add(add(this.position,l_half), mult(l_half_perp, (1-factor)))
        }
    }

    draw() {
        stroke(this.colour);
        fill(this.colour);

        beginShape();
        vertex(this.position.x, this.position.y);
        bezierVertex(this.c1.x,this.c1.y, this.c2.x,this.c2.y, this.endpoint.x,this.endpoint.y);
        bezierVertex(this.c2_prime.x,this.c2_prime.y, this.c1_prime.x,this.c1_prime.y, this.position.x, this.position.y);
        endShape();

        /*
        [this.c1, this.c1_prime, this.c2, this.c2_prime].forEach(p => {
            console.log(p)
            ellipse(p.x, p.y, 5, 5);
        });
        */
    }
}

class GrowingLeaf extends Leaf {
    constructor(x, y, angle, target_length, colour, frames_to_grow, start_frame_offset=0) {
        super(x, y, angle, 0, colour);
        this.target_length = target_length;
        this.duration = frames_to_grow;
        this.start_frame = frameCount + start_frame_offset;
    }

    grow(base=25) {
        var t = frameCount - this.start_frame;
        if(t <= this.duration) {
            this.length = this.target_length * Math.log(1+(base-1)*t/this.duration) / Math.log(base);
            this.width = this.length/2;
            this.recalcPoints();
            return true;
        } else {
            return false;
        }
    }
}

class Flower {
    constructor(centre_x, centre_y, min_r, max_r, petal_count, colour_gradient, start_frame_offset=0) {
        this.centre = Vector2D(centre_x, centre_y)
        this.petal_gradient = colour_gradient;
        var start_angle = log(max_r);
        var end_angle = log(min_r);
        this.angle_increment = (start_angle-end_angle)/petal_count; // calc with petal count
        var k = 20 + random();
        
        this.petals = [];
        var p = 0;
        for(var theta=start_angle; theta>end_angle; theta-=this.angle_increment) {
            this.petals.push(new GrowingLeaf(centre_x, centre_y, k*theta, Math.E**theta, this.sampleGradient(p), 40+random()*10, start_frame_offset));
            p+=1/petal_count;
            //, frameCount+Math.round(Math.E**theta/petal_count))); //check fram count calc
        }
        this.petals_finished = [];
    }
    
    sampleGradient(value) {
        var out_color = color(0);
        out_color.setRed(red(this.petal_gradient[0])*(1-value) + red(this.petal_gradient[1])*value);
        out_color.setGreen(green(this.petal_gradient[0])*(1-value) + green(this.petal_gradient[1])*value);
        out_color.setBlue(blue(this.petal_gradient[0])*(1-value) + blue(this.petal_gradient[1])*value);
        out_color.setAlpha(alpha(this.petal_gradient[0])*(1-value) + alpha(this.petal_gradient[1])*value);
        return out_color
    }

    frame() {
        for(var i=0; i<this.petals.length; i++) {
            if(!this.petals_finished.includes(i)) {
                if(!this.petals[i].grow()){
                    this.petals_finished.push(i);
                }
            }
        }
        for(var i=0; i<this.petals.length; i++) {
            this.petals[i].draw();
        }
    }
}

//var leaves = [];
var flowers = [];
var circles = [];

var backgroundGradient = [];

function sampleBackgroundGradient(x, y) {
    return colourInterpolate(colourInterpolate(backgroundGradient[0],backgroundGradient[1],x/width),
                             colourInterpolate(backgroundGradient[3],backgroundGradient[2],x/width), y/height);
    //return colourInterpolate4(backgroundGradient[0],backgroundGradient[1],backgroundGradient[2],backgroundGradient[3],x/width, y/height);
}

function setup() {
    let canvas = createCanvas(displayWidth, displayHeight*2.5);
    canvas.parent('p5-canvas');
    background(13,14,14);
    stroke(255);
    fill(10,10,200);

    //var k = 12 + 10*random();
    //console.log(k)
    //for(var r=128; r>32; r-=4) {
    //    leaves.push(new GrowingLeaf(200, 200, k*log(r/20), r, 40+random()*10, r/4));
    //}
    //flower = new Flower(200, 200, 20, 100, 20)

    //leaves.push(new GrowingLeaf(0, 0, 0, 50, 50));
    for(var i=0; i<4; i++) {
        //backgroundGradient.push(color((i+2)/5 * random()*255,(i%2+2)/3 * random()*255,random()**(i+2) *255));
        //backgroundGradient.push(color(i/4*random()*255,2*abs(i-1)/3 * random()*255,((i%2)+1)/2 * random()*255));
        backgroundGradient.push(color(105+random()*150,105+random()*150,105+random()*150));
    }

    /*
    for(var n=0; n<500; n++) {
        var x = random()*width;
        var y = random()*height;
        stroke(sampleBackgroundGradient(x,y));
        fill(sampleBackgroundGradient(x,y));
        ellipse(x, y, 10, 10)
    }
    background(0,0,0,150)
    */
}

//const MAX_FLOWER_COUNT = 20;

function debug() {
    stroke(0)
    fill(0)
    rect(0,0,20,10)
    stroke(255)
    fill(255)
    text(Math.round(frameRate()), 0, 10);
    //text(flowers.length, 0, 10);
}

function flowerBunch(target_x, target_y, spread, flower_count) {
    var main_colour = color(random()*255,random()*255,random()*255);
    for(var j=0; j<flower_count; j++) {
        var gradient = [main_colour,color(red(main_colour)*random(),green(main_colour)*random(),blue(main_colour)*random())]

        var r = spread * (0.25+random())/1.25;
        var angle = random()*2*Math.PI;
        flowers.push(new Flower(target_x+r*Math.sin(angle), target_y+r*Math.cos(angle),
                                15*(1+random()), 50*(1+random()), Math.round(16*(0.5+random())),
                                gradient, j+Math.round(random()*20)));
    }
}

function halfRand() {
    //return (1+random())/2;
    return (1+2*random()) / 3;
}

function genGrad(main_colour) {
    return [main_colour,color(red(main_colour)*halfRand(),green(main_colour)*halfRand(),blue(main_colour)*random())]
}

function clamp(n, top=255) {
    return Math.min(Math.max(0, n), top)
}

const VAR_SPEED = 4;

function draw() {
    if(random()<0.01) {
        var c_x = random()*width;
        var c_y = random()*height;
        var main_colour = sampleBackgroundGradient(c_x, c_y);
        var gradient = genGrad(main_colour);
        flowers.push(new Flower(c_x, c_y,
                                30*(1+random()), 100*(1+random()), Math.round(20*(0.5+random())),
                                gradient));

        //circles.push([c_x, c_y, 0, gradient[0]])
    }

    if(random()<0.1) {
        var c_x = random()*width;
        var c_y = random()*height;

        // full random
        //var gradient = [color(random()*255,random()*255,random()*255),color(random()*255,random()*255,random()*255)]
        // all green
        //var gradient = [color(0,190,110), color(0,210,240)]

        // random start
        //var main_colour = color(random()*255,random()*255,random()*255);
        // mathmatical gradient
        //var main_colour = color(random()*50 + 100*(c_x+c_y)/(width+height),255*c_x/width - random()*50,255*c_y/height - random()*50);
        // interpolate gradient
        var main_colour = sampleBackgroundGradient(c_x, c_y);
        var gradient = genGrad(main_colour);

        //flowerBunch(c_x, c_y, 100+random()*50, Math.round(4+random()*4))
        flowers.push(new Flower(c_x, c_y,
                                15*(1+random()), 50*(1+random()), Math.round(16*(0.5+random())),
                                gradient));

        //circles.push([c_x, c_y, 0, gradient[0]])
    }

    if(random()<0.2) {
        var c_x = random()*width;
        var c_y = random()*height;
        var main_colour = sampleBackgroundGradient(c_x, c_y);
        var gradient = genGrad(main_colour);
        flowers.push(new Flower(c_x, c_y,
                                5*(1+random()), 25*(1+random()), Math.round(12*(0.5+random())),
                                gradient));

        //circles.push([c_x, c_y, 0, gradient[0]])
    }
    
    if(frameCount%8==0) {
        background(13,14,14,15);
    }

    for(var i=0; i<circles.length; i++) {
        var r = circles[i][2];
        var alpha = 1-Math.abs(r**2-250**2)/250**2;
        circles[i][3].setAlpha(100*alpha);
        stroke(circles[i][3]);
        noFill();
        ellipse(circles[i][0], circles[i][1], circles[i][2], circles[i][2])
        circles[i][2] = circles[i][2] + 1;
        //circles[i][3].setAlpha(alpha(circles[i][3])*0.99);
        //if(circles[i][2] > Math.max(width, height)) {
        if(r!=0 && alpha<=0) {
            circles.splice(i,1);
        }
    }
    for(var i=0; i<flowers.length; i++) {
        if(flowers[i].petals.length==flowers[i].petals_finished.length) {
            flowers.splice(i,1);
        } else {
            flowers[i].frame();
        }
    }

    //debug()
    var newGrad = [];
    for(var i=0; i<4; i++) {
        newGrad.push(color(clamp(red(backgroundGradient[i]) + VAR_SPEED*(random()-0.5)),
                           clamp(green(backgroundGradient[i]) + VAR_SPEED*(random()-0.5)),
                           clamp(blue(backgroundGradient[i]) + VAR_SPEED*(random()-0.5))));
        //stroke(newGrad[i]);
        //fill(newGrad[i]);
        //rect(10*(i+1),10,10,10);
    }
    backgroundGradient = newGrad;
    /*
    textSize(80);
	textAlign(CENTER, BASELINE);
    noStroke();
	fill(200, 200, 200);
	textFont(fontThinItalic);
    text('Thomas Newbold', displayWidth/2, displayHeight/2);
    */
}

/*
    for(var i=0; i<leaves.length; i++) {
        leaves[i].grow();
        leaves[i].draw();
    }
    */
    /*
    var origin = Vector2D(displayWidth/2,displayHeight/2)
    var OFFSET = 10;
    for(var i=0; i<flowers.length; i++) {
        noFill();
        stroke(10,120,20);
        var v = mult(sub(flowers[i].center, origin),1/3);
        v = add(v, Vector2D(random()*OFFSET,random()
        v*2
        bezier(flowers[i].center.x,flowers[i].center.y, sub(flowers[i].center, Vector2D(displayWidth/2,displayHeight/2)),)
        flowers[i].center;
    }
*/