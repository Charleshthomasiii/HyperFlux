var invincible=false;
var everInvincible=false;
var lives=10;
var invincibleCounter=0;
var counter = 0;
var musicPlay=0
var millisecond;
var rocksCollected=0;
var state=-1;
var offset=0;
var offset2=1000;
// variable for the ship
var theShip;
var final=0;

// Array to hold asteroids
var rocks = [];
function preload() {
  // load in sound and images
  music = loadSound('images/music.mp3');
  img = loadImage('images/sky.jpg');
}

function setup() {
  createCanvas(1250,600);
  noiseDetail(24);
  // construct our user controlled ship
  theShip = new Ship(600, 550);
  lives*=10;
  healthBar = new health(lives);
  strokeWeight(0);
  fill(255);
  textSize(20);
  var title = "HyperFlux";
  var text1 = "You have been sent on a reconaissance mission to a distant galaxy. You discovered the remnants of a lost civilization and must report back, but fuel is low. The ship cannot reach hyperspeed unless it has 10 yellow-uranium fuel pods. Some astroids contain this fuel.";
  var text2 ="You approach a densely packed asteroid field. Your ship is capable of SHIFTED travel, letting you jump across asteroids to stay alive. You cannot risk losing momentum or else you may not make it back in your lifetime. Switching autopilot off, you take the controls...";

  var text3 = "MOVE WITH UP DOWN LEFT RIGHT";
  var text4 ="SHIFTED TRAVEL POSSIBLE WITH DIRECTION + SHIFT";
  var text5 ="HIT ENTER TO SWITCH TO DISENGAGE AUTOPILOT";
  var text6 ="COLLECT GOLDEN ASTEROIDS  TO REPAIR SHIP AND GO HOME";
  var text7 ="CHOOSE DIFFICULTY AND PRESS ENTER TO CONTINUE";

  text(text1, 100, 50, 1000, 500);
  text(text2, 100, 150, 1000, 500);

  fill(244, 232, 66);
  text(text3, 100,400,1000,500);
  text(text4, 100,450,1000,500);
  text(text6, 100, 500, 1000, 500);
  text(text7, 100, 550, 1000, 500);

  console.log("state"+state);

}

function draw() {
  if (invincible) {
    invincibleCounter+=1;
    if (invincibleCounter>240) {
      invincibleCounter=0;
      invincible=false;
    }
  }
  millisecond = millis();
  if(state===1){
    if (musicPlay===0) {
      music.play();
      musicPlay+=1;
      counter=Math.floor(millisecond/1000);
    }
    //black background
   //background(0);  
    image(img, 0,0,width,height);
    //move the ship
    theShip.move();
    //using millis to make sure music is synced with rock movmement

    //every number of seconds call move on all rocks
    if ((Math.floor(random(0,10)))==5) {
        var rand = map( noise(offset), 0, 1, 0, 124);
        rand = Math.floor(rand);
        rand*=10;
      // increase our noise offset
        offset += 0.02;
        rock = new Rock(rand,-40, 10);
        rocks.unshift(rock);
    }
    if ((Math.floor(random(0,1000)))==5) {
      square();
    }
    if ((Math.floor(random(0,800)))==5) {
      lineFormation();
    }
    if ((Math.floor(random(0,300)))==5) {
      barFormation();
    }
    
    if ((Math.floor(random(0,1200)))==5) {

        rock = new healthRock(Math.floor(random(0,124))*10,-40, 10);
        rocks.unshift(rock);
    }
    //counter=Math.floor(millisecond/1000);
    if(millisecond/1000>= counter*0.46875 ){
      for(var h =0; h<rocks.length;h++){
        rocks[h].move();
      }
      counter+=1
    }

    // check collisions between the rocks and the frog
    for(var h =0; h<rocks.length;h++){
      if (rocks[h].checkCollision(theShip.x, theShip.y)) {
        if(!everInvincible && !invincible && rocks[h] instanceof Rock){
          theShip.y = 550;
          theShip.x=600;
          invincible=true;
        }
      }
    }//if(!invincible){
    // ask our frog to run its display function
    theShip.display();

    // ask our rocks to run their display functions
    for(var h =0; h<rocks.length;h++){
      rocks[h].display();
    }
    healthBar.display(rocksCollected);

    if(healthBar.rocks>9){
      state=3;
    }
    if (rocks.length>5000) {
      for(var x=0;x<50;x++){
        rocks.pop();
      }

    }
  }
  else if(state===3){
    if (final===0) {
      background(0);
      strokeWeight(0);
      fill(255);
      textSize(20);
      var text1 = "You collected enough fuel to make the hyperspeed jump home.";
      var text2 ="Congratulations, you overcame insurmountable odds.";

      text(text1, 100, 50, 1000, 500);
      text(text2, 100, 150, 1000, 500);
      final+=1;
    }
  }
  else if(state===2){
    if (final===0) {
      background(0);
      strokeWeight(0);
      fill(255);
      textSize(20);
      var text1 = "Your ship has been damaged by too many asteroids. Looking out the window of the cockpit, you drift aimlessly through space.";

      text(text1, 100, 50, 1000, 500);
      text(text2, 100, 150, 1000, 500);
      final+=1;
    }
  }
}


//health class models health bar and number of yellow asteroids collected left
class health{
  constructor(startRemaining){
    this.remaining = startRemaining;
    this.initial = startRemaining;
    this.rocks =0;
  }
  display(){
    strokeWeight(.5);
    stroke(255, 255, 255);
    fill(0);
    rect(10,0,this.initial,10);
    fill(30,150,150);
    if (invincible==true || everInvincible==true) {
      fill(245, 152, 66);
    }
    rect(10,0,this.remaining,10);
    noStroke();
    textSize(10);
    fill(255);
    text(this.rocks,0,0,10,10)
  }
}

//Rock class - models an astroid moving downward
class Rock{
  constructor (startX, startY, startSpeed) {
    // store the starting position of this Rock
    this.x = startX;
    this.y = startY;
    this.speed = startSpeed;
  }
  // display function to draw the rock
  display() {
    fill(220,20,60);
    rect(this.x, this.y, 10, 10);
  }

  // move function for the rock
  move() {
    // move every 0.46875 seconds
    this.y += this.speed;
    // did we hit the edge?  if so, wrap around
    if (this.y > height) {
      this.y = -30; // random position off of the left edge of the screen
    }
  }

  // collide function to check if this rock has squished the frog!
  checkCollision(frogX, frogY) {
    //checking collisions
    var d = dist(this.x+10, this.y+10, frogX+10, frogY+10);
    if (d < 3 && invincible==false && everInvincible==false) {
      healthBar.remaining-=10;
      if (healthBar.remaining===0) {
        state=2;
      }
      return true;
    }
    else {
      // no collision
      return false;
    }
  }
}

function lineFormation(){
  var t = Math.floor(random(-10,40))*10;
  var p = Math.floor(random(80,120))*10;
  if (random()<.5) {
    t=p;
  }
  for(var q =0;q<20;q++){
    rock = new Rock(t+q*10,-40,10);
    rocks.unshift(rock);
  }
}

function square(){
  var t = Math.floor(random(-10,125))*10;
  var w = Math.floor(random(5,15));
  for(var q =0;q<w;q++){
    for(var u =0;u<w;u++){
      rock = new Rock(t+q*10,-40-u*10,10);
      rocks.unshift(rock);
    }
  }
}

function barFormation(){
  var t = Math.floor(random(-5,30))*10;
  var p = Math.floor(random(80,120))*10;
  if (random()<.5) {
    t=p;
  }
  for(var q =0;q<20;q++){
    rock = new Rock(t,-40 - 10*q,10);
    rocks.unshift(rock);
  }
}




class healthRock{

  constructor (startX, startY, startSpeed) {
    // store the starting position of this Rock
    this.x = startX;
    this.y = startY;
    // store our speed
    this.speed = startSpeed;
  }

  // display function to draw the rock
  display() {
    fill(245, 192, 66);
    rect(this.x, this.y, 10, 10);
  }

  // move function for the rock
  move() {

    // move every 0.46875 seconds

    this.y += this.speed;

    // did we hit the edge?  if so, wrap around
    if (this.y > height) {
      this.y = -40; // random position off of the left edge of the screen
    }
  }




  // collide function to check if this rock has squished the frog!
  checkCollision(frogX, frogY) {
    //checking collisions
    var d = dist(this.x+10, this.y+10, frogX+10, frogY+10);
    if (d < 40) {
      healthBar.remaining+=10;
      healthBar.rocks+=1;
      if (healthBar.remaining===0) {
        state=2;
      }
      this.y=-60;
      this.x = Math.floor(random(0,124))*10;
      return true;
    }
    else {
      // no collision
      return false;
    }
  }

}















function keyPressed() {
      if (keyCode===ENTER) {
        state*=-1;
      }
      var value = 10;
      if(keyIsDown(SHIFT)){
        value =20;
      }
      //console.log("keyCode");
      if (keyCode === LEFT_ARROW) {
        theShip.x-= value;
      } 
      else if (keyCode === RIGHT_ARROW) {
        theShip.x += value;
      }
      else if (keyCode === DOWN_ARROW) {
        theShip.y += value;
      }
      else if (keyCode === UP_ARROW){
        theShip.y -= value;
      }
    }












// our Ship class - models the functionality needed to create a user controlled frog character
class Ship {

  constructor(startX, startY) {
    // store the starting position of the frog
    this.x = startX;
    this.y = startY;
    console.log("new");
  }

  // function to display the frog
  display() {
    noStroke();
    // draw the frog at its current position
    fill(245, 152, 66)
    triangle(this.x,this.y+10,this.x+5,this.y+16,this.x+10,this.y+10);
    fill(183, 0, 0)

    triangle(this.x+2,this.y+10,this.x+5,this.y+12,this.x+7,this.y+10);

    fill(110);
    //rect(this.x, this.y, 10, 10);
    bezier(this.x, this.y+10, this.x+1, this.y-3.1,this.x+9, this.y-3.1, this.x+10, this.y+10 )
    fill(40,200,150);
    ellipse(this.x+5,this.y+5,4,5);

  }
  // function to handle moving the frog using the keyboard
  move() {
    //keyPressed();
    // see which key is pressed
    //console.log("test");
  }

}




function invincibleFunction() {
  // Get the checkbox
  var checkBox = document.getElementById("invincible");
  // Get the output text
  if (checkBox.checked == true){
    everInvincible=true;
  }
  else if(checkBox.checked==false){
    everInvincible=false;
  }
}
function easyFunction(){
  var easyCheck = document.getElementById("easy");
  var normalCheck = document.getElementById("normal");
  var settings = document.getElementById("settings");
  if (easyCheck.checked == true){
    lives=20;
  } else {
    lives=10;
  }
  settings.style.display="none";
}
function normalFunction(){
  var normalCheck = document.getElementById("normal");
  var easyCheck = document.getElementById("easy");
  var settings = document.getElementById("settings");
  if (normalCheck.checked == true){
    lives=10;
  }
  easyCheck.style.display="none";
  normalCheck.style.display="none";
  settings.style.display="none";
}