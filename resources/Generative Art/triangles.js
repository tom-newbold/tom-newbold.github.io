var PRIMARY;
var SECONDARY;

var MAX_DEPTH;
var SUB_THRESHOLD;
var SHADE_THRESHOLD;

class Triangle {
	constructor(depth, x, y, size) {
		this.depth = depth;
		this.x = x;
		this.y = y;
		this.size = size;
		this.children = [];
		if(random(0,1) < SHADE_THRESHOLD){
			this.shaded = true;
		} else {
			this.shaded = false;
		}
	}

	draw() {
		if(this.shaded){
			fill(PRIMARY);
		} else {
			fill(SECONDARY);
		}
		stroke(PRIMARY);

		if(this.children.length > 0){
			for(var i=0; i<this.children.length; i++){
				this.children[i].draw();
			}
		} else {
			beginShape();
			vertex(this.x,this.y+this.size*tan(PI/3)/2);
			vertex(this.x+this.size/2,this.y);
			vertex(this.x+this.size,this.y+this.size*tan(PI/3)/2);
			endShape(CLOSE);
		}
	}

	subdivide() {
		if(this.depth <= MAX_DEPTH){
			if(random(0,1) < pow(SUB_THRESHOLD,this.depth)){
				append(this.children, new Triangle(this.depth+1,this.x,this.y+this.size*tan(PI/3)/4,this.size/2));
				append(this.children, new Triangle(this.depth+1,this.x+this.size/4,this.y,this.size/2));
				append(this.children, new Triangle(this.depth+1,this.x+this.size/2,this.y+this.size*tan(PI/3)/4,this.size/2));
				if(this.depth != MAX_DEPTH){
					for(var i=0; i<this.children.length; i++){
						this.children[i].subdivide();
					}
				}
			}
		}
	}
}

var PARENT;

function setup() {
	PRIMARY = color(34,35,35);
	SECONDARY = color(240,246,240);
	MAX_DEPTH = 8;
	SUB_THRESHOLD = 0.8;
	SHADE_THRESHOLD = 0.5;

	createCanvas(1540,800);
	stroke(PRIMARY);
	noLoop();
}

function draw(){
	background(SECONDARY);
	PARENT = new Triangle(0,470,104,700);
	PARENT.subdivide();
	PARENT.draw();
	//rect(PARENT.x,PARENT.y,PARENT.size,PARENT.size);
	print('drawn');
}

function keyPressed(){
	if(key == ' '){
		redraw();
	}
}
