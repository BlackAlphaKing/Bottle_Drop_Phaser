
var loaderSceneConfig = {
    key: 'loader',
    active: true,
    preload: bootLoader,
    create: bootCreate
};

var demoSceneConfig = {
    key: 'demo',
    active: false,
    visible: false,
    preload: preload,
    create: create,
    update: update
};

var overSceneConfig = {
    key: 'over',
    active: false,
    visible: false,
    create: gameoverState
};

var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 320,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: !!false
        }
    },
    scene: [ loaderSceneConfig, demoSceneConfig, overSceneConfig ],
    title:'Bottle Drop',
    audio: {
        disableWebAudio: true
    }
};

var bottle;
var tables;
var tablel;
var tabler;
var scoreText;
var particles;
var gameover = false;
var collider = false;
var score = 0;
var bestScore = 0;
var angle = 1;

var game = new Phaser.Game(config);
function bootLoader ()
{
    this.load.image('infor', 'assets/info_howtoplay-sheet0.png');
    this.load.image('bg', 'assets/background.png');
    this.load.image('bar', 'assets/bar.png');
    this.load.image('logo', 'assets/logo_main-sheet0.png');
    this.load.spritesheet('btn', 'assets/button-sheet0.png', { frameWidth: 488/4, frameHeight: 488/4 });
    this.load.image('bottle', 'assets/item1-sheet0.png');
    this.load.image('tablel', 'assets/tablel-sheet0.png');
    this.load.image('tabler', 'assets/tabler-sheet0.png');
    this.load.atlas('Debris', 'assets/Debris.png', 'assets/Debris.json');
    
}

function bootCreate ()
{
    var bg = this.add.image(0, 0, 'bg').setOrigin(0);
    bg.width = game.config.width;
    bg.height = game.config.height;
    var logo = this.add.image(0,0,'logo').setScale(2);
    Phaser.Display.Align.In.TopCenter(logo, bg);
    logo.y += logo.height*logo.scaleY/1.2;

    var btnPlay = this.add.image(0,0,'btn').setScale(0.5).setInteractive();
    Phaser.Display.Align.In.BottomCenter(btnPlay, bg);
    btnPlay.y -= btnPlay.height*btnPlay.scaleY;
    var that = this;
    btnPlay.on('pointerdown', function (pointer) {
        logo.destroy();
        btnPlay.destroy();
        var infor = that.add.image(0, 0, 'infor').setScale(0.3);//.setOrigin(0);
     
        Phaser.Display.Align.In.Center(infor, bg);//infor
        //that.scene.setVisible(false);
        that.time.addEvent({ delay: 1000, callback: stateStart('demo',that), callbackScope: this }); 
    });
    
}
function stateStart(state,stateOld){
    //this.scene.stop();
    //this.scene.launch('demo');
    //game.scene.stop();
    stateOld.scene.setVisible(false)
    game.scene.start(state);
}
function preload ()
{
}

function create ()
{
    gameover = false;
    //console.log(this.sound);
    var bg = this.add.image(0, 0, 'bg').setOrigin(0);
    bg.width = game.config.width;
    bg.height = game.config.height;

    //bottle = this.add.sprite(0, 0, 'bottle').setOrigin(0.5).setScale(0.2).setInteractive();
    bottle = this.physics.add.sprite(0, 0, 'bottle').setOrigin(0.5).setScale(0.2);
    bottle.body.offset.set(bottle.width*2,0);//  
    bottle.isRotation = true;
    
    // bottle.x = (game.config.width - bottle.width*bottle.scaleX)/2;
    // bottle.y = (game.config.height - bottle.height*bottle.scaleY)/2;
    bottle.x = (game.config.width - bottle.width*bottle.scaleX)/1.85;
    bottle.y = (game.config.height - bottle.height*bottle.scaleY)/4;
    bottle.on('pointerdown', function (pointer) {                     
            //this.setTint(0xff0000);                                         
        });
    this.input.on('pointerdown', function (pointer) {
            bottle.isRotation = false;
            bottle.body.gravity.y = 500;
            //game.sound.play('swing');
        });
    
    tables = this.physics.add.staticGroup();
    tablel = tables.create(320 - 560/1.67, 480 - 700/4, 'tablel').setScale(0.5);
    //tablel.body.y = 340;
    tabler = tables.create(560/1.49, 480 - 700/4, 'tabler').setScale(0.5);

    scoreText = this.add.text(0,0,score);
    scoreText.setColor('#0');
    scoreText.setFontSize(36);
    Phaser.Display.Align.In.TopRight(scoreText, bg);
 
}

function destroyParticles(){
    particles.destroy();
    //this.scene.setVisible(false);        
    this.time.addEvent({ delay: 1000, callback: stateStart('over',this), callbackScope: this });
}

function update ()
{
    if(gameover){
        return;
    }
    if(bottle.isRotation == true){
        bottle.angle += angle;
    }
       
    if (checkOverlap(bottle, tablel)) {
        collider = true;
    } else {
        collider = false;
    }
    if (checkOverlap(bottle, tabler)) {
        collider = true;
    } else {
        collider = false;
    }

    if(collider & bottle.y > 340)
    {
        bottle.destroy();
        //this.sound.play('sklo2');
        //
        particles = this.add.particles('Debris');
        particles.createEmitter({
            setFrame: 'sprite-sheet0.png',
            //frame: [ 'sprite-sheet0.png', 'sprite2-sheet0.png', 'sprite3-sheet0.png' ],
            x: game.config.width/2,
            y: 340,
            speed: 50,
            gravityY: 200,
            frequency: 1000,
            lifespan: 2000,
            alpha: { start: 1, end: 0 },
            scale: { min: 0.05, max: 0.4 },
            rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
            angle: { min: 0, max: 360 },
            speed: { min: 10, max: 100 },
            quantity: 12,
            on:!false
        });
        this.time.addEvent({ delay: 1000, callback: destroyParticles, callbackScope: this });
        //gameover
        gameover = true;
    }
    if(bottle.y > game.config.height){
        
        //this.sound.play('gift');
        score++;
        if(Math.floor(Math.random()*(9+1)) >= 5){
            angle = score;
        } else {
            angle = -score;
        }
        gameover = false;
        stateStart('demo',this);
    }
    
    scoreText.setText(score);
    console.log(score);
}

function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        //return Phaser.Rectangle.intersects(boundsA, boundsB);//Phaser2
        return IsRectCross(boundsA,boundsB);

    }

function IsRectCross(rect1, rect2)
{
    if(rect1.right <= rect2.left) return false;
    if(rect1.left >= rect2.right ) return false;

    if(rect1.bottom <= rect2.top ) return false;
    if(rect1.top >= rect2.bottom ) return false;

    return true;
}

function gameoverState(){
    var bg = this.add.image(0, 0, 'bg').setOrigin(0);
    bg.width = game.config.width;
    bg.height = game.config.height;
    var bar = this.add.image(0,0,'bar').setOrigin(0).setScale(1,0.6);
    bar.setX(0);
    bar.setY(bar.height*bar.scaleY*1.25);
    bar.width = game.config.width;
    bar.height *= bar.scaleY;
    scoreText = this.add.text(0,0,'Score:' + score);
    var bestText = this.add.text(0,0,'Best:' + bestScore);
    Phaser.Display.Align.In.Center(scoreText, bar);
    scoreText.y -= scoreText.height;
    Phaser.Display.Align.In.Center(bestText, bar);
    bestText.y += bestText.height;
    var overText = this.add.text(0,0,'Game Over');
    overText.setColor('#0');
    overText.setFontSize(36);
    Phaser.Display.Align.In.TopCenter(overText, bg);
    overText.y = bar.y - overText.height * 1.25;
    
    var btnRePlay = this.add.image(0,0,'btn').setScale(0.5).setInteractive();
    Phaser.Display.Align.In.BottomCenter(btnRePlay, bg);
    btnRePlay.y -= btnRePlay.height*btnRePlay.scaleY;
    var that = this;
    btnRePlay.on('pointerdown', function (pointer) {
        //game.sound.play('click');
        score = 0;
        angle = 1;
        //alert(this.scene.scene.key);
        //that.scene.setVisible(false);
        stateStart('demo',that);
        btnRePlay.destroy();
    });
}

/**  
* @param data 
*/
function isNull(data){ 
return (data == "" || data == undefined || data == null) ? "" : data; 
}