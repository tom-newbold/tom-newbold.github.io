/*
var PRIMARY;
var SECONDARY;
const MAX_DEPTH = 8;
const SUB_THRESHOLD = 0.8;
const SHADE_THRESHOLD = 0.25;
*/
var pi;
var PARENT_T;

class Triangle {
	constructor(depth, x, y, size, sketch) {
		this.s = sketch;
		this.depth = depth;
		this.x = x;
		this.y = y;
		this.size = size;
		this.children = [];
		if(this.s.random(0,1) < SHADE_THRESHOLD){
			this.shaded = true;
		} else {
			this.shaded = false;
		}
	}

	draw() {
		if(this.shaded){
			this.s.fill(PRIMARY);
		} else {
			this.s.fill(SECONDARY);
		}
		this.s.stroke(PRIMARY);

		if(this.children.length > 0){
			for(var i=0; i<this.children.length; i++){
				this.children[i].draw();
			}
		} else {
			this.s.beginShape();
			this.s.vertex(this.x,this.y+this.size*this.s.tan(pi/3)/2);
			this.s.vertex(this.x+this.size/2,this.y);
			this.s.vertex(this.x+this.size,this.y+this.size*this.s.tan(pi/3)/2);
			this.s.endShape(this.s.CLOSE);
		}
	}

	subdivide() {
		if(this.depth <= MAX_DEPTH){
			if(this.s.random(0,1) < this.s.pow(SUB_THRESHOLD,this.depth)){
				this.s.append(this.children, new Triangle(this.depth+1,this.x,this.y+this.size*this.s.tan(pi/3)/4,this.size/2,this.s));
				this.s.append(this.children, new Triangle(this.depth+1,this.x+this.size/4,this.y,this.size/2,this.s));
				this.s.append(this.children, new Triangle(this.depth+1,this.x+this.size/2,this.y+this.size*this.s.tan(pi/3)/4,this.size/2,this.s));
				if(this.depth != MAX_DEPTH){
					for(var i=0; i<this.children.length; i++){
						this.children[i].subdivide();
					}
				}
			}
		}
	}
}

// instance

const s_tri = (sketch) => {
	sketch.update = () => {
		sketch.redraw();
	}

	sketch.setup = () => {
		pi = sketch.PI;
		//PRIMARY = sketch.color(34,35,35);
		//SECONDARY = sketch.color(240,246,240);
		var canvas = sketch.createCanvas(400,400);
		canvas.mouseClicked(sketch.update);
		sketch.stroke(PRIMARY);
		sketch.noLoop();
	}

	sketch.draw = () => {
		sketch.background(SECONDARY);
		PARENT_T = new Triangle(0,20,20,360,sketch);
		PARENT_T.subdivide();
		PARENT_T.draw();
	}
}

p5_tri = new p5(s_tri,'triangles');