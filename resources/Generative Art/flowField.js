var particles = [];

class Particle {
  constructor(x,y,index,charge) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.charge = charge;
    this.speed = 3;
    this.velocity = 0;
    this.index = index;
  }

  update() {
    this.velocity = p5.Vector.fromAngle(map(noise(this.x*noiseScale,this.y*noiseScale),0,1,0,TWO_PI),this.speed);
    this.velocity *= this.charge;
    this.px = this.x;
    this.x += this.velocity.x;
    this.py = this.y;
    this.y += this.velocity.y;
    if(this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      particles.splice(this.index,1);
      if(this.charge > 0){
        for(i = this.index;i<particles.length;i++){
          if(particles[i]){
            particles[i].index--;
          } else {
            print("undif");
          }
        }
        x = random(width);
        y = random(height);
        newParticlePair(x,y);
      }
    }
  }

  show() {
    line(this.x,this.y,this.px,this.py);
  }
}

var noiseScale = 0.05;
var noiseScaleSlider;
var strokeWeightSlider;


function setup() {
  createCanvas(400, 400);

  createP("Noise Scale");
	noiseScaleSlider = createSlider(0.001,0.1,0.05,0.001);
	noiseScaleSlider.changed(noiseScaleCallback);

  createP("Stroke Weight");
	strokeWeightSlider = createSlider(0.25,4,0.25,0.25);
	strokeWeightSlider.changed(strokeWeightCallback);

  colorMode(RGB);
  background(0);
  stroke(255);
  strokeWeight(0.25);
  for(i=0;i<40;i++){
    x = random(width);
    y = random(height);
    newParticlePair(x,y);
  }
}

function draw() {
  background(0,2);
  for(i=0;i<particles.length;i++){
    particles[i].update();
  }
  for(i=0;i<particles.length;i++){
    particles[i].show();
  }
  //print(frameCount);
  //noLoop();
}

function noiseScaleCallback(){
	noiseScale = noiseScaleSlider.value();
	print("Noise Scale",noiseScale);
  background(0);
}
function strokeWeightCallback(){
	strokeWeightVal = strokeWeightSlider.value();
  strokeWeight(strokeWeightVal);
	print("Stroke Weight",strokeWeightVal);
  background(0);
}
function keyPressed(){
  if(keyCode == ENTER){
    background(0);
  }
}

function newParticlePair(x,y) {
  p = new Particle(x,y,i,1);
  particles.push(p);
  p = new Particle(x,y,i,-1);
  particles.push(p);
}
