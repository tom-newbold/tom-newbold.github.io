var x = 0;
var y = 0;

//var subMode = true;
var subdivisions = 80;
var subdivSlider;
//var offset = 1;
var widthOffset;
var heightOffset;

var probability = 0.5;
var probSlider;

var genButton;

function setup() {
	createCanvas(800,800);
	background(0);

	createP("Subdivisions");
	subdivSlider = createSlider(1,min(width,height)/2,160,1);
	subdivSlider.changed(subdivSliderCallback);

	createP("Probability");
	probSlider = createSlider(0,1,0.5,0.01);
	probSlider.changed(probSliderCallback);

	genButton = createButton("Generate");
	genButton.mousePressed(restart);

	widthOffset = width/subdivisions;
	heightOffset = height/subdivisions;
	/*
	if(subMode){
		widthOffset = width/subdivisions;
		heightOffset = height/subdivisions;
	} else {
		widthOffset = offset;
		heightOffset = offset;
	}
	*/
}

function draw() {
	if(y<height){
		goto10print(x,y);

		x += widthOffset;
		if(x>width){
			y += heightOffset;
			x = 0;
		}
		if(y>=height){
			print("done!");
		}
	}
}

function goto10print(x,y){
	stroke(255);
	if(random(1)<probability){
		line(x,y,x+widthOffset,y+heightOffset);
	} else {
		line(x,y+widthOffset,x+heightOffset,y);
	}
}

function subdivSliderCallback(){
	subdivisions = subdivSlider.value();
	print("Subdivisions:",subdivisions);
	widthOffset = width/subdivisions;
	heightOffset = height/subdivisions;

	background(0);
	x = 0;
	y = 0;
}

function probSliderCallback(){
	probability = probSlider.value();
	print("Probability",probability);

	background(0);
	x = 0;
	y = 0;
}

function restart(){
	print("Generating...")
	background(0);
	x = 0;
	y = 0;
}
