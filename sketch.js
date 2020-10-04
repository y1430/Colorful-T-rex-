//creating variables for Game States
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage,sun,sunImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6,sun,sunImage;
var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

function preload(){
   trex_running = loadAnimation("Run (1).png","Run (2).png","Run (3).png","Run (4).png","Run (5).png","Run (6).png","Run (7).png","Run (8).png");
  trex_collided = loadImage("Dead.png");
  groundImage=loadImage("ground2.png");
 // cloudImage=loadImage("cloud1.png");
  obstacle1=loadImage("obstacle1.png");
   obstacle2=loadImage("obstacle2.png");
   obstacle4=loadImage("obstacle4.png");
   obstacle5=loadImage("obstacle5.png");
   obstacle6=loadImage("obstacle6.png");
   obstacle3=loadImage("obstacle3.png");
 // sunImage=loadImage("sun.png");
  
   restartImg = loadImage("restart.png");
  gameOverImg = loadImage("Game Over.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
 
  cloudImage=loadImage("cloud1.png");
  sunImage=loadImage("sun.png");
  
}

function setup() {
 createCanvas(windowWidth,windowHeight);
  
  ground=createSprite(width/2,height-100,600,400);
  ground.addImage("ground",groundImage);
   ground.x = ground.width /2;
  ground.scale=1;

 trex = createSprite(80,height-70,20,50);
 trex.addAnimation("trex_running",trex_running);
  trex.addAnimation("collided",trex_collided);
 trex.scale = 0.2;
  
   invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  console.log(ground.x); 
  
  ObstaclesGroup=createGroup();
  cloudsGroup=new Group();
 
  trex.setCollider("rectangle",0,0,10,trex.height);
trex.debug=false;
  
   gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height-200);
  restart.addImage(restartImg);
  
  sun=createSprite(width-50,100,10,10);
  sun.addImage("sunImage",sunImage);
  sun.scale=0.1;
  
 score=0;
}

function draw() {
  background("lightblue");
  
  if (gameState===PLAY){
    gameOver.visible=false;
  restart.visible=false;
    
   score = score + Math.round(getFrameRate()/60);
 
    spawnObstacles();
    spawnClouds();
 
 ground.velocityX = -(4 + 3* score/100)
   if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
     if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
 if(touches.length>0 ||(keyDown("space")&& trex.y >= 220)) {
   trex.velocityY = -12;
    jumpSound.play();
   touches=[];
  }  
    
  //Gravity
trex.velocityY = trex.velocityY + 0.8;
 trex.collide(invisibleGround); 
  
  
  if (trex.isTouching(ObstaclesGroup)){
    gameState=END;
     dieSound.play();
  }
  
  }
else if ( gameState===END){
  gameOver.visible=true;
  restart.visible=true;
  ground.velocityX = 0;
      trex.velocityY = 0
     trex.changeAnimation("collided",trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
   ObstaclesGroup.setVelocityXEach(0);
cloudsGroup.setLifetimeEach(-1);
   cloudsGroup.setVelocityXEach(0);  
  
    if(mousePressedOver(restart)|| touches.lenght>0) {
      reset();
      touches=[];
    }
}
 drawSprites(); 
    textSize(20);
     fill("black");
  text("Score :"+score,width-680,50);
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth,height-130,10,40);
   obstacle.velocityX = -(6+((3*score)/100));
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
 
function reset(){
  gameState=PLAY;
 score=0;
gameOver.visible=false;
restart.visible=false;
 trex.changeAnimation("trex_running",trex_running);
  ObstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}
