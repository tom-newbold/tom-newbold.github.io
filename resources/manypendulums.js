const s_many = ( sketch ) => {
	var pendulums = [];
	var mass = 10;

	sketch.addConnectedPendulum = (prevPendulum, sketch) => {
		var newPendulum = new Pendulum(mass, 16, prevPendulum.angle+1,
			prevPendulum.pivotPosition.x+sketch.sin(prevPendulum.angle)*prevPendulum.length,
			prevPendulum.pivotPosition.y+sketch.cos(prevPendulum.angle)*prevPendulum.length,
			sketch);
		prevPendulum.connectedPendulum = newPendulum
		return newPendulum
	}

	sketch.setup = () => {
		sketch.createCanvas(800,500);
		sketch.background(0);
		sketch.angleMode(sketch.DEGREES);
		//initialize springs
		var s = new Pendulum(mass, 8, 100, 400, 150, sketch);
		pendulums.push(s);
		for(var i = 0; i<128;i++){
			s = sketch.addConnectedPendulum(pendulums[pendulums.length-1], sketch)
			pendulums.push(s);
		}
	};

	sketch.draw = () => {
		sketch.background(0,64);
		sketch.stroke(255);
		for(var i = 0; i<pendulums.length;i++){
			pendulums[i].update()
			pendulums[i].draw()
		}
	}
};

let p5_b = new p5(s_many,'many-pendulums');

/*
function setup() {
	var canvas = createCanvas(400,400);
	canvas.parent('many-pendulums')
	background(0);
	angleMode(DEGREES);
	//initialize springs
	var s = new Pendulum(mass, 8, 100, 200, 150);
	pendulums.push(s);
	for(var i = 0; i<128;i++){
		s = addConnectedPendulum(pendulums[pendulums.length-1])
		pendulums.push(s);
	}
}

function draw() {
	background(0,64);
	stroke(255);
	for(var i = 0; i<pendulums.length;i++){
		pendulums[i].update()
		pendulums[i].draw()
	}
}
*/