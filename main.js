var score = 0;
var gscore = 0;
var ghost = false; // With this we can check if out ghost exists
var countblink = 10;
var moveNumber = 0; // This variable is used to make movement smooth and to make closing and opening of pacmen mouth smooth


var player = {
	x:50,
	y:100,
	pacmouth:320,
	pacdir:0,     // pacdir = pacman direction
	psize:32,
	speed:2
};

var enemy = [
	{
		x:150,
		y:200,
		speed:5,
		moving:0,
		dirx:0,
		diry:0,
		flash:0,
		ghosteat:false
	},
	{
		x:150,
		y:200,
		speed:5,
		moving:0,
		dirx:0,
		diry:0,
		flash:0,
		ghosteat:false
	}
];

var powerdot = {
	x:10,
	y:10,
	powerup:false,
	pcountdown:0,
	ghostNum:0
};

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 600;
canvas.height = 400;

mainImage = new Image();
mainImage.ready = false;
mainImage.onload = checkReady;
mainImage.src = 'pac.png';

var keyclick = {};
document.addEventListener("keydown", function(event){

	keyclick[event.keyCode]=true;
	

},false);

// With this function on keyup we delete keyboard clicks from our object
document.addEventListener("keyup", function(event){

	delete keyclick[event.keyCode];

},false);


function move(keyclick) {

	var moving = false; // I made this false variable for purpose of making moving smooth, we set to false so he moves on our keyclicks

	if (37 in keyclick) { // 37 = left arrow
		player.x -= player.speed;
		player.pacdir=64;
		moving = true;
	}
	if (38 in keyclick) { // 38 = up arrow
		player.y -= player.speed;
		player.pacdir=96;
		moving = true;
	}
	if (39 in keyclick) { // 39 = right arrow
		player.x += player.speed;
		player.pacdir=0;
		moving = true;
	}
	if (40 in keyclick) { // 40 = down arrow
		player.y += player.speed;
		player.pacdir=32;
		moving = true;
	}
	
	if (moving) {
		// Here we are setting open mouth images
		// With this mouth switches beetwen two images creating illusion of opening/closing of mouth
		moveNumber++;
		if (moveNumber == 6) { // If it reaches 6 then it opens/closes mouth and so on ...
			moveNumber = 0; // We restart moveNumber value to starting so it starts over
			if (player.pacmouth == 320) {
				player.pacmouth = 352;
			} 
			else {
				player.pacmouth = 320;
			}
		}
	}

	// This is where we are making pacmen go from side to side (not get outside of canvas)
	if (player.x >= (canvas.width-32)) {
		player.x = 0;
	}
	if (player.y >= (canvas.height-32)) {
		player.y = 0;
	}
	// For next too we are not using = because we dont want to set to 0 because we aready have player.x = 0 above and we would get confict
	if (player.x < 0) {
		player.x = (canvas.width-32);
	}
	if (player.y < 0) {
		player.y = (canvas.height-32);
	}

}

function checkReady() {

	this.ready = true;
	playGame();

}

function playGame() {

	move(keyclick); // We are calling move function here so it renders continiosly and movement looks smooth
	render();
	window.requestAnimationFrame(playGame); // This runs continiously through our function and it refreshes and recalculates what is happening in our game

}

function myNum (n) {

	return Math.floor(Math.random()*n);

}

// With this function we add powerdot and enemy on screen and also reset the game
function checkScreen() {

	// We use powerdot.pcountdown < 5 ,because we want to reset our game when countdown reaches <5
	if(!powerdot.powerup && powerdot.pcountdown < 5) {

		// With this we are giving random starting position of our powerdot
		powerdot.x = myNum(420)+30; // We add +30 because we want some distance from top
		powerdot.y = myNum(250)+30; // We add +30 because we want some distance from top
		powerdot.powerup = true; // So we don't have many dots rendering all the time

	}

	
	// Check if ghost is on screen. With this we add ghost to our canvas and we can continue to our gameLogic function
	if(!ghost) {

		for (var i=0;i<enemy.length;i++) {

			enemy[i].ghostNum = myNum(5)*64; // MyNum(5) = random number beetween 0 and 4 > With this we are changing enemy image, on our png we have 5 enemies and with myNum * 64 we get random image of enemy

			// With this we are giving random starting position of our ghost
			enemy[i].x = myNum(450);
			enemy[i].y = myNum(250)+30; // We add +30 because we want some distance from top

			// If we dont add this we have many ghosts and they keep on rendering on screen
			ghost = true;
		}

	}	
}

// Most of the game logic is in this function
function gameLogic() {

	for (var i=0;i<enemy.length;i++) {

		if(enemy[i].moving < 0) {

			enemy[i].moving = (myNum(20)*3)+myNum(2); // We add myNum(2) to make odd or even > this basically tells the length our enemy will move before changing direction (minimum ammout is 10)
			enemy[i].speed = myNum(2)+1; // We add +1 because we don't want him to stop, without +1 he can get 0 value and stop for a moment
			enemy[i].dirx = 0;
			enemy[i].diry = 0;


			// This a really simple way to make our enemy run from us when we can eat him
			// Basically we are just multiplying enemy.speed with -1 making it negative and thus making enemy go in opposite direction of player
			if (powerdot.ghosteat) {
				enemy[i].speed=enemy[i].speed * -1;
			}

			// We create 50% 50% in which direction enemy will move
			// If there is no remainder we want to move left and right else we are gonna move it up and down
			if(enemy[i].moving % 2) {
				// We are taking into consideration our position, we want to send enemies to our position
				if (player.x < enemy[i].x) {
					enemy[i].dirx = -enemy[i].speed;
				} 
				else {
					enemy[i].dirx = enemy[i].speed;
				}
			} 
			else {
				if (player.y < enemy[i].y) {
					enemy[i].diry = -enemy[i].speed;
				} 
				else {
					enemy[i].diry = enemy[i].speed;
				}
			}
		}

		enemy[i].moving--; // We are decreasing it because we want to reset it sometimes
		// We add inrements here, so our ghost moves
		enemy[i].x = enemy[i].x + enemy[i].dirx;
		enemy[i].y = enemy[i].y + enemy[i].diry;

		// This is where we are making enemy go from side to side (not get outside of canvas)
		if (enemy[i].x >= (canvas.width-32)) {
			enemy[i].x = 0;
		}
		if (enemy[i].y >= (canvas.height-32)) {
			enemy[i].y = 0;
		}
		// For next too we are not using = because we dont want to set to 0 because we aready have player.x = 0 above and we would get confict
		if (enemy[i].x < 0) {
			enemy[i].x = (canvas.width-32);
		}
		if (enemy[i].y < 0) {
			enemy[i].y = (canvas.height-32);
		}


		// Collision detection ghost. We detect collission by calculating position of player and powerdot or any other parameter we need collision calculations for
		// We add +26 nad +32 to center our ghost and player position > this takes some adjusments > use console.log to do this
		// This is creating square area which checks if player and ghost are within that same spacing
		if(player.x <= (enemy[i].x+26) && enemy[i].x <= (player.x+26) && player.y <= (enemy[i].y+26) && enemy[i].y <= (player.y+32) ) { 

			console.log("GhostHit"); // We use this to help us find the center of ghost when compared to player > I didn't delete on purpose so I know it for future

			// if powerdot.ghosteat is true (player ate powerdot) we know if collions happens player will win, else ghost will win
			if(powerdot.ghosteat) {
				score++;
			}
			else {
				gscore++;
			}

			// This resets our game when collision is detected between ghost and player
			// We reposition player and ghost to start over
			// And we also have to reset our ghosteat and pcountdown values so the game works properly
			player.x = 10;
			player.y = 100;
			enemy[i].x = 300;
			enemy[i].y = 200;
			
			powerdot.pcountdown = 0; // We need to reset this value

		}

		// Collision detection powerup. We detect collission by calculating position of player and powerdot or any other parameter we need collision calculations for
		// We add 32 to center our dot and player position > this takes some adjusments > use console.log to do this
		// This is creating square area which checks if player and powerdot are within that same spacing
		if(player.x <= powerdot.x && powerdot.x <= (player.x+32) && player.y <= powerdot.y && powerdot.y <= (player.y+32) ) { 

			for (var j=0;j<enemy.length;j++) {

				console.log("Hit"); // We use this to help us find the center of dot when compared to player > I didn't delete on purpose so I know it for future
				powerdot.powerup = false; // We remove it when we detect collision between player and powerdot > we create illusion of eating it
				powerdot.pcountdown = 500; // This is countdown during which the ghost will be edible
				powerdot.ghostNum = enemy[j].ghostNum; // We will change the ghost picture while its edible and we need this to revert to previous picture when it was not edible
				enemy[j].ghostNum = 384; // We get blue ghost which can be eaten by player
				console.log(enemy[j].ghostNum); // HOW TO CHECK THIS

				// We move powerdot out of the way so there is no collisions with it
				powerdot.x = 0;
				powerdot.y = 0;

				powerdot.ghosteat = true; // When we eat powerdot we want to set ghosteat to true

				player.speed = 5; // We increase player speed when he eats powerdot

			}

		}


		// If ghosteat is true we continue with our countdown
		if(powerdot.ghosteat) {
			powerdot.pcountdown--; 

			// When it hits 0 we reset everything
			if (powerdot.pcountdown<=0) {

				for (var j=0;j<enemy.length;j++) {

					powerdot.ghosteat = false;
					enemy[j].ghostNum = powerdot.ghostNum; // We revert our picture when countdown is over
					player.speed = 2; // We revert speed to previous value

				}
			}
		}


		// If powerdot exists we draw it
		if(powerdot.powerup) {

			context.fillStyle = "#fff";
			context.beginPath(); // beginPath of the Canvas 2D API starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.

			// 1 i 2 broj odredjuju udaljenost kruga koji pravimo po x i y osi
			// 3 broj odredjuje radijus naseg kruga
			// 4 i 5 broj odredjuju pocetak i kraj naseg kruga
			// True ili false odredjuje kako ce se iscrtati nas krug, ako je true iscrtace se suprotno od kazaljke na satu izmedju dva ugla
			context.arc(powerdot.x, powerdot.y, 10,0,Math.PI*2,true);
			context.closePath(); // When we are then drawing out path we have to close it
			context.fill(); // After we close it, we fill it

		}


		// This is making blinking and switching eyes slower and that way gives it a more smoother look
		if(countblink>0) {
			countblink--;
		}
		else {
			countblink=10;

			// Here we adjust which ghost image will be displayed simmiliar to opening/closing of pacmouth
			// It will switch between blue and white ghost creating flashing illusion
			if (enemy[i].flash == 0) { // We dont need to duplicate check because its universal for both of them
				enemy[i].flash = 32;
			} 
			else {
				enemy[i].flash = 0;
			}
		}
	}
}

function render() {

	context.fillStyle = 'black';
	context.fillRect(0,0,canvas.width,canvas.height); // We fill our canvas from 0 coordinates, to canvas width and height with black color

	checkScreen();

	gameLogic();


	// We draw player and enemy
	for (var i=0;i<enemy.length;i++) {

		// We put this above drawImage so pacman and enemy are one layer above, if they are on the text they will show above > the list thing we write is always layer above
		context.font = "20px Verdana";
		context.fillStyle = "white"; // fillStyle is gonna refer to next action it's gonna fill
		context.fillText("Pacman: "+score+" vs Ghost: "+gscore,2,18);

		// Objasnjenje drawImage
		// Prva dva broja odredjuju udaljenost slicice koju trazimo po x i y osi
		// 3 i 4 broj odredjuju koliko px nam treba od nulte tacke (tacka koju smo dobili sa prva dva broja)
		// 5 i 6 broj odredjuju gde cemo iscrtati nasu slicicu
		// 7 i 8 broj odredjuju kolika ce biti ta nasa slicica
		context.drawImage(mainImage,enemy[i].ghostNum,enemy[i].flash,32,32,enemy[i].x,enemy[i].y,32,32);
		context.drawImage(mainImage,player.pacmouth,player.pacdir,32,32,player.x,player.y,32,32);
	
	}

}