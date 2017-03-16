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

const demoText = 'Oispa kaljaa';

// main 'module'
window.onload = function () {

    var game = new Phaser.Game(screenW, screenH, Phaser.AUTO, 'canvasWrapper',
        {preload: preload, create: create, update: update});

    // background sprites
    var bg = [];
    // array of text objects for each letter
    var textObjs = [];

    // data about the slice positions
    var sliceData;
    // sliced images
    var slicePics;

    /**
     * Load static assets into Phaser objects
     */
    function preload() {
        game.load.image('background', 'marko.jpg');
        game.load.image('wavepic', 'kuva.png');
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

        // load and initialize the wave image
        [slicePics, sliceData] = initWave(game, "wavepic", sliceData);

        // create the letter text objects
        prepareText();
    }

    /**
     * Update application state
     * Run each loop
     */
    function update() {
        scrollBg();
        updateWave(slicePics, sliceData);
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
        if (textObjs[textObjs.length - 1].textObj.x < -100) {
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
        weight: 'bold',
        fill: 'white'
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
 * Wave effect functions
 */

function initWave(game, pic) {
    // algortihm from phaser website

    // create a intermediatory tween object representing wave
    var tween = game.add.tween({x: 50})
        .to(
            {x: screenW - 150},   // endpoint
            randInt(1000, 20000),       // length
            "Bounce.easeInOut", // animation style
            true,   // autoStart
            0,      // delay
            -1,     // repeat
            true    // yoyo
        );

    var sliceData = tween.generateData(60); // generate 60 frames from tween

    // height of individual 'bar'
    var barHeight = randInt(1,10);

    var sprites = game.add.spriteBatch();

    slices = [];

    var picture = game.cache.getImage(pic);

    var width = picture.width,
        height = picture.height;

    var numBars = Math.floor(picture.height / barHeight);

    // array into which the sliced bars are collected
    var slicedPics = [];

    for (var y = 0; y < numBars; y++) {
        var star = game.make.sprite(50, 100 + (y * barHeight), 'wavepic');

        star.crop(new Phaser.Rectangle(0, y * barHeight, width, barHeight));

        star.ox = star.x;

        // wrap the position around
        star.cx = game.math.wrap(y * 1, 0, sliceData.length - 1);

        star.anchor.set(0.5);
        sprites.addChild(star);

        slicedPics.push(star);
    }

    return [slicedPics, sliceData];

}

/**
 * Update wave animation
 */
function updateWave(pics, data) {
    for (var i = 0; i < pics.length ; i++) {
        pics[i].x = pics[i].ox + data[pics[i].cx].x;
        pics[i].cx++;
        if(pics[i].cx >= data.length) {
            pics[i].cx = 0;
        }
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
    return ~~(Math.random() * (max - min) + min);
}
