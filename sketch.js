/*


let dude;
let pandaCounter = 0;



function setup() {
	let density = displayDensity();
	pixelDensity(density);
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(256);
	image(dude, windowWidth / 4, mouseY);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
} */

// Define variables
let player,
	score,
	squares = [];
let gameover = false;
let gameTitle

let gameStartButton;
let 

// Preload assets
function preload() {
	dude = loadImage('assets/dude.png');
	frameCount(30);
}

// Set up canvas and initialize game
function setup() {
	let density = displayDensity();
	pixelDensity(density);
	createCanvas(windowWidth, windowHeight);
	gameStartButton = {
		x: width / 2 - 100,
		y: height / 2,

		w: 200,
		h: 100,
		visible: true,
	};

    gameTitle = {
		x: width / 2 - 500,
		y: height / 2-200,

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
}

// Draw game elements
function draw() {
	background(255);

	
	if (gameStartButton.visible) {
        if(gameTitle.visible){
            fill(255);
		rect(
			gameTitle.x,
			gameTitle.y,
			gameTitle.w,
			gameTitle.h
		);
        noStroke()
		fill(0);
		textAlign(CENTER, CENTER);
		textSize(65);
		text(
			'Panda Kill People',
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
	if (frameCount % 60 === 0 && !gameover) {
		squares.push(new Square());
	}

	// Increase score
	if (!gameover && !gameStartButton.visible) {
		score++;
	}
}

// Player class
function Player() {
	this.x = width / 5;
	this.y = height / 2;
	this.size = 80;

	this.update = function () {
		this.x = width / 5;
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

	this.draw = function () {
		fill(255, 0, 0);
		rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
		this.x -= 5;
		if (this.x < -this.size) {
			squares.splice(squares.indexOf(this), 1);
		}
	};
}
