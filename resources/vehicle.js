function Vehicle(x,y) {
  this.pos = createVector(x,y);
  this.target = createVector(x,y);
  this.vel = createVector();
  this.acc = createVector();
  this.size = 6;
  this.maxspeed = 10;
  this.maxforce = 4;
}

Vehicle.prototype.steer = function() {
  //var seek = this.seek(this.target);
  //this.applyForce(seek);
  var arrive = this.arrive(this.target);
  this.applyForce(arrive);
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

Vehicle.prototype.replaceTarget = function(x,y) {
  this.target = createVector(x,y);
}
