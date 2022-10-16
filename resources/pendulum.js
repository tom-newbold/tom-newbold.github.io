var airR = false;

class Pendulum {
	constructor(mass, length, angle, pivotPositionX, pivotPositionY, sketch) {
    this.s = sketch;
    this.mass = mass;
    this.length = length;
    this.angle = angle;
    this.angularVelocity = 0;
		this.pivotPosition = new p5.Vector(pivotPositionX, pivotPositionY);
    this.connectedPendulum = null;
	}

  update() {
    //calculating moment
    var moment = 0.5*this.length*this.mass*9.81*this.s.sin(this.angle);
    if (this.connectedPendulum) {
      moment += this.length*this.connectedPendulum.mass*9.81*this.s.sin(this.angle);
    }
    //angular accelaration
    this.angularVelocity += 0.0005 * moment/this.mass
    //air resistance
		if (airR == true){
			this.angularVelocity *= 0.99
		}
    this.angle -= this.angularVelocity
    //update pivot for connected
    if (this.connectedPendulum) {
      this.connectedPendulum.updatePivot(this.pivotPosition.x+this.s.sin(this.angle)*this.length, this.pivotPosition.y+this.s.cos(this.angle)*this.length);
    }
  }

  draw() {
    var x = this.pivotPosition.x
    var y = this.pivotPosition.y
    this.s.line(x, y, x+this.s.sin(this.angle)*this.length, y+this.s.cos(this.angle)*this.length);
  }

	updatePivot(newPivotX, newPivotY) {
		var newPivot = new p5.Vector(newPivotX, newPivotY);
    var x = this.pivotPosition.x+this.s.sin(this.angle)*this.length;
    var y = this.pivotPosition.y+this.s.cos(this.angle)*this.length;
    var deltaX = x-newPivotX;
    var deltaY = y-newPivotY;
    this.angle = this.s.atan(deltaX/deltaY);
    if (deltaY < 0) {
      this.angle += 180;
    }
    this.pivotPosition = newPivot;
	}
}
