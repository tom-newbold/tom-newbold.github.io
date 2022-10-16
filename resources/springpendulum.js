const s_spring = ( sketch ) => {
	var springs = [];

	sketch.isSpring = (obj) => {
		if (obj) {
			if (obj.constructor.name == "Spring"){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	
	sketch.addConnectedSpring = (prevSpring, sketch) => {
		var newSpring = new Spring(5, 60, prevSpring.angle+10,
			prevSpring.pivotPosition.x+sketch.sin(prevSpring.angle)*prevSpring.getLength(),
			prevSpring.pivotPosition.y+sketch.cos(prevSpring.angle)*prevSpring.getLength(),
			sketch);
		prevSpring.connectedSpring = newSpring;
		return newSpring;
	}

	sketch.setup = () => {
		sketch.createCanvas(800,500);
		sketch.background(0);
		sketch.angleMode(sketch.DEGREES);
		//initialize springs
		var s = new Spring(5, 30, 90, 400, 100, sketch);
		springs.push(s);
		for(var i=0;i<6;i++){
			s = sketch.addConnectedSpring(springs[springs.length-1], sketch);
			springs.push(s);
		}
	};

	sketch.draw = () => {
		sketch.background(0);
		sketch.stroke(255);
		for(var i = 0; i<springs.length;i++){
			var maxExtension = springs[i].mass;
			if (sketch.isSpring(springs[i].connectedSpring)){
				maxExtension += springs[i].connectedSpring.mass;
			}
			maxExtension /= springs[i].k;
			var col = sketch.map(sketch.abs(springs[i].extension)*1000,0,maxExtension,255,0);
			if (springs[i].extension>0){
				sketch.stroke(col, 255, col);
			} else {
				sketch.stroke(255, col, col);
			}
			springs[i].update();
			springs[i].draw();
		}
	};
};

let p5_a = new p5(s_spring,'spring-pendulums');

/*
function setup() {
	var canvas = createCanvas(400,400);
	canvas.parent('spring-pendulums');
	background(0);
	angleMode(DEGREES);
	//initialize springs
	var s = new Spring(5, 30, 90, 200, 100);
	springs.push(s);
	for(var i=0;i<6;i++){
		s = addConnectedSpring(springs[springs.length-1]);
		springs.push(s);
		//console.log(s.angle);
	}
}

function draw() {
	background(0);
	stroke(255);
	for(var i = 0; i<springs.length;i++){
		var maxExtension = springs[i].mass;
		if (isSpring(springs[i].connectedSpring)){
			maxExtension += springs[i].connectedSpring.mass;
		}
		maxExtension /= springs[i].k;
		var col = map(abs(springs[i].extension)*1000,0,maxExtension,255,0);
		if (springs[i].extension>0){
			stroke(col, 255, col);
		} else {
			stroke(255, col, col);
		}
		springs[i].update();
		springs[i].draw();
	}
	//console.log("final angle: ",springs[3].angle);
	//console.log(springs[springs.length-1].extension);
}
*/