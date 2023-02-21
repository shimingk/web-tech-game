let spr;

// window.setup = () => {
//   createCanvas(windowWidth, windowHeight);
//   spr = createSprite(width / 2, height, 250, 50);
//   spr.shapeColor = color(255);
// };

// window.draw = () => {
//   background(50);
//   spr.velocity.x = (mouseX - spr.position.x) * 0.2;
//   spr.velocity.y = (mouseY - spr.position.y) * 0.2;
//   drawSprites();
// };
let x;
// Window dimensions.
const windowWidth = 1512;
const windowHeight = 834;

// Rows and columns.
const rows = 5;
const cols = 5;

// Booleans for alive or not and evil paddle direction.
let alive = true;
let changeDir = false;

// Dimensions for bricks
const brickWidth =  Math.round(windowWidth / cols - 5);
const brickHeight = Math.round((windowHeight * 1/10 ) / rows - 10);

// Array to store brick and score
let bricks = [];
let score = 0;

// PADDLE  
let paddle = {
  x: windowWidth / 2 - 25,
  y: windowHeight - 25,
  width: 250,
  height: 25
}

let comp = {
  x: windowWidth / 2 - 25,
  y: windowHeight - 25,
  width: 250,
  height: 25
}

// BALL
let ball = {
  x: paddle.x - 25,
  y: paddle.y - 100,
  speedX: 5,
  speedY: 5,
  diameter: 25,
}

// Set up the canvas.
window.setup = () => {
  createCanvas(windowWidth, windowHeight);
  spr = createSprite(width / 2, height, 250, 50);
  spr.shapeColor = color(255);
  generateBricks();
  x = 15;
}

// Generate bricks.
window.generateBricks = () => {
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      let brickData = {
        x: j * (brickWidth + 2) + 10,
        y: i * (brickHeight + 2) + 25,
        width: brickWidth,
        height: brickHeight
      }
      bricks.push(brickData);
    }
  }
}

// Draw bricks.
window.drawBricks = () => {
  bricks.forEach(brick => {
    fill('springgreen');
    rect(brick.x, brick.y + 50, brick.width, brick.height);
    noStroke();
  });
}

// Keyboard input.
window.keyPressed = () => {

  // restart game 
  if(keyCode === 32 && !alive) {
    alive = true;
    paddle.x = windowWidth / 2 - 50,
    ball.x = paddle.x - 25,
    ball.y = paddle.y - 50,
    ball.speedX = 5;
    ball.speedY = 5;
    bricks.splice(0, bricks.length); // clean array of bricks    
    score = 0;
    generateBricks();
  }
}

// Draw the paddle.
window.drawPaddle = () => {
  fill('teal');
  rect(mouseX - 125, paddle.y, paddle.width, paddle.height);
}

// Draw the comp evil paddle
window.drawComp = () => {
  fill('magenta');
  rect(x, comp.y - 500, comp.width, comp.height);
  if (x > windowWidth) {
    changeDir = true;
  } else if (x <= 0) {
    changeDir = false;
  }
  if (x >= 0 && changeDir == false){
		  x = x + 5;
  } else if(changeDir == true){
		  x = x - 5;
  }
}

// Draw the ball.
window.drawBall = () => {
  fill('yellow');
  circle(ball.x, ball.y, ball.diameter); 
  // Collision on top of the screen
  if(ball.y - ball.diameter / 2 <= 0) {
    ball.speedY = -ball.speedY;
  }
  // Collision on the bottom of the screen.
  if(ball.y + ball.diameter / 2 >= windowHeight) {
    alive = false;    
  }
  // Collision on the left and right of the screen.
  if(ball.x - ball.diameter / 2 <= 0  || ball.x + ball.diameter / 2 >= windowWidth) {
    ball.speedX = -ball.speedX;
  }
  // Paddle collision for first half.
  if(ball.y + ball.diameter / 2 >= paddle.y && ball.x >= mouseX - 125 && ball.x < mouseX - 125 + paddle.width / 2) {
    ball.speedY = -ball.speedY;
    if(ball.speedX > 0) {
      ball.speedX = -ball.speedX;
    }    
  }
  // Paddle collision for second half.
  if(ball.y + ball.diameter / 2 >= paddle.y && ball.x >= mouseX - 125 + paddle.width / 2 && ball.x < mouseX - 125  + paddle.width) {
    ball.speedY = -ball.speedY;
    if(ball.speedX < 0) {
      ball.speedX = -ball.speedX;
    }    
  }

  // Evil comp paddle collisions
    // comp collision for first half.
  // if(ball.y >= comp.y) {
  //   ball.speedY = -ball.speedY;
  //   ball.speedX = -ball.speedX;
  // }

  // Brick collision.
  bricks.forEach((brick, index) => {
    if(ball.y - ball.diameter / 2 <= brick.y + 50 + brick.height && ball.x > brick.x && ball.x <= brick.x + brick.width) {
      ball.speedY = -ball.speedY;
      bricks.splice(index, 1);
      score++;
      if(bricks.length === 0) alive = false;
    }
  }); 

  // Move the ball on the screen.
  ball.x += ball.speedX;
  ball.y += ball.speedY;
}

// Display score at the top of the screen.
window.displayScore = () => {
  fill("beige");
  textAlign(CENTER);
  textSize(25)
  text(`Score: ${score}`, windowWidth / 2, 22);
}

// Display message (either "GAME OVER" or "You Win!")
window.endScreen = (message) => {
  if (message === "You Win!") {
    fill('springgreen');
    message += "  🤩";
  } else {
    fill('magenta');
  }
  textAlign(CENTER);
  textSize(35);
  text(message, windowWidth / 2, windowHeight / 2); // 300, 170
  text('Play again: [Space]', windowWidth / 2, windowHeight / 2 + 55); // 300, 225
  text(`Score: ${score}`, windowWidth / 2, windowHeight / 2 - 55); // 300, 280
}

// Animate and draw everything to the screen.
window.draw = () => {
  background("black");
  spr.velocity.x = (mouseX - spr.position.x) * 0.25;
  // If the player broke all the bricks, they win.
  if(bricks.length === 0) {
    endScreen("You Win!");
  }
  
  // If the player died and there are still bricks to break, they lost.
  if(!alive && bricks.length != 0) endScreen("GAME OVER 😜");
  
  // If the player is still alive, draw everything to the screen.
  if(alive) {
    drawBricks();
    drawPaddle();
    drawComp();
    drawBall();
    displayScore();
    drawSprites();
  }
}