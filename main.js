//setting variables and stuff
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let pointsX = []
let pointsY = []
let grid = new Array(0);
let gridLength = 100;
let time = 0;
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let mouseDown = 0;
let mouseLock = false;
let lockToggleWasDown = 0;
let playerDir = 0;
let playerX = gridLength*10-10;
let playerY = gridLength*10-10;
let wPress = false;
let aPress = false;
let sPress = false;
let dPress = false;
let gridIdxX = 0
let gridIdxY = 0
let sinPlayerDir = 0;
let cosPlayerDir = 0;
for (let i = 0; i<10; i++) {
  pointsX[i] = (Math.random() - 0.5) * 1000;
  pointsY[i] = (Math.random() - 0.5) * 1000;
}
for (let i = 0; i < gridLength; i++) {
  grid[i] = new Array(gridLength).fill(0);
}
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
grid[i][j] = Math.round(Math.random()/1.9)
    if (i === 0 || i === grid.length - 1 || j === 0 || j === grid.length - 1) {
grid[i][j] = 1;
    }
  }
}
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
  //detect mouse movement
  window.addEventListener(
    'mousemove',
    (e) => {
      if (document.pointerLockElement !== null) {
        if (mouseLock === false) {
          mouseX = mouseX + e.movementX / 2;
          mouseY = mouseY + e.movementY / 2;
        } else {
          playerDir = playerDir - 0.0005 * e.movementX;
        }
      }
    });
  //mouse locking
  document.addEventListener(
    'keyup',
    (e) => {
      if (e.key === ' ') {
        if (lockToggleWasDown <= 0) {
          if (mouseLock === false) {
            mouseLock = true;
          } else {
            if (mouseLock === true) {
              mouseLock = false;
            }
          }
        }
        lockToggleWasDown = 2;
      }
    });
  if (mouseLock) {
    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;
  }
  //detect if left click is held down
  document.addEventListener(
    'mousedown',
    (e) => {
      if (e.button === 0) {
        document.body.requestPointerLock().then();
        mouseDown = 1;
      }
    });
  document.addEventListener(
    'mouseup',
    (e) => {
      if (e.button === 0) {
        mouseDown = 0;
      }
    });
  //player movement
  document.addEventListener(
    'keydown',
    (e) => {
      if (mouseLock === true) {
      if (e.key === 'w') {
        wPress = true;
      }
      if (e.key === 'a') {
        aPress = true;
      }
      if (e.key === 's') {
        sPress = true;
      }
      if (e.key === 'd') {
        dPress = true;
      }}
    });
  document.addEventListener(
    'keyup',
    (e) => {
      if (e.key === 'w' || mouseLock === false) {
        wPress = false;
      }
      if (e.key === 'a' || mouseLock === false) {
        aPress = false;
      }
      if (e.key === 's' || mouseLock === false) {
        sPress = false;
      }
      if (e.key === 'd' || mouseLock === false) {
        dPress = false;
      }
    });
//beginning of the loop
function myLoop() {
  //mouse lock toggle
  if (lockToggleWasDown > 0) {
    lockToggleWasDown = lockToggleWasDown - 1;
  }
  //wasd movement
  if (wPress === true) {
    playerX = playerX + Math.cos(playerDir) * 8;
    playerY = playerY - Math.sin(playerDir) * 8;
  }
  if (aPress === true) {
    playerX = playerX - Math.sin(playerDir) * 8;
    playerY = playerY - Math.cos(playerDir) * 8;
  }
  if (sPress === true) {
    playerX = playerX - Math.cos(playerDir) * 8;
    playerY = playerY + Math.sin(playerDir) * 8;
  }
  if (dPress === true) {
    playerX = playerX + Math.sin(playerDir) * 8;
    playerY = playerY + Math.cos(playerDir) * 8;
  }
  //limit mouse position
  if (mouseX > canvas.width - 5) {
    mouseX = canvas.width - 5;
  }
  if (mouseX < 5) {
    mouseX = 5;
  }
  if (mouseY > canvas.height - 5) {
    mouseY = canvas.height - 5;
  }
  if (mouseY < 5) {
    mouseY = 5;
  }
  //find sin/cos of playerDir
  sinPlayerDir = Math.sin(playerDir)
  cosPlayerDir = Math.cos(playerDir)
  //clear screen
  document.body.style.backgroundColor = 'rgb(0, 0, 0)'
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //render grid
  for (
    let i = 0;
    i < Math.round(canvas.width / 6) * Math.round(canvas.height / 6);
    i++
  ) {
  gridIdxX =
            0.05 * playerY +
            sinPlayerDir *
            (4*canvas.height/-240+Math.floor(i / Math.round(canvas.width / 6)) / 8)+
            cosPlayerDir *
            (canvas.width/-96+Math.floor(i % Math.round(canvas.width / 6)) / 8)
  gridIdxY =
             0.05 * playerX +
             sinPlayerDir *
             (canvas.width/-96+Math.floor(i % Math.round(canvas.width / 6)) / 8)-
             cosPlayerDir *
             (4*canvas.height/-240+Math.floor(i / Math.round(canvas.width / 6)) / 8)
    if (
      grid[(Math.round(Math.abs(gridIdxX))%gridLength)][Math.round((Math.abs(gridIdxY))%gridLength)] === 1
    ) {
      ctx.fillStyle = 'rgb(255, 0, 0)';
    } else {
      ctx.fillStyle = 'rgb(20, 20, 20)';
    }
    if (gridIdxX<0||gridIdxX>gridLength-1||gridIdxY<0||gridIdxY>gridLength-1) {
      ctx.fillStyle = 'rgb(0, 0, 0)';
    }
    ctx.fillRect(
      Math.floor(i % Math.round(canvas.width / 6)) * 6,
      Math.floor(i / Math.round(canvas.width / 6)) * 6,
      6,
      6,
    );
  }
  //render points
  ctx.fillStyle = 'rgb(50, 0, 0)';
  for (let i = 0; i < pointsX.length; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.sin(playerDir) *2.4* (pointsX[i] - playerX) +
        Math.cos(playerDir) *2.4* (pointsY[i] - playerY) +
        canvas.width / 2,
      Math.sin(playerDir) *2.4* (pointsY[i] - playerY) -
        Math.cos(playerDir) *2.4* (pointsX[i] - playerX) +
        (4 * canvas.height) / 5,
      30,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.closePath();
  }
  //render player
  ctx.fillStyle = 'rgb(255, 150, 0)';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, (4 * canvas.height) / 5, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
  //render mouse
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  if (mouseLock === false) {
    ctx.beginPath();
    ctx.arc(
      mouseX,
      mouseY,
      3 + 0.15 * Math.sin(time * 0.08) - mouseDown,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.closePath();
  }
  //end of the loop
  requestAnimationFrame(() => {
    time++;
    myLoop();
  });
}
myLoop();