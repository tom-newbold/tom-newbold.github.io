function Vehicle(x,y) {
  this.pos = createVector(random(width),random(height));
  this.target = createVector(x,y);
  this.vel = createVector();
  this.acc = createVector();
  this.size = 8;
  this.fleerad = 80;
  this.maxspeed = 6;
  this.maxforce = 1;
}

Vehicle.prototype.steer = function() {
  //var seek = this.seek(this.target);
  //this.applyForce(seek);
  var arrive = this.arrive(this.target);
  var mouse = createVector(mouseX,mouseY);
  var flee = this.flee(mouse);
  arrive.mult(1);
  flee.mult(3);
  this.applyForce(arrive);
  this.applyForce(flee);
}

Vehicle.prototype.arrive = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  var speed = this.maxspeed;
  if(d < 50) {
    speed = map(d, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
}

Vehicle.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  desired.setMag(this.maxspeed);
  var steer = p5.Vector.sub(target, this.vel);
  steer.limit(this.maxforce);
  return steer;
}

Vehicle.prototype.flee = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  if(d < this.fleerad) {
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0,0);
  }
}

Vehicle.prototype.applyForce = function(force) {
  this.acc.add(force);
}

Vehicle.prototype.update = function() {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Vehicle.prototype.show = function() {
  stroke(255);
	strokeWeight(this.size);
  point(this.pos.x,this.pos.y);
};