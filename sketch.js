// Define variables
let player,
	panda,
	score,
	squares = [];
let gameover = false;
let gameTitle;

let gameStartButton;
let fontPixel;

// Preload assets
function preload() {
	dude = loadImage('assets/dude.png');
	panda = loadImage('assets/panda.png');
	fontPixel = loadFont('assets/PressStart2P-Regular.ttf');
}

// Set up canvas and initialize game
function setup() {
	let density = displayDensity();
	pixelDensity(density);
	createCanvas(windowWidth, windowHeight);
	frameRate(30);

	textFont(fontPixel);

	gameStartButton = {
		x: width / 2 - 100,
		y: height / 2,

		w: 200,
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

	player = new Player();
	score = 0;
}

function mousePressed() {
	// Check if mouse is within button bounds
	if (
		mouseX > gameStartButton.x &&
		mouseX < gameStartButton.x + gameStartButton.w &&
		mouseY > gameStartButton.y &&
		mouseY < gameStartButton.y + gameStartButton.h
	) {
		// Change background color when button is clicked
		background(random(255), random(255), random(255));
		score = 0;
		gameover = false;
		gameTitle.visible = false;
		// Hide button when it is clicked
		gameStartButton.visible = false;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	gameTitle.x = width / 2 - 500;
	gameTitle.y = height / 2 - 200;
	gameStartButton.x = width / 2 - 100;
	gameStartButton.y = height / 2;
}

// Draw game elements
function draw() {
	background(255);

	if (gameStartButton.visible) {
		if (gameTitle.visible) {
			fill(255);
			rect(gameTitle.x, gameTitle.y, gameTitle.w, gameTitle.h);
			noStroke();
			fill(0);
			textAlign(CENTER, CENTER);
			textSize(65);
			text(
				' P.  K.  P.',
				gameTitle.x + gameTitle.w / 2,
				gameTitle.y + gameTitle.h / 2
			);
		}

		fill(0);
		rect(
			gameStartButton.x,
			gameStartButton.y,
			gameStartButton.w,
			gameStartButton.h
		);
		fill(255);
		textAlign(CENTER, CENTER);
		textSize(32);
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
		textSize(32);
		fill(0);
		textAlign(LEFT);
		text('Score: ' + score, 10, 40);
	}

	// Game over screen
	if (gameover) {
		textSize(64);
		fill(255, 0, 0);
		textAlign(CENTER, TOP);
		text('GAME OVER', width / 2, height / 2 - 200);
		textSize(32);
		text('Final Score: ' + score, width / 2, height / 2 - 75);
		gameStartButton.visible = true;
		squares = [];
	}

	// Add new squares

	// Increase score
	if (!gameover && !gameStartButton.visible) {
		let sq = new Square();
		if (frameCount % 5 === 0 && !gameover) {
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
		this.y = mouseY;
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
	this.size = random(10, 50);
	this.ogX = this.x;
	this.ogY = this.y;

	this.draw = function () {
		fill(0, 0, 0);
		image(panda, this.ogX - this.size / 2, this.ogY - this.size / 2);
		rect(this.x - this.size / 2, this.y - this.size / 2, this.size, 5);
		this.x -= 10;
		if (this.x < -this.size) {
			squares.splice(squares.indexOf(this), 1);
		}
	};
}
