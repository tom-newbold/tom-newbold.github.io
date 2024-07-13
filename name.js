var w = document.documentElement.clientWidth-50;
var h = window.innerHeight; // 800

var font;
var vehicles = [];

function preload() {
	fontItalic = loadFont('fonts/RobotoCondensed-Italic.ttf');
	fontThinItalic = loadFont('fonts/RobotoCondensed-LightItalic.ttf');
}

function setup() {
    let text = 'Thomas Newbold';
    let tSize = 150;
    let canvas = createCanvas(w,h-100);
	canvas.parent('p5-canvas');
	var points = fontItalic.textToPoints(text,w/2,50 + h/2,tSize);
	var bounds = fontItalic.textBounds(text,w/2,50 + h/2,tSize);
	for(p of points) {
		var vehicle = new Vehicle(p.x-bounds.w/2,p.y-bounds.h/2);
		vehicles.push(vehicle);
	}
}

function draw() {
	background(0);
	fill(200);
	for(v of vehicles) {
		v.steer();
		v.update();
		v.show();
	}

	textSize(70);
	textAlign(CENTER);
	noStroke();
	fill(255,0,0,200);
	textFont(fontThinItalic);
	//text('P R O G R A M M E R', w/2, 20 + h/2);
	text('SOFTWARE ENGINEER', w/2, 20 + h/2);
}
