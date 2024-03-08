// Todo: Add control mode selection

// Define variables
let player,
	panda,
	score,
	squares = [];
let gameover = false;
let gameTitle;

let gameStartButton;
let fontPixel;

// Declare ml5 variables for handpose, video capture, and hands data
let handpose;
let video;
let hands = [];
let controlMode = 'handpose';

// Preload assets
function preload() {
	dude = loadImage('assets/dude.png');
	panda = loadImage('assets/panda.png');
	fontPixel = loadFont('assets/PressStart2P-Regular.ttf');

	handpose = ml5.handpose();
}

function gotHands(results) {
	hands = results;
}

// Set up canvas and initialize game
function setup() {
	let density = displayDensity();
	pixelDensity(density);
	createCanvas(windowWidth, windowWidth * (3 / 4));
	video = createCapture(VIDEO);
	video.size(windowWidth, windowWidth * (3 / 4));
	video.hide();
	handpose.detectStart(video, gotHands);
	frameRate(30);

	textFont(fontPixel);

	if (width > height) {
		gameStartButton = {
			x: width / 2 - width / 10,
			y: height / 2,

			w: width / 5,
			h: 80,
			visible: true,
		};

		gameTitle = {
			x: width / 2 - 500,
			y: height / 2 - 200,

			w: 1000,
			h: 100,
			visible: true,
		};
	} else {
		gameStartButton = {
			x: width / 2 - width / 4,
			y: height / 2,

			w: width / 2,
			h: 80,
			visible: true,
		};

		gameTitle = {
			x: width / 2 - 500,
			y: height / 2 - 200,

			w: 1000,
			h: 100,
			visible: true,
		};
	}

	player = new Player();
	score = 0;
}

function mousePressed() {
	// Check if game start button is visible
	if (gameStartButton.visible) {
		// Check if mouse is within button bounds
		if (
			mouseX > gameStartButton.x &&
			mouseX < gameStartButton.x + gameStartButton.w &&
			mouseY > gameStartButton.y &&
			mouseY < gameStartButton.y + gameStartButton.h
		) {
			// Change background color when button is clicked
			score = 0;
			gameover = false;
			gameTitle.visible = false;
			// Hide button when it is clicked
			gameStartButton.visible = false;
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	if (width > height) {
		gameStartButton = {
			x: width / 2 - width / 10,
			y: height / 2,

			w: width / 5,
			h: 80,
			visible: gameStartButton.visible,
		};

		gameTitle = {
			x: width / 2 - 500,
			y: height / 2 - 200,

			w: 1000,
			h: 100,
			visible: gameTitle.visible,
		};
	} else {
		gameStartButton = {
			x: width / 2 - width / 4,
			y: height / 2,

			w: width / 2,
			h: 80,
			visible: gameStartButton.visible,
		};

		gameTitle = {
			x: width / 2 - 500,
			y: height / 2 - 200,

			w: 1000,
			h: 100,
			visible: gameTitle.visible,
		};
	}
}

// Draw game elements
function draw() {
	background(255, 255, 255);
	push();
	translate(width, 0);
	scale(-1, 1);
	fill(255);
	image(video, 0, 0, width, height);
	pop();

	fill(255, 255, 255, 100);
	rect(0, 0, width, height);

	if (gameStartButton.visible) {
		if (gameTitle.visible) {
			// Game title
			noStroke();
			fill(0);
			textAlign(CENTER, CENTER);
			textSize(width > height ? width / 20 : width / 15);
			text(
				' P.  K.  P.',
				gameTitle.x + gameTitle.w / 2,
				gameTitle.y + gameTitle.h / 2
			);
		}

		// Start button
		fill(0);
		rect(
			gameStartButton.x,
			gameStartButton.y,
			gameStartButton.w,
			gameStartButton.h
		);
		fill(255);
		textAlign(CENTER, CENTER);
		textSize(width > height ? width / 40 : width / 20);
		text(
			'Start',
			gameStartButton.x + gameStartButton.w / 2,
			gameStartButton.y + gameStartButton.h / 2
		);
	} else {
		// Update player
		player.update();

		// Draw player and squares
		player.draw();
		for (var i = 0; i < squares.length; i++) {
			squares[i].draw();
			if (player.collidesWith(squares[i])) {
				gameover = true;
			}
		}

		// Display score
		textSize(width > height ? width / 100 : width / 40);
		fill(0);
		textAlign(LEFT);
		text('Score: ' + score, 10, 40);
	}

	// Game over screen
	if (gameover) {
		// Game over text
		textSize(width > height ? width / 20 : width / 10);
		fill(255, 0, 0);
		textAlign(CENTER, TOP);
		text('GAME OVER', width / 2, height / 2 - 300);
		// Final score text
		textSize(width > height ? width / 60 : width / 30);
		text('Final Score: ' + score, width / 2, height / 2 - 100);
		gameStartButton.visible = true;
		squares = [];
	}

	// Add new squares

	// Increase score
	if (!gameover && !gameStartButton.visible) {
		let sq = new Square();
		if (frameCount % 20 === 0 && !gameover) {
			squares.push(sq);
		}
		score++;
	}
}

// Player class
function Player() {
	this.x = width / 8;
	this.y = height / 2;
	this.size = 80;

	this.update = function () {
		this.x = width / 8;
		if (controlMode == 'pointer') {
			this.y = mouseY;
		} else if (controlMode == 'handpose') {
			let scaleY = height / 480;
			if (hands.length > 0) {
				this.y = hands[0].index_finger_dip.y * scaleY;
			}
		}
	};

	this.draw = function () {
		image(
			dude,
			this.x - this.size / 2,
			this.y - this.size / 2,
			this.size,
			this.size,
			0,
			0
		);
	};

	// Check if player collides with another object
	this.collidesWith = function (obj) {
		if (
			obj != undefined &&
			dist(this.x, this.y, obj.x, obj.y) < this.size / 2 + obj.size / 2
		) {
			return true;
		}
		return false;
	};
}

// Square class
function Square() {
	this.x = random(width / 2, width);
	this.y = random(height);
	this.size = 5;
	this.length = 10;
	this.ogX = this.x;
	this.ogY = this.y;

	this.draw = function () {
		fill(0, 0, 0);
		image(panda, this.ogX, this.ogY - 40, 80, 80);
		rect(
			this.x - this.length / 2,
			this.y - this.size / 2,
			this.length,
			this.size
		);
		this.x -= 10;
		if (this.x < -this.size) {
			this.x = this.ogX; //squares.splice(squares.indexOf(this), 1);
		}
	};
}
