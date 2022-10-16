var hand1 = 0;
var hand2 = 0;
var hand2Scale = 0.75;
var rotSpeed = 1;
var recurseScale = 0.75;
var display;

function setup() {
  var canvas = createCanvas(1000,1000);
  canvas.parent('fractal-clock');
  stroke(255);
  fill(255);
  angleMode(DEGREES);
  hand1 = floor(random(360));
  hand2 = floor(random(360));
}

function draw() {
	translate(width/2, height/2);
	//scale(1, -1);
	background(0);
  hand1 = hand1 - rotSpeed;
  if(hand1 <= 0) {
    hand1 = 360;
    hand2 = hand2 - rotSpeed;
    if(hand2 <= 0){
      hand2 = 360;
		}
	}
  display = "hand 1: " + str(180-hand1) + "; hand 2: " + str(180-hand2);
  text(display, -480, -480);
  drawClock(150, hand1, hand2, 0, -100, 10);
}

function drawClock(handLength, drawAngle1, drawAngle2, x, y, drawCount) {
    drawLine(handLength, drawAngle1, x, y);
    drawLine(handLength * hand2Scale, drawAngle2, x, y);
    if(drawCount > 1) {
        drawCount--;
        drawClock(handLength * recurseScale, drawAngle1 + hand1, drawAngle1 + hand2,
          x + (handLength * sin(drawAngle1)), y + (handLength * cos(drawAngle1)),
          drawCount);
        drawClock(handLength * recurseScale * hand2Scale, drawAngle2 + hand1,
          drawAngle2 + hand2, x + (handLength * hand2Scale * sin(drawAngle2)),
          y + (handLength * hand2Scale * cos(drawAngle2)), drawCount);
		}
}

function drawLine(lineLength, drawAngle, x, y) {
    x2 = x + (lineLength * sin(drawAngle));
    y2 = y + (lineLength * cos(drawAngle));
    line(x,y,x2,y2);
}
