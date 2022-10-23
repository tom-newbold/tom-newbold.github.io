var row = 0;
var rowsPerFrame = 4;

var subdivisions = 30;
var offset = 1;
var widthOffset;
var heightOffset;

var noiseX;
var noiseY;
var noiseScale = 0.02;

var toDraw = true;

function setup() {
	var canvas = createCanvas(800,800);
	canvas.parent('pixel-map');
	background(0);
	widthOffset = offset;
	heightOffset = offset;
	regenNoise();
}

function draw() {
	if(toDraw){
		for(i = 0; i < rowsPerFrame; i++){
			drawRow()
			row += heightOffset;
			if(row>height){
				print("Done!");
				toDraw = false;
				break;
			}
		}
	}
}

function drawRow(){
	for(x = 0; x < width; x += widthOffset){
		pixelGrid(x,row);
	}
}

function drawGrid(){
	for(x = 0; x < width; x += widthOffset){
		for(y = 0; y < height; y += heightOffset){
			pixelGrid(x,y);
		}
	}
}

function heightMapColour(val){
	// colour palette
	if(val >= 0 & val <= 0.4){
		//dark blue
		stroke(0, 62, 178);
		fill(0, 62, 178);
	} else if(val > 0.4 & val <= 0.45){
		//light blue
		stroke(9, 82, 198);
		fill(9, 82, 198);
	}	else if(val > 0.45 & val <= 0.48){
		//sand
		stroke(194, 178, 129);
		fill(194, 178, 129);
	}	else if(val > 0.48 & val <= 0.55){
		//dark grass
		stroke(92, 128, 51);
		fill(92, 128, 51);
	} else if(val > 0.55 & val <= 0.65){
		//light grass
		stroke(120, 157, 80);
		fill(120, 157, 80);
	} else if(val > 0.65 & val <= 0.7){
		//dark stone
		stroke(140, 142, 123);
		fill(140, 142, 123);
	} else if(val > 0.7 & val <= 0.75){
		//light stone
		stroke(160, 162, 143);
		fill(160, 162, 143);
	} else if(val > 0.75 & val <= 1){
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
	// octaves
	pixelHeight = ( 2*warp(posX,posY,10) + 3*warp(posX/2,posY/2,5) + 4*warp(posX/10,posY/10,1) )/9;
	heightMapColour(pixelHeight);
	rect(x,y,widthOffset,heightOffset);
}

function warp(x,y,n) {
	// domain warping
	warpAmp = n*noiseScale;
	newX = x + warpAmp*noise(x+noiseX,y);
	newY = y + warpAmp*noise(x,y+noiseX);
	return noise(newX,newY);
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

function mousePressed() {
	background(0);
	regenNoise()
}