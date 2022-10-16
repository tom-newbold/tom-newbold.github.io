var hand1 = 0;
var hand2 = 0;
var hand2Scale = 0.75;
var rotSpeed = 1;
var recurseScale = 0.75;
var display;

const MIN_FRAME_RATE = 40;
const ALLOWED_LAG_FRAMES = 10;
var lag_frames = 0;
var iterations = 13;

var showAll = true;

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
	background(0);
  hand1 = hand1 - rotSpeed;
  if(hand1 <= 0) {
    hand1 = 360;
    hand2 = hand2 - rotSpeed;
    if(hand2 <= 0){
      hand2 = 360;
		}
	}
  display = "hand 1: " + str((540-hand1)%360) + "; hand 2: " + str((540-hand2)%360);
  text(display, -480, -480);
  if(showAll) {
    drawFullClock(150, hand1, hand2, 0, -100, iterations);
  } else {
    drawMinimalClock(150, hand1, hand2, 0, -100, iterations);
  }

  if(frameRate() < MIN_FRAME_RATE) {
    if(lag_frames < ALLOWED_LAG_FRAMES) {
      lag_frames += 1;
    } else {
      lag_frames = 0;
      if(iterations > 1) {
        iterations -= 1;
      } else {
        noLoop();
      }
    }
  }
  console.log(iterations);
}

function drawFullClock(handLength, drawAngle1, drawAngle2, x, y, drawCount) {
    drawLine(handLength, drawAngle1, x, y);
    drawLine(handLength * hand2Scale, drawAngle2, x, y);
    if(drawCount > 1) {
        drawCount--;
        drawFullClock(handLength * recurseScale, drawAngle1 + hand1, drawAngle1 + hand2,
          x + (handLength * sin(drawAngle1)), y + (handLength * cos(drawAngle1)),
          drawCount);
          drawFullClock(handLength * recurseScale * hand2Scale, drawAngle2 + hand1,
          drawAngle2 + hand2, x + (handLength * hand2Scale * sin(drawAngle2)),
          y + (handLength * hand2Scale * cos(drawAngle2)), drawCount);
		}
}

function drawMinimalClock(handLength, drawAngle1, drawAngle2, x, y, drawCount) {
  if(drawCount > 1) {
      drawCount--;
      drawMinimalClock(handLength * recurseScale, drawAngle1 + hand1, drawAngle1 + hand2,
        x + (handLength * sin(drawAngle1)), y + (handLength * cos(drawAngle1)),
        drawCount);
        drawMinimalClock(handLength * recurseScale * hand2Scale, drawAngle2 + hand1,
        drawAngle2 + hand2, x + (handLength * hand2Scale * sin(drawAngle2)),
        y + (handLength * hand2Scale * cos(drawAngle2)), drawCount);
  } else {
    drawLine(handLength, drawAngle1, x, y);
    drawLine(handLength * hand2Scale, drawAngle2, x, y);
  }
}

function drawLine(lineLength, drawAngle, x, y) {
    x2 = x + (lineLength * sin(drawAngle));
    y2 = y + (lineLength * cos(drawAngle));
    line(x,y,x2,y2);
}

function mousePressed() {
  showAll = !showAll;
}