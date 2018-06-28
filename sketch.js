var system;
var frameA = 0;
var birthRate = 20;
var startHeight = 0;
var startCount = 0;
var xLineCoordinates = [];
var yLineCoordinates = [];
var zLineCoordinates = [];
var currentRotY = 0;
var currentRotX = -0.31;
var globalRotY = 0.02;
var shapeArray = [3, 4, 66];
var shapeArrayRes = [3, 4, 33];
var shapeIndex = 2;


var moveCamera = false;
var cameraValue = 0;
var cameraJump = 30;
var moveLeftRight = 0;

var modelIndex = 0;
var modelArray = [];
var modelColors;

let apple;
let carrot;
var currentModel;
var fruitScale = 1;
var ambientLightLevel = 0;

var backgroundColore = 0;
var particleColore = 0;

var dragged = false;

var coordMin = -1000;
var coordMax = 1000;

var initialMouseX = 0;
var initialMouseY = 0;
var initialRotX = 0;
var initialRotY = 0;


//Preload 3D Model
function preload(){
	apple = {
		model:loadModel('Apple.obj'),
		scale:1
	};
	console.log('model loaded')
	carrot = {
		model:loadModel('Carrot.obj'),
		scale:20
	};
	console.log('model loaded')
	broccoli = {
		model:loadModel('Broccoli.obj'),
		scale:20
	};
	console.log('model loaded')
	banana = {
		model:loadModel('BANANA.obj'),
		scale:10
	};
	console.log('model loaded')
	grapes = {model:loadModel('Grapes_01.obj'),
		scale:14
	};
	console.log('model loaded')
	cucumber = {model:loadModel('cucumber.obj'),
		scale:25
	};
	console.log('model loaded')

	modelArray[0]=apple;
	modelArray[1]=carrot;
	modelArray[2]=broccoli;
	modelArray[3]=banana;
	modelArray[4]=grapes;
	modelArray[5]=cucumber;
}

//Setup Window
function setup() {
	//Setting up the 3D canvas
	var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
	canvas.parent("#sketch");

	document.getElementById('sketch').addEventListener('touchmove', function(e) {

		e.preventDefault();

	}, false);

	var fov = 60 / 180 * PI;
	var cameraZ = (height / 2.0) / tan(fov / 2.0);
	var cameraZMove = cameraZ;
	perspective(60 / 180 * PI, width / height, cameraZ * .02, cameraZ * 10);

	system = new ParticleSystem(createVector(windowWidth / 2, startHeight));
	system.addParticle();

	frameRate(60);
}

//every 60th second
function draw() {

	//Key Motion
	if (keyIsDown(UP_ARROW)){
			cameraValue += cameraJump/4;
	}
	if (keyIsDown(DOWN_ARROW)) {
			cameraValue -= cameraJump/4;
	} 
	if (keyIsDown(LEFT_ARROW)) {
			moveLeftRight += cameraJump/4;
	}	
	if (keyIsDown(RIGHT_ARROW)) {
			moveLeftRight -= cameraJump/4;
	}

	translate(moveLeftRight,0,cameraValue);
	
	background(backgroundColore);

	//rotating the fruit
	rotateX(currentRotX + radians(-rotationX));
	rotateY(currentRotY + globalRotY + radians(-rotationZ));

	//Mouse Motion
	if (!mouseIsPressed) {
		globalRotY += 0.002;
	}

	//lighting
	ambientLight(ambientLightLevel);
	directionalLight(20, 20, 20);

	system.run();
	everyFrame();
}

//A timing function to control the generation speed of balls
function everyFrame() {

	if (frameA < birthRate) {
		frameA++;
	} else {
		system.addParticle();
		frameA = 0;
	}
}

//Taking Care of a better orbit control, one that doesn't reset.  Adapted from the orbitControl() function
function mousePressed() {
	initialMouseX = this.mouseX;
	initialMouseY = this.mouseY;
	initialRotX = currentRotX;
	initialRotY = currentRotY;
	dragged = false;

}

function mouseDragged() {
	dragged = true;
	currentRotY = initialRotY + ((this.mouseX - initialMouseX) * 2) / (this.width / 2);
	currentRotX = initialRotX + ((this.mouseY - initialMouseY) * 2) / (this.width / 2);
}

function mouseReleased() {

	if (!dragged) {
		if (modelIndex < modelArray.length - 1) {
			modelIndex++;
		} else {
			modelIndex = 0;
		}
	}
}

// function keyPressed() {
//   if (keyCode === UP_ARROW) {
//   	backgroundColore = 0;
//   	particleColore = 255;
//   	console.log('up pressed');
//   	moveCamera = true;
//   	cameraValue += cameraJump;
//     //fillVal = 255;
//   } else if (keyCode === DOWN_ARROW) {
//   	backgroundColore = 255;
//   	particleColore = 30;
//   	moveCamera = true;
//   	cameraValue -= cameraJump;
//     //fillVal = 0;
//   }
//   return false; // prevent default
// }


var Particle = function(position) {
	this.velocity = createVector(0, 2);
	this.position = position.copy();
	this.position.y = -(windowHeight / 2) - 350;
	this.position.x = random(-windowWidth / 2, windowWidth / 2);
	this.position.z = random(600, -600);
	this.rotationSpeedX = random(0, 0.02);
	this.rotationSpeedY = random(0, 0.02);
	this.rotationSpeedZ = random(0, 0.02);
	this.lifespan = 800.0;
};

Particle.prototype.run = function() {
	this.update();
	this.display();
};

Particle.prototype.update = function() {
	this.position.add(this.velocity);
	this.lifespan -= 1;
};

Particle.prototype.display = function() {
	noStroke();
	//stroke(255);
	//strokeWeight(800);

	var newY = animateCircle(this.position.y, this.velocity.y)[0];
	this.velocity.y = animateCircle(this.position.y, this.velocity.y)[1];

	// if (this.lifespan > 800 - 255) {
	// 	specularMaterial(abs((this.lifespan * -1) + 800));
	// } else {
	// 	specularMaterial(this.lifespan);
	// }

	if (modelIndex == 1){
		fruitScale = 20;
		modelColors = color(255, 92, 0, 300, 1, 1);
		ambientLightLevel = 175;
	}else if (modelIndex == 2){
		ambientLightLevel = 80;
		modelColors = color(10, 255, 10);
	}else if (modelIndex == 3){
		ambientLightLevel = 100;
		modelColors = color(255, 225, 53);
	}else if (modelIndex == 4){
		ambientLightLevel = 200;
		modelColors = color(86, 53, 138, 300, 1, 1);
	}else if (modelIndex == 5){
		ambientLightLevel = 70;
		modelColors = color(0, 225, 53);
	}else{
		ambientLightLevel = 80;
		modelColors = color(170,15,0);
	}


	push();
	translate(this.position.x, this.position.y, this.position.z);
	rotateZ(frameCount * this.rotationSpeedZ);
	rotateX(frameCount * this.rotationSpeedX);
	rotateY(frameCount * this.rotationSpeedY);
	scale(modelArray[modelIndex].scale);
	specularMaterial(modelColors);
	model(modelArray[modelIndex].model);
	pop();

};

// Is the particle still useful?
Particle.prototype.isDead = function() {
	if (this.lifespan < 0) {
		return true;
	} else {
		return false;
	}
};

var ParticleSystem = function(position) {
	this.origin = position.copy();
	this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
	this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
	for (var i = this.particles.length - 1; i >= 0; i--) {
		var p = this.particles[i];
		p.run();
		if (p.isDead()) {
			this.particles.splice(i, 1);
		}
	}
};

function animateCircle(circleY, yVel) {

	circleY += yVel;

	return [circleY, yVel];
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
