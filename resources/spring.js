var timeScale = 0.0001;
var airR = false;

class Spring {
	constructor(mass, length, angle, pivotPositionX, pivotPositionY, sketch) {
    this.s = sketch;
    this.mass = mass;
		//this.k = 2;
		this.k = 0.0005;
    this.length = length;
		this.extension = 0;
    this.angle = angle;
    this.angularVelocity = 0;
		this.pivotPosition = new p5.Vector(pivotPositionX, pivotPositionY);
    this.connectedSpring = null;
	}

	getLength() {
		return this.length+this.extension;
	}

  update() {
    //calculating moment
    var moment = 0.5*this.getLength()*this.mass*9.81*this.s.sin(this.angle);
    if (this.connectedSpring) {
      moment += this.getLength()*this.connectedSpring.mass*9.81*this.s.sin(this.angle);
    } //else large force to mouse position from end
    //angular accelaration
    this.angularVelocity += timeScale * moment/this.mass;
    //air resistance
		if (airR == true){
    	this.angularVelocity *= 0.99;
		}
    this.angle -= this.angularVelocity;

		//calculate extension
		var m = this.mass;
		if (this.connectedSpring){
			m += this.connectedSpring.mass;
		}
		var force = m*9.81*this.s.cos(this.angle) - this.k*this.extension;
		this.extension = timeScale * force/this.k;

    //update pivot for connected
    if (this.connectedSpring) {
      this.connectedSpring.updatePivot(this.pivotPosition.x+this.s.sin(this.angle)*this.getLength(), this.pivotPosition.y+this.s.cos(this.angle)*this.getLength());
			//console.log("connected update:", this.connectedSpring.angle);
    }
  }

  draw() {
    var x = this.pivotPosition.x;
    var y = this.pivotPosition.y;
    this.s.line(x, y, x+this.s.sin(this.angle)*this.getLength(), y+this.s.cos(this.angle)*this.getLength());
  }

	updatePivot(newPivotX, newPivotY) {
		var newPivot = new p5.Vector(newPivotX, newPivotY);
    var x = this.pivotPosition.x+this.s.sin(this.angle)*this.getLength();
    var y = this.pivotPosition.y+this.s.cos(this.angle)*this.getLength();
    var deltaX = x-newPivotX;
    var deltaY = y-newPivotY;
    this.angle = this.s.atan(deltaX/deltaY);
    if (deltaY < 0) {
      this.angle += 180;
    }
    this.pivotPosition = newPivot;
	}
}
