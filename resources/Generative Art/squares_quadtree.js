var PRIMARY;
var SECONDARY;

var MAX_DEPTH;
var SUB_THRESHOLD;
var SHADE_THRESHOLD;

class Square {
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
		if(this.children.length > 0){
			for(var i=0; i<this.children.length; i++){
				this.children[i].draw();
			}
		} else {
			if(this.shaded){
				fill(PRIMARY);
			} else {
				noFill();
			}
			stroke(PRIMARY);
			rect(this.x,this.y,this.size,this.size);
			//print(this.x,this.y,this.size);
		}
	}

	subdivide() {
		if(this.depth <= MAX_DEPTH){
			if(random(0,1) < pow(SUB_THRESHOLD,this.depth)){
				append(this.children, new Square(this.depth+1,this.x,this.y,this.size/2));
				append(this.children, new Square(this.depth+1,this.x+this.size/2,this.y,this.size/2));
				append(this.children, new Square(this.depth+1,this.x,this.y+this.size/2,this.size/2));
				append(this.children, new Square(this.depth+1,this.x+this.size/2,this.y+this.size/2,this.size/2));
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
	SHADE_THRESHOLD = 0.25;

	createCanvas(1540,800);
	stroke(PRIMARY);
	noLoop();
}

function draw(){
	background(SECONDARY);
	PARENT = new Square(0,470,100,600);
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
