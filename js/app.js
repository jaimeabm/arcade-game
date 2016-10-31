// Enemies our player must avoid

/**
 * Score class.
 * The Score class construct, initialize the score and handles the gems collected and the games won and lost.
 * @constructor
 */
var Score = function() {
    this.gamesWon = 0;
    this.gamesLost = 0;
    this.blueGem = 0;
    this.orangeGem = 0;
    this.greenGem = 0;
};

/**
 * Gem class.
 * The Gem class construct, initialize the gem and contain the logic to render and update.
 * @constructor
 */
var Gem = function() {
    this.posX = 0;
    this.posY = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.mustRender = true;

    this.sprite = gemsSprites[Math.floor(Math.random() * 3)];

    switch (this.sprite) {
        case 'images/Gem Blue.png':
            this.color = 'blue';
            break;
        case 'images/Gem Green.png':
            this.color = 'green';
            break;
        case 'images/Gem Orange.png':
            this.color = 'orange';
            break;
    }


    // Calculated with and height to work with collision
    this.width = 25;
    this.height = 25;
};

/**
 * Render's the gem on the screen.
 * @param {void}
 */
Gem.prototype.render = function() {
    if (this.mustRender) {
        this.xOffset = Resources.get(this.sprite).width / -2;
        this.yOffset = Resources.get(this.sprite).height / -2;
        ctx.save();
        ctx.translate(this.posX, this.posY);
        ctx.scale(0.5, 0.5);
        ctx.drawImage(Resources.get(this.sprite), this.xOffset * 0.5, this.yOffset * 0.5);
        ctx.restore();
    }
};

/**
 * Update's the gem on the screen.
 * @param {void}
 */
Gem.prototype.setRandomLocation = function() {
    this.posX = Math.floor(Math.random() * (460 - 40 + 1)) + 40;
    this.posY = Math.floor(Math.random() * (420 - 40 + 1)) + 40;
};

/**
 * Enemy class.
 * The Enemy class construct, initialize the enemy and contain the logic to render and update.
 * @constructor
 */
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Position on X randomly
    this.posX = Math.random() * -300;

    // Position on Y randomly
    this.posY = (Math.floor(Math.random() * (350 - 50 + 1)) + 60);

    // Speed of the enemy
    this.speed = Math.floor(Math.random() * (100 - 40 + 1)) + 40;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = enemiesSprites[Math.floor(Math.random() * 4)];

    // Calculated witdh and height to work with collision
    this.width = 50;
    this.height = 50;
};

/**
 * Update's the enemy position on the screen.
 * @param {void}
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.posX += this.speed * dt;

    if (this.posX > 500) {
        this.speed = Math.floor(Math.random() * (100 - 40 + 1)) + 40;
        this.posX = Math.random() * -100;
    }
};

/**
 * Render's the enemy on the screen.
 * @param {void}
 */
Enemy.prototype.render = function() {
    ctx.save();
    ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY, 101, 171);
    ctx.restore();
};

/**
 * Set the initial position of the enemy on the screen.
 * @param {void}
 */
Enemy.prototype.setInitialState = function() {
    this.posX = this.posX = Math.random() * -100;
    this.posY = (Math.floor(Math.random() * (225 - 60 + 1)) + 60);
};


/**
 * Player class.
 * The Player class construct, initialize the player and contain the logic to render and update.
 * @constructor
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.posX = 210;
    this.posY = 440;

    this.width = 50;
    this.height = 50;
};


/**
 * Update's the player position on the screen.
 * @param {void}
 */
Player.prototype.update = function(dt) {
    this.posX * dt;
    this.posY * dt;
};

/**
 * Render's the player on the screen.
 * @param {void}
 */
Player.prototype.render = function() {
    ctx.save();
    ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY, 101, 171);
    ctx.restore();
};

/**
 * Set the initial position of the player on the screen.
 * @param {void}
 */
Player.prototype.setInitialState = function() {
    this.posX = 210;
    this.posY = 440;
};


/**
 * Hanle the player direction based on the keyboard input.
 * @param {void}
 */
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.posX > 0)
                this.posX -= 20;
            break;
        case 'up':
            if (this.posY > -1)
                this.posY -= 20;
            break;
        case 'right':
            if (this.posX < 410)
                this.posX += 20;
            break;
        case 'down':
            if (this.posY < 440)
                this.posY += 20;
            break;
        default:
            return;
    }
};

// Helper arrays to select different enemies and gems
this.enemiesSprites = ['images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
this.gemsSprites = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
this.allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()];
// Place all gems objects in an array called allGems
this.allGems = [new Gem(), new Gem(), new Gem(), new Gem(), new Gem(), new Gem()];
// Place the player object in a variable called player
this.player = new Player();
// Place the player object in a variable called player
this.score = new Score();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
