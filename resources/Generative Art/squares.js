var PRIMARY;
var SECONDARY;

var MAX_DEPTH;
var BUFFER;

class Square {
	constructor(depth, repeats, x, y, size) {
		this.depth = depth;
		this.repeats = repeats;
		this.x = x;
		this.y = y;
		this.size = size;
		this.children = [];
	}

	draw() {
		if(this.children.length > 0){
			for(var i=0; i<this.children.length; i++){
				this.children[i].draw();
			}
		} else {
			stroke(PRIMARY);
			noFill();
			for(var i=0; i<this.repeats; i++){
				rect_vert(this.x,this.y,this.size);
			}
			//print(this.x,this.y,this.size);
		}
	}

	subdivide() {
		if(this.depth <= MAX_DEPTH){
			var s = (this.size-BUFFER)/2;
			append(this.children, new Square(this.depth+1,this.repeats+random([-1,0,1]),this.x,this.y,s));
			append(this.children, new Square(this.depth+1,this.repeats+random([-1,0,1]),this.x+s+BUFFER,this.y,s));
			append(this.children, new Square(this.depth+1,this.repeats+random([-1,0,1]),this.x,this.y+s+BUFFER,s));
			append(this.children, new Square(this.depth+1,this.repeats+random([-1,0,1]),this.x+s+BUFFER,this.y+s+BUFFER,s));
			if(this.depth != MAX_DEPTH){
				for(var i=0; i<this.children.length; i++){
					this.children[i].subdivide();
				}
			}
		}
	}
}

function rect_vert(x, y, size){
	beginShape();
	var var_out = 0.15;
	var var_in = 0.35;
	var var_all = 0.2;
	x += BUFFER*random(-var_all,var_all);
	y += BUFFER*random(-var_all,var_all);
	vertex(x+BUFFER*random(-var_out,var_in),y+BUFFER*random(-var_out,var_in));
	vertex(x+size+BUFFER*random(-var_in,var_out),y+BUFFER*random(-var_out,var_in));
	vertex(x+size+BUFFER*random(-var_in,var_out),y+size+BUFFER*random(-var_in,var_out));
	vertex(x+BUFFER*random(-var_out,var_in),y+size+BUFFER*random(-var_in,var_out));
	endShape(CLOSE);
}

var PARENT;

function setup() {
	PRIMARY = color(34,35,35);
	SECONDARY = color(240,246,240);
	MAX_DEPTH = 2;
	BUFFER = 25;

	createCanvas(1540,800);
	stroke(PRIMARY);
	noLoop();
}

function draw(){
	background(SECONDARY);
	PARENT = new Square(0,4,470,100,600);
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

function mouseClicked(){
	if(MAX_DEPTH==2){
		MAX_DEPTH=3;
	} else {
		MAX_DEPTH=2;
	}
	redraw();
}
