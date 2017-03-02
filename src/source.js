/**
 * Tietotekniikan laboratoriokurssi
 * Ohjelmistotekniikan työ
 * Ryhmä:
 * Samuel Lindqvist
 * Juha-Pekka Samuelsson
 */

const screenW = 640,
      screenH = 480;

window.onload = function() {

    var game = new Phaser.Game(screenW, screenH, Phaser.AUTO, '',
        { preload: preload, create: create, update: update });

    // background sprites
    var bg = [];
    var bgWidth;

    function preload () {
        game.load.image('background', 'phaser.png');
    }

    function create () {
        //bgs
        bg[0] = game.add.sprite(0, 0, 'background');
        bg[1] = game.add.sprite(screenW, 0, 'background');
    }

    function update () {
        scrollBg();
    }

    function scrollBg() {
        bg.forEach((e)=> {
            e.x -= 5;
            // move to the right if the image has exited the screen
            if(e.x <= -screenW)
                e.x = screenW;
        });
    }

};

