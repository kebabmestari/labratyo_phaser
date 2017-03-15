/**
 * Tietotekniikan laboratoriokurssi
 * Ohjelmistotekniikan työ
 * Ryhmä:
 * Samuel Lindqvist
 * Juha-Pekka Samuelsson
 */

// canvas dimensions
const screenW = 640,
    screenH = 480;

// text waving height
const
    WAVEHEIGHT = 70,
    textPos = screenW + 50, // initial text position
    textGap = 30; // gap between letters

const demoText = 'Moikka Anna :~))';

// main 'module'
window.onload = function () {

    var game = new Phaser.Game(screenW, screenH, Phaser.AUTO, 'canvasWrapper',
        {preload: preload, create: create, update: update});

    // background sprites
    var bg = [];
    // array of text objects for each letter
    var textObjs = [];

    /**
     * Load static assets into Phaser objects
     */
    function preload() {
        game.load.image('background', 'phaser.png');      
        game.load.audio('song', ['Overworld.mp3']);
    }

    /**
     * Parse the intro string into individual text objects
     */
    function prepareText() {
        function createLetter(i, letter) {
            return new Letter(textPos + i * textGap, screenH / 2, i * 5, letter, game);
        }

        for (var i = 0; i < demoText.length; i++) {
            var letter = demoText[i];
            textObjs.push(createLetter(i, letter));
        }
    }

    function resetText(x) {
        for (var i = 0; i < textObjs.length; i++) {
            var obj = textObjs[i];
            obj.textObj.x = x + i * textGap;
            obj.angle = obj.angle % 360;
        }
    }

    /**
     * Create world objects
     */
    function create() {
        // bgs
        bg[0] = game.add.sprite(0, 0, 'background');
        bg[1] = game.add.sprite(screenW, 0, 'background');
        // create the letter text objects
        prepareText();
        // play song
        music = game.add.audio('song');
        music.play();
    }

    /**
     * Update application state
     * Run each loop
     */
    function update() {
        scrollBg();
        renderText();
    }

    /**
     * Render and update text
     * @param x horizontal position of the text
     * @param text text string
     */
    function renderText(x, text) {
        let textSpeed = 3;
        textObjs.forEach((t) => {
            t.updatePosition(textSpeed);
        });
        if(textObjs[textObjs.length - 1].textObj.x < -100) {
            resetText(textPos);
        }
    }

    function scrollBg() {
        bg.forEach((e) => {
            e.x -= 5;
            // move to the right if the image has exited the screen
            if (e.x <= -screenW)
                e.x = screenW;
        });
    }

};

/**
 * Letter constructor
 * Creates an object enclosing the Phaser text object
 * and information about its position
 */
function Letter(x, y, deg, letter, game) {
    Object.defineProperty(this, 'letter', {
        value: letter,
        writable: false
    });

    // sin function angle in DEGREES!
    this.angle = deg;
    // 'static' y point around which the letter oscillates
    this.y = y;
    // phaser object
    this.textObj = game.add.text(x, y, letter, {
        font: '40px monospace',
        weight: 'bold'
    });

    // update letter movement
    this.updatePosition = function (speed) {
        // move letter horizontally
        this.textObj.x -= speed;
        // update sin function
        this.angle += 5;

        // update vertical pos
        this.textObj.y = this.y + Math.floor(Math.sin(angle(this.angle)) * WAVEHEIGHT);
    }
}

/**
 * Utility functions
 */

/**
 * Convert degrees to radians used by Math functions
 * @param degrees
 * @returns {number} given degrees converted to radians
 */
function angle(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Get random integer from range
 * @param min lower bound
 * @param max upper bound
 * @returns {number} random integer from given range
 */
function randInt(min, max) {
    return ~~ Math.random() * (max - min) + min;
}
