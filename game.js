const config = {
    type: Phaser.AUTO,

    width: 1036,
    height: 500,
    parent: 'phaser-example',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            enableBody: true,
        },
    },
    input: {
        queue: true
    },
    scene: {
        preload: preload,
        create: create,
        update
    }
};

var game = new Phaser.Game(config);

function preload() {
    // TO DO 2: Load assets (player, platform, pick a star)
    this.load.image('star', 'assets/blueStar.png');
    this.load.spritesheet('umbrella', 'assets/RPG_assets.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('platform', 'assets/platform.png');
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('enermy','assets/RPG_assets2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('touchdown','assets/platform1.png');
    this.load.image('ball', 'assets/ball.png');
}


// TO DO 3: Set up game state (score)
const gameState = {
    score: 0,
    current_player: 4,
    former_player: 1,
    ballpassed: 1,
    x1: 180,
    x2: 860,
    x3: 520,
    x4: 180,
    x5: 860,
    y1: 100,
    y2: 100,
    y3: 250,
    y4: 400,
    y5: 400,
    x_tmp: 0,
    y_tmp: 0,
}

function create() {
    // TO DO 4: Make a player
    this.add.image(518, 250, 'background');//make a background
    gameState.player = this.physics.add.sprite(180, 100, 'umbrella');

    gameState.player2 = this.physics.add.sprite(400, 50, 'enermy');
    gameState.player3 = this.physics.add.sprite(400, 125, 'enermy');
    gameState.player4 = this.physics.add.sprite(400, 200, 'enermy');
    gameState.player5 = this.physics.add.sprite(400, 275, 'enermy');
    gameState.player6 = this.physics.add.sprite(400, 350, 'enermy');

    gameState.ball = this.physics.add.sprite(160, 100, 'ball');
    this.gunTween = this.tweens.add({
        targets: [gameState.ball],
        angle: 360,
        duration: 500,
        repeat: -1,
        callbackScope: this,
    });

    gameState.cursors = this.input.keyboard.createCursorKeys();

    gameState.fake1 = this.physics.add.sprite(gameState.x1, gameState.y1, 'umbrella');//below remember game state
    gameState.fake2 = this.physics.add.sprite(gameState.x2, gameState.y2, 'umbrella');
    gameState.fake3 = this.physics.add.sprite(gameState.x3, gameState.y3, 'umbrella');
    gameState.fake4 = this.physics.add.sprite(gameState.x4, gameState.y4, 'umbrella');
    gameState.fake5 = this.physics.add.sprite(gameState.x5, gameState.y5, 'umbrella');

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('umbrella', { frames: [1, 7, 1, 13] }),
        frameRate: 10,
        repeat: -1
    });

    // animation with key 'right'
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('umbrella', { frames: [1, 7, 1, 13] }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('umbrella', { frames: [2, 8, 2, 14] }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('umbrella', { frames: [0, 6, 0, 12] }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'umbrella', frame: 0 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'move',
        frames: this.anims.generateFrameNumbers('enermy', { frames: [0, 3, 0, 6] }),
        frameRate: 20,
        repeat: -1
    });

    // TO DO 5: Set up platform
    const platforms = this.physics.add.staticGroup();
    platforms.create(518, 490, 'platform').setScale(3, .5).refreshBody();
    platforms.create(518, 10, 'platform').setScale(3, .5).refreshBody();
    platforms.create(10, 250, 'platform').setScale(0.07, 10).refreshBody();
    platforms.create(1026, 250, 'platform').setScale(0.05, 10).refreshBody();

    

    // TO DO 6: Add score text
    gameState.scoreText = this.add.text(195, 480, 'score: 0', { fontSize: '15px', fill: '#000000' });

    // TO DO 7: Add player/platform collision and cursors
    gameState.player.setCollideWorldBounds(true);
    this.physics.add.collider(gameState.player, platforms);
    // TO DO 8: Add star logic

    const stars = this.physics.add.group();

    function starGen() {

        const xCoord = Math.random() * 1036;
        stars.create(xCoord, 10, 'star');
    }

    const starGenLoop = this.time.addEvent({
        delay: 600,
        callback: starGen,
        callbackScope: this,
        loop: true,
    });

    this.physics.add.collider(stars, platforms, function (star) {
        star.destroy();
        gameState.score += 3;
        gameState.scoreText.setText("score: " + gameState.score);
        //TO DO 9: Update score
    })

    // TO DO 10: Add game over logic
    this.physics.add.overlap(gameState.player, stars, () => {
        this.physics.pause();
        starGenLoop.destroy();
        this.add.text(618, 250, 'Game Over', { fontSize: '60px', fill: '#000000' });
        this.input.on('pointerup', () => {
            this.scene.restart();
        });
    });

    this.input.on('pointerdown', function (pointer) {
        if (Math.abs(pointer.x - gameState.x1) < 16 && Math.abs(pointer.y - gameState.x1) < 16 && gameState.current_player != 1) {
            gameState.former_player = gameState.current_player;
            gameState.current_player = 3;
        }

    }, this);

    this.physics.add.overlap(gameState.player, gameState.player2, () => {
    this.physics.pause();
    starGenLoop.destroy();
    this.add.text(350,200,'Game Over',{fontSize:'60px',fill:'#000000'});
    this.input.on('pointerup', () =>{
        this.scene.restart();
    });
  });



    //BKey = gameState.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B)
    //if (BKey.isDown) {
    //    gameState.former_player = gameState.current_player;
    //    gameState.current_player = 3;
    //    gameState.ballpassed = 1;
    //}
}

function update() {
    //TO DO 7.5: update the update function
    //var keyObj = gameState.keyboard.addKey('W');  // Get key object
    //var isDown = keyObj.isDown;
    //var isUp = keyObj.isUp;

    //if (keyObj.isDown) {
    //    gameState.former_player = gameState.current_player;
    //    gameState.current_player = 3;
    //}



    if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-160);
        gameState.player.setVelocityY(0);
        gameState.player.anims.play('left', true);
        gameState.player.flipX = true;
    }
    else if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(160);
        gameState.player.setVelocityY(0);
        gameState.player.anims.play('right', true);
        gameState.player.flipX = false;
    }
    else if (gameState.cursors.up.isDown) {
        gameState.player.setVelocityY(-160);
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('up', true);
    }
    else if (gameState.cursors.down.isDown) {
        gameState.player.setVelocityY(160);
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('down', true);
    }
    else {
        gameState.player.setVelocityX(0);
        gameState.player.setVelocityY(0);
        gameState.player.anims.play('turn');
    }

    //if (gameState.cursors.space. && gameState.cursors.right.isDown) {
    //    gameState.former_player = gameState.current_player;
    //    gameState.current_player = 3;
    //}


    //--------------------------------------//
    if (gameState.ballpassed == 1) {
        gameState.ball.visible = 1;
        if (gameState.former_player == 1) {
            gameState.fake1.x = gameState.player.x;
            gameState.fake1.y = gameState.player.y;
            gameState.fake1.visible = true;
            gameState.ballpassed = 0;
        }
        else if (gameState.former_player == 2) {
            gameState.fake2.x = gameState.player.x;
            gameState.fake2.y = gameState.player.y;
            gameState.fake2.visible = true;
            gameState.ballpassed = 0;
        }
        else if (gameState.former_player == 3) {
            gameState.fake3.x = gameState.player.x;
            gameState.fake3.y = gameState.player.y;
            gameState.fake3.visible = true;
            gameState.ballpassed = 0;
        }
        else if (gameState.former_player == 4) {
            gameState.fake4.x = gameState.player.x;
            gameState.fake4.y = gameState.player.y;
            gameState.fake4.visible = true;
            gameState.ballpassed = 0;
        }
        else if (gameState.former_player == 5) {
            gameState.fake5.x = gameState.player.x;
            gameState.fake5.y = gameState.player.y;
            gameState.fake5.visible = true;
            gameState.ballpassed = 0;
        }

        //gameState.former_player = gameState.current_player;


        if (gameState.current_player == 1) {
            gameState.fake1.visible = false;
            gameState.player.x = gameState.fake1.x;
            gameState.player.y = gameState.fake1.y;
        }
        else if (gameState.current_player == 2) {
            gameState.fake2.visible = false;
            gameState.player.x = gameState.fake2.x;
            gameState.player.y = gameState.fake2.y;
        }
        else if (gameState.current_player == 3) {
            gameState.fake3.visible = false;
            gameState.player.x = gameState.fake3.x;
            gameState.player.y = gameState.fake3.y;
        }
        else if (gameState.current_player == 4) {
            gameState.fake4.visible = false;
            gameState.player.x = gameState.fake4.x;
            gameState.player.y = gameState.fake4.y;
        }
        else if (gameState.current_player == 5) {
            gameState.fake5.visible = false;
            gameState.player.x = gameState.fake5.x;
            gameState.player.y = gameState.fake5.y;
        }
    }


    if (gameState.cursors.space.isDown==true) {
        gameState.former_player = gameState.current_player;
        var tmp = Math.floor(Math.random() * 4) + 1;
        if (gameState.current_player <= tmp) {
            tmp+=1;
        }
        gameState.current_player = tmp;
        gameState.ballpassed = 1;
    }

    var dx = gameState.player.x - gameState.player2.x;
    var dy = gameState.player.y - gameState.player2.y;
    var denorm = Math.sqrt(dx * dx + dy * dy);
    gameState.player2.setVelocityY(60*dy/denorm);
    gameState.player2.setVelocityX(140*dx/denorm);
    gameState.player2.anims.play('move', true);
    //BKey = gameState.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B).isDown
    //if (gameStage. isDown(Phaser.Keyboard.B)) {
    //    gameState.former_player = gameState.current_player;
    //    gameState.current_player = 3;
    //    gameState.ballpassed = 1;
    //}
    var dx = gameState.player.x - gameState.player3.x;
    var dy = gameState.player.y - gameState.player3.y;
    var denorm = Math.sqrt(dx * dx + dy * dy);
    gameState.player3.setVelocityY(90*dy/denorm);
    gameState.player3.setVelocityX(110*dx/denorm);
    gameState.player3.anims.play('move', true);

    var dx = gameState.player.x - gameState.player4.x;
    var dy = gameState.player.y - gameState.player4.y;
    var denorm = Math.sqrt(dx * dx + dy * dy);
    gameState.player4.setVelocityY(70*dy/denorm);
    gameState.player4.setVelocityX(130*dx/denorm);
    gameState.player4.anims.play('move', true);

    var dx = gameState.player.x - gameState.player5.x;
    var dy = gameState.player.y - gameState.player5.y;
    var denorm = Math.sqrt(dx * dx + dy * dy);
    gameState.player5.setVelocityY(120*dy/denorm);
    gameState.player5.setVelocityX(80*dx/denorm);
    gameState.player5.anims.play('move', true);

    var dx = gameState.player.x - gameState.player6.x;
    var dy = gameState.player.y - gameState.player6.y;
    var denorm = Math.sqrt(dx * dx + dy * dy);
    gameState.player6.setVelocityY(150*dy/denorm);
    gameState.player6.setVelocityX(50*dx/denorm);
    gameState.player6.anims.play('move', true);

    var dx2 = gameState.player.x - gameState.ball.x;
    var dy2 = gameState.player.y - gameState.ball.y;
    var denorm = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    gameState.ball.setVelocityY(350 * dy2 / denorm);
    gameState.ball.setVelocityX(350 * dx2 / denorm);

    if (Math.abs(dx2) < 10 && Math.abs(dy2) < 10) {
        gameState.ball.visible = 0;
    }
}
