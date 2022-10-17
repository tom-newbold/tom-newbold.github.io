const s_goto = ( sketch ) => {
	var x = 0;
	var y = 0;
	//var subdivisions = 40;
	var offset = 8;
	var probability = 0.5;

	sketch.goto10print = (x,y) => {
		sketch.stroke(255);
		if(sketch.random(1)<probability){
			sketch.line(x,y,x+offset,y+offset);
		} else {
			sketch.line(x,y+offset,x+offset,y);
		}
	}

	sketch.setup = () => {
		sketch.createCanvas(document.getElementById('goto-10').clientWidth,800);
		sketch.background(0);
		//offset = sketch.width/subdivisions;
	}

	sketch.draw = () => {
		if(y<sketch.height){
			sketch.goto10print(x,y);
	
			x += offset;
			if(x>sketch.width){
				y += offset;
				x = 0;
			}
			if(y>=sketch.height){
				sketch.noLoop();
			}
		}
	}
}

p5_goto = new p5(s_goto,'goto-10');
