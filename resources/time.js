var font;
var vehicles = [];

var psc = '0';
var deletepoints = false;

function preload() {
	font = loadFont('../fonts/arial.ttf');
}

function setup() {
	var canvas = createCanvas(1000,800);
	canvas.parent('time');
	var points = font.textToPoints('00:00:00',100,350,200);
	for(p of points) {
		var vehicle = new Vehicle(p.x,p.y);
		vehicles.push(vehicle);
	}
}

function draw() {
	var hr = hour();
	var mn = minute();
	var sc = second();

	if(sc!=psc) {
		var time = "";
	  if(hr<10) {
	    time += "0" + hr;
	  } else {
	    time += hr;
	  }
	  time += ":";
	  if(mn<10) {
	    time += "0" + mn;
	  } else {
	    time += mn;
	  }
	  time += ":";
	  if(sc<10) {
	    time += "0" + sc;
	  } else {
	    time += sc;
	  }
		points = font.textToPoints(time,100,350,200);
		if(points.length>vehicles.length) {
			for(i=0;i<vehicles.length;i++) {
				var p = points[i];
				var v = vehicles[i];
				v.replaceTarget(p.x,p.y);
			}
			for(i=vehicles.length;i<points.length;i++) {
				var pstart = createVector(850,350);
				var ptar = points[i];
				var v = new Vehicle(pstart.x,pstart.y);
				v.replaceTarget(ptar.x,ptar.y);
				vehicles.push(v);
			}
			deletepoints = false;
		} else {
			deletepoints = true;
		}
		psc = sc;
	}

	if(deletepoints==true) {
		for(i=0;i<points.length;i++) {
			var p = points[i];
			var v = vehicles[i];
			v.replaceTarget(p.x,p.y);
		}
		for(i=points.length;i<vehicles.length;i++) {
			vehicles.pop();
		}
	}

	background(0);
	for(v of vehicles) {
		v.steer();
		v.update();
		v.show();
	}
}
