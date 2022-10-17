var MAX_DEPTH_RECT;
var BUFFER;

class Square_Rect {
	constructor(depth, repeats, x, y, size, sketch) {
		this.s = sketch;
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
			this.s.stroke(PRIMARY);
			this.s.noFill();
			for(var i=0; i<this.repeats; i++){
				rect_vert(this.x,this.y,this.size,this.s);
			}
			//print(this.x,this.y,this.size);
		}
	}

	subdivide() {
		if(this.depth <= MAX_DEPTH_RECT){
			var s_ = (this.size-BUFFER)/2;
			this.s.append(this.children, new Square_Rect(this.depth+1,this.repeats+this.s.random([-1,0,1]),this.x,this.y,s_,this.s));
			this.s.append(this.children, new Square_Rect(this.depth+1,this.repeats+this.s.random([-1,0,1]),this.x+s_+BUFFER,this.y,s_,this.s));
			this.s.append(this.children, new Square_Rect(this.depth+1,this.repeats+this.s.random([-1,0,1]),this.x,this.y+s_+BUFFER,s_,this.s));
			this.s.append(this.children, new Square_Rect(this.depth+1,this.repeats+this.s.random([-1,0,1]),this.x+s_+BUFFER,this.y+s_+BUFFER,s_,this.s));
			if(this.depth != MAX_DEPTH_RECT){
				for(var i=0; i<this.children.length; i++){
					this.children[i].subdivide();
				}
			}
		}
	}
}

function rect_vert(x, y, size, sketch){
	sketch.beginShape();
	var var_out = 0.1;
	var var_in = 0.3;
	var var_all = 0.15;
	x += BUFFER*sketch.random(-var_all,var_all);
	y += BUFFER*sketch.random(-var_all,var_all);
	sketch.vertex(x+BUFFER*sketch.random(-var_out,var_in),y+BUFFER*sketch.random(-var_out,var_in));
	sketch.vertex(x+size+BUFFER*sketch.random(-var_in,var_out),y+BUFFER*sketch.random(-var_out,var_in));
	sketch.vertex(x+size+BUFFER*sketch.random(-var_in,var_out),y+size+BUFFER*sketch.random(-var_in,var_out));
	sketch.vertex(x+BUFFER*sketch.random(-var_out,var_in),y+size+BUFFER*sketch.random(-var_in,var_out));
	sketch.endShape(sketch.CLOSE);
}

var PARENT_R;

const s_rect = (sketch) => {
	sketch.update = () => {
		sketch.redraw();
	}

	sketch.setup = () => {
		//PRIMARY = sketch.color(34,35,35);
		//SECONDARY = sketch.color(240,246,240);
		MAX_DEPTH_RECT = 2;
		BUFFER = 20;
		PRIMARY = sketch.color(255);
		SECONDARY = sketch.color(0);
		var canvas = sketch.createCanvas(800,400);
		canvas.mouseClicked(sketch.update);
		sketch.stroke(PRIMARY);
		sketch.noLoop();
	}

	sketch.draw = () => {
		sketch.background(SECONDARY);
		PARENT_R = [new Square_Rect(0,4,10,10,380,sketch), new Square_Rect(0,4,410,10,380,sketch)];
		/*
		PARENT_R.forEach((p) => {
			p.subdivide();
			p.draw();
		});*/
		PARENT_R[0].subdivide();
		PARENT_R[1].subdivide();
		PARENT_R[0].draw();
		PARENT_R[1].draw();
	}
}

p5_rect = new p5(s_rect,'squares');
