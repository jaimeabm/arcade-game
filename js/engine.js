/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document;
    var win = global.window;
    var canvas = doc.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var lastTime;
    var animationId;
    var restarCounter = 3;
    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    var centerScreenX = canvas.width / 2;
    var centerScreenY = canvas.height / 2;


    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */

        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        animationId = win.requestAnimationFrame(main);

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        checkIfWon();
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        this.player.update(dt);
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {

        ctx.clearRect(0, 0, 505, 606);

        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png', // Top row is water
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
                'images/grass-block.png', // Row 1 of 2 of grass
                'images/grass-block.png' // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */

        allGems.forEach(function(gem) {
            gem.render();
        });

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        this.player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        this.player.setInitialState();
        allEnemies.forEach(function(enemy) {
            enemy.setInitialState();
        });

        allGems.forEach(function(gem) {
            gem.setRandomLocation();
            gem.mustRender = true;
        });
    }

    /* This function check if the player is in the winning section.
     */
    function checkIfWon() {
        if (this.player.posY <= -20) {
            cancelAnimationFrame(animationId);

            // Count games won score
            document.getElementById('gw').innerHTML = ++this.score.gamesWon;

            // Display you won message
            displayYouWon();

            // Start reset counter
            startCounter();

            // Update total games played
            document.getElementById('tgp').innerHTML = this.score.gamesWon + this.score.gamesLost;
        }
    }

    /* This function check if the player was touched.
     */
    function checkIfLoose() {
        for (var i = 0; i < this.allEnemies.length; i++) {

            var hit = !(this.player.posX + this.player.width < this.allEnemies[i].posX ||
                this.allEnemies[i].posX + this.allEnemies[i].width < this.player.posX ||
                this.player.posY + this.player.height < this.allEnemies[i].posY ||
                this.allEnemies[i].posY + this.allEnemies[i].height < this.player.posY);

            if (hit) {
                cancelAnimationFrame(animationId);

                // Count games lost score
                document.getElementById('gl').innerHTML = ++this.score.gamesLost;

                // Display you LOST message
                displayYouLost();
                // Start reset counter
                startCounter();

                // Reset score only when losing
                document.getElementById('bg').innerHTML = 0;
                this.score.blueGem = 0;
                document.getElementById('gg').innerHTML = 0;
                this.score.greenGem = 0;
                document.getElementById('og').innerHTML = 0;
                this.score.orangeGem = 0;

                // Update total games played
                document.getElementById('tgp').innerHTML = this.score.gamesWon + this.score.gamesLost;

                break;
            }

        }
    }

    /* This function display a counter to start the next game after loosing or winning.
     */
    function displayCounter(counter) {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = '#E66800';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.font = '80px Impact';
        //ctx.clearRect(centerScreenX, centerScreenY + 80, 50, 50);
        ctx.fillText(counter, centerScreenX, centerScreenY + 80);
        ctx.strokeText(counter, centerScreenX, centerScreenY + 80);
    }

    /* This function display the win message.
     */
    function displayYouWon() {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'green';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.font = '80px Impact';
        ctx.fillText('YOU WON!!', centerScreenX, centerScreenY);
        ctx.strokeText('YOU WON!!', centerScreenX, centerScreenY);
    }


    /* This function display the lost message.
     */
    function displayYouLost() {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'red';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.font = '80px Impact';
        ctx.fillText('LOOSER!!', centerScreenX, centerScreenY);
        ctx.strokeText('LOOSER!!', centerScreenX, centerScreenY);
    }

    /* This function check the collisions of an enemy or a gem.
     */
    function checkCollisions() {

        for (var i = 0; i < this.allGems.length; i++) {
            var hitGem = Math.abs(this.player.posX + this.player.width - this.allGems[i].posX) < 50 && Math.abs(this.player.posY + this.player.height - this.allGems[i].posY) < 50;
            if (hitGem) {
                if (this.allGems[i].mustRender) {
                    switch (this.allGems[i].color) {
                        case 'blue':
                            this.color = 'blue';
                            document.getElementById('bg').innerHTML = ++this.score.blueGem;
                            break;
                        case 'green':
                            document.getElementById('gg').innerHTML = ++this.score.greenGem;
                            break;
                        case 'orange':
                            document.getElementById('og').innerHTML = ++this.score.orangeGem;
                            break;
                    }
                }
                this.allGems[i].mustRender = false;
            }
        }

        checkIfLoose();

    }

    /* This function start the counter to start the next game the lost message.
     */
    function startCounter() {
        //Save the state of the screen
        var image = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Timer to stop de game for 3 second            
        restarTimerId = setInterval(function() {
            ctx.putImageData(image, 0, 0);
            displayCounter(restarCounter);
            if (restarCounter === -1) {
                restarCounter = 3;
                init();
                clearInterval(restarTimerId);
            } else {
                restarCounter--;
            }
        }, 1000);
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
    ]);

    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
