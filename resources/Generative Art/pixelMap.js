var row = 0;
var rowsPerFrame = 4;

var subMode = false;
var subdivisions = 30;
var offset = 1;
var widthOffset;
var heightOffset;

var noiseX;
var noiseY;
var noiseScale = 0.02;

var grayscale = false;
var toDraw = true;

var subdivSlider;
var noiseScaleSlider;
var genButton;

function setup() {
	createCanvas(800,800);
	background(0);
	if(subMode){
		widthOffset = width/subdivisions;
		heightOffset = height/subdivisions;
	} else {
		widthOffset = offset;
		heightOffset = offset;
	}

	createP("Pixel Size");
	offsetSlider = createSlider(1,min(width,height)/subdivisions,1,1);
	offsetSlider.changed(offsetCallback);

	createP("Noise Scale");
	noiseScaleSlider = createSlider(0.001,0.1,0.02,0.001);
	noiseScaleSlider.changed(noiseScaleCallback);

	genButton = createButton("Generate");
	genButton.mousePressed(regenNoise);

	regenNoise();
}

function draw() {
	if(toDraw){
		//print("Drawing...")
		for(i = 0; i < rowsPerFrame; i++){
			drawRow()
			row += heightOffset;
			if(row>height){
				print("Done!");
				toDraw = false;
				break
			}
		}
	}
	/*
	if(toDraw){
		print("Drawing...")
		drawGrid();
		print("Done!");
		toDraw = false;
	}
	*/
}

function drawRow(){
	for(x = 0; x < width; x += widthOffset){
		if(grayscale){
			grayscaleGrid(x,row);
		} else {
			pixelGrid(x,row);
		}
	}
}

function drawGrid(){
	for(x = 0; x < width; x += widthOffset){
		for(y = 0; y < height; y += heightOffset){
			if(grayscale){
				grayscaleGrid(x,y);
			} else {
				pixelGrid(x,y);
			}
		}
	}
}

function heightMapColour(val){
	if(val >= 0 & val <= 0.4){
		//dark blue
		stroke(0, 62, 178);
		fill(0, 62, 178);
	} else if(val > 0.4 & val <= 0.45){
		//light blue
		stroke(9, 82, 198);
		fill(9, 82, 198);
	}	else if(val > 0.45 & val <= 0.5){
		//sand
		stroke(194, 178, 129);
		fill(194, 178, 129);
	}	else if(val > 0.5 & val <= 0.6){
		//dark grass
		stroke(92, 128, 51);
		fill(92, 128, 51);
	} else if(val > 0.6 & val <= 0.7){
		//light grass
		stroke(120, 157, 80);
		fill(120, 157, 80);
	} else if(val > 0.7 & val <= 0.75){
		//dark stone
		stroke(140, 142, 123);
		fill(140, 142, 123);
	} else if(val > 0.75 & val <= 0.8){
		//light stone
		stroke(160, 162, 143);
		fill(160, 162, 143);
	} else if(val > 0.8 & val <= 1){
		//snow
		stroke(235, 235, 235);
		fill(235, 235, 235);
	} else {
		stroke(0);
		noFill();
	}
}

function pixelGrid(x,y){
	posX = x*noiseScale + noiseX;
	posY = y*noiseScale + noiseY;
	pixelHeight = noise(posX,posY);
	//print(pixelHeight);
	heightMapColour(pixelHeight);
	rect(x,y,widthOffset,heightOffset);
}

function grayscaleGrid(x,y){
	posX = x*noiseScale + noiseX;
	posY = y*noiseScale + noiseY;
	pixelHeight = noise(posX,posY);
	//print(pixelHeight);
	stroke(pixelHeight*255);
	fill(pixelHeight*255);
	rect(x,y,widthOffset,heightOffset);
}

function reset(){
	toDraw = true;
	row = 0;
}

function regenNoise(){
	noiseX = random(0,1000000);
	noiseY = random(0,1000000);

	reset();
}

function keyPressed(){
  if(keyCode == ENTER){
		/*
		if(!toDraw){
    	grayscale = !grayscale;
			toDraw = true;
			row = 0;
		}
		*/
		grayscale = !grayscale;
		reset();
  }
}

function offsetCallback(){
	offset = offsetSlider.value();
	print("Pixel Size:",offset);
	widthOffset = offset;
	heightOffset = offset;

	reset();
}

function noiseScaleCallback(){
	noiseScale = noiseScaleSlider.value();
	print("Noise Scale",noiseScale);
	regenNoise();

	reset();
}
