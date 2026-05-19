//setting variables and stuff
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(canvas.width, canvas.height);
const data = imageData.data;
let pointsX = [];
let pointsY = [];
let grid = new Array(0);
let gridConnection = [];
let connectedBlocks;
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
let gridIdxX = 0;
let gridIdxY = 0;
let sinPlayerDir = 0;
let cosPlayerDir = 0;
let photonX = 0;
let photonY = 0;
let photonOriginX = 0;
let photonOriginY = 0;
let shadow = false;
let FOV = 160
let roomWidth = 0;
let roomHeight = 0;
let roomX = 0;
let roomY = 0;
let hallX = 0;
let hallY = 0;
let hallLength = 0;
let hallDir = 0;
let NeighboringBlocks = 0;
//add points
for (let i = 0; i<5; i++) {
  pointsX[i] = gridLength*10-10+(Math.random() - 0.5) * (gridLength*20-40);
  pointsY[i] = gridLength*10-10+(Math.random() - 0.5) * (gridLength*20-40);
}
//fill grid with all 0
for (let i = 0; i < gridLength; i++) {
  grid[i] = new Array(gridLength).fill(0);
}
//fill gridConnection with all 0
for (let i = 0; i < gridLength; i++) {
  gridConnection[i] = new Array(gridLength).fill(0);
}
//add rooms
for (let l = 0; l < 256; l++) {
  roomWidth = 1+3*Math.round((8*Math.random()+8)/3)
  roomHeight = 1+3*Math.round((8*Math.random()+8)/3)
  roomX = 3*Math.round(((gridLength-roomWidth)*Math.random())/3)
  roomY = 3*Math.round(((gridLength-roomHeight)*Math.random())/3)
  for (let i = 0; i < gridLength; i++) {
    for (let j = 0; j < gridLength; j++) {
      if (i >= roomX && i <= roomX + roomWidth - 1 && j >= roomY && j <= roomY - 1 + roomHeight) {
        if (i === roomX || i === roomWidth + roomX - 1 || j === roomY || j === roomHeight + roomY - 1){
          grid[i][j] = 1;
        }else{
          grid[i][j] = 0;
        }
      }
    }
  }
}
//add hallways
for (let l = 0; l < 16; l++) {
  hallLength = 3*Math.round((16*Math.random()+8)/3)
  hallDir = Math.round(Math.random())
  hallX = 3*Math.round((gridLength/3)*Math.random()+3)
  hallY = 3*Math.round((gridLength/3)*Math.random())
  if (hallDir === 0) {
  for (let i = 0; i < hallLength; i++) {
    grid [(hallX+i)%gridLength] [(hallY)%gridLength] = 1;
    grid [(hallX+i)%gridLength] [(hallY-1)%gridLength] = 0;
    grid [(hallX+i)%gridLength] [(hallY-2)%gridLength] = 0;
    grid [(hallX+i)%gridLength] [(hallY-3)%gridLength] = 1;
  }
  }else{
    for (let i = 0; i < hallLength; i++) {
      grid [(hallX)%gridLength] [(hallY+i)%gridLength] = 1;
      grid [(hallX-1)%gridLength] [(hallY+i)%gridLength] = 0;
      grid [(hallX-2)%gridLength] [(hallY+i)%gridLength] = 0;
      grid [(hallX-3)%gridLength] [(hallY+i)%gridLength] = 1;
  }
}
  }
//clean up unnecessary blocks
for (let l = 0; l < 32; l++) {
for (let i = 1; i < gridLength-2; i++) {
  for (let j = 1; j < gridLength-2; j++) {
    NeighboringBlocks = 0;
    if (grid[(i+1)%gridLength][j] === 1) {
      NeighboringBlocks = NeighboringBlocks + 1
    }
    if (grid[(i-1)%gridLength][j] === 1) {
      NeighboringBlocks = NeighboringBlocks + 1
    }
    if (grid[i][(j+1)%gridLength] === 1) {
      NeighboringBlocks = NeighboringBlocks + 1
    }
    if (grid[i][(j-1)%gridLength] === 1) {
      NeighboringBlocks = NeighboringBlocks + 1
    }
    if (NeighboringBlocks < 2) {
      grid [i][j] = 0
    }
  }
}
}
//check which blocks are connected
for (let t = 0; t < 32; t++) {
gridConnection [gridLength/2] [gridLength/2] = 1
for (let l = 0; l < gridLength; l++) {
  for (let i = 1; i < gridLength-2; i++) {
    for (let j = 1; j < gridLength-2; j++) {
      if (grid[i][j] === 0) {
      if (gridConnection[(i+1)%gridLength][j] === 1) {
        gridConnection[i][j] = 1;
      }
      if (gridConnection[(i-1)%gridLength][j] === 1) {
        gridConnection[i][j] = 1;
      }
      if (gridConnection[i][(j+1)%gridLength] === 1) {
        gridConnection[i][j] = 1;
      }
      if (gridConnection[i][(j-1)%gridLength] === 1) {
        gridConnection[i][j] = 1;
      }
    }
      }
  }
}
//break wall
  for (let i = 1; i < gridLength-2; i++) {
    for (let j = 1; j < gridLength-2; j++) {
      if (grid[i][j] === 1) {
        if (t%4 === 0 &&
          gridConnection[(i+1)%gridLength][j] === 1 &&
          gridConnection[(i-1)%gridLength][j] === 0 &&
          grid[(i+1)%gridLength][j] === 0 &&
          grid[(i-1)%gridLength][j] === 0) {
          grid[i][j] = 0;
        }
        if (t%4 === 1 &&
          gridConnection[(i+1)%gridLength][j] === 0 &&
          gridConnection[(i-1)%gridLength][j] === 1 &&
          grid[(i+1)%gridLength][j] === 0 &&
          grid[(i-1)%gridLength][j] === 0) {
          grid[i][j] = 0;
        }
        if (t%4 === 2 &&
          gridConnection[i][(j+1)%gridLength] === 1 &&
          gridConnection[i][(j-1)%gridLength] === 0 &&
          grid[i][(j+1)%gridLength] === 0 &&
          grid[i][(j-1)%gridLength] === 0) {
          grid[i][j] = 0;
        }
        if (t%4 === 3 &&
          gridConnection[i][(j+1)%gridLength] === 0 &&
          gridConnection[i][(j-1)%gridLength] === 1 &&
          grid[i][(j+1)%gridLength] === 0 &&
          grid[i][(j-1)%gridLength] === 0) {
          grid[i][j] = 0;
        }
      }
    }
  }
  }
//log # of connected blocks
connectedBlocks = 0;
for (let i = 0; i < gridLength; i++) {
  for (let j = 0; j < gridLength; j++) {
    if (gridConnection[i][j] === 1) {
      connectedBlocks = connectedBlocks + 1;
    }
  }
}
console.log(connectedBlocks);
//add border
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (i === 0 || i === grid.length - 1 || j === 0 || j === grid.length - 1) {
      grid[i][j] = 1;
    }
  }
}
//fill useless rooms
for (let i = 0; i < gridLength; i++) {
  for (let j = 0; j < gridLength; j++) {
    if (gridConnection[i][j] === 0) {
      grid [i] [j] = 1
    }
  }
}
//I forgot what this does
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
  FOV = FOV+(120-FOV)/2
  if (wPress === true) {
    playerX = playerX + Math.cos(playerDir) * 8;
    FOV = FOV+25
    //wall collision x
    if (grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
      [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1) {
      for (let i = 0; i < 5 || grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
        [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1; i++) {
        playerX = playerX + Math.cos(playerDir) * -1;
      }
    }
    playerY = playerY - Math.sin(playerDir) * 8;
    //wall collision y
    if (grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
      [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1) {
      for (let i = 0; i < 5 || grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
        [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1; i++) {
        playerY = playerY - Math.sin(playerDir) * -1;
      }
    }
  }
  if (aPress === true) {
    playerX = playerX - Math.sin(playerDir) * 8;
    FOV = FOV+15
    //wall collision x
    if (grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
      [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1) {
      for (let i = 0; i < 5 || grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
        [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1; i++) {
        playerX = playerX - Math.sin(playerDir) * -1;
      }
    }
    playerY = playerY - Math.cos(playerDir) * 8;
    //wall collision y
    if (grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
      [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1) {
      for (let i = 0; i < 5 || grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
        [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1; i++) {
        playerY = playerY - Math.cos(playerDir) * -1;
      }
    }
  }
  if (sPress === true) {
    playerX = playerX - Math.cos(playerDir) * 8;
    FOV = FOV-25
    //wall collision x
    if (grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
      [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1) {
      for (let i = 0; i < 5 || grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
        [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1; i++) {
        playerX = playerX - Math.cos(playerDir) * -1;
      }
    }
    playerY = playerY + Math.sin(playerDir) * 8;
    //wall collision y
    if (grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
      [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1) {
      for (let i = 0; i < 5 || grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
        [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1; i++) {
        playerY = playerY + Math.sin(playerDir) * -1;
      }
    }
  }
  if (dPress === true) {
    playerX = playerX + Math.sin(playerDir) * 8;
    FOV = FOV+15
    //wall collision x
    if (grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
      [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1) {
      for (let i = 0; i < 5 || grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
        [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1; i++) {
        playerX = playerX + Math.sin(playerDir) * -1;
      }
    }
    playerY = playerY + Math.cos(playerDir) * 8;
    //wall collision y
    if (grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
      [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1) {
      for (let i = 0; i < 5 || grid[(Math.round(Math.abs(playerY*0.05))%gridLength)]
        [Math.round((Math.abs(playerX*0.05))%gridLength)] === 1; i++) {
        playerY = playerY + Math.cos(playerDir) * -1;
      }
    }
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
  //calculate pixel type
  for (
    let i = 0;
    i < Math.round(canvas.width/6) * Math.round(canvas.height/6);
    i++
  ) {
  gridIdxX =
            0.05 * playerY +
            sinPlayerDir *
            (4*canvas.height/-240+Math.floor(i / Math.round(canvas.width/6)) / 8)+
            cosPlayerDir *
            (canvas.width/-96+Math.floor(i % Math.round(canvas.width/6)) / 8)
  gridIdxY =
             0.05 * playerX +
             sinPlayerDir *
             (canvas.width/-96+Math.floor(i % Math.round(canvas.width/6)) / 8)-
             cosPlayerDir *
             (4*canvas.height/-240+Math.floor(i / Math.round(canvas.width/6)) / 8)
//check for shadows
    shadow = false
    if (i-((Math.round(canvas.width)*-(FOV/12))+FOV*(Math.abs(((i+106)%(Math.round(canvas.width/6)))-Math.round(canvas.width/12))))
      < (Math.round(canvas.width/6))*4*canvas.height/(6*5)) {
photonOriginX = 0.05 * playerY +
            sinPlayerDir *
            (4*canvas.height/-240+(i / Math.round(canvas.width/6)) / 8)+
            cosPlayerDir *
            (canvas.width/-96+(i % Math.round(canvas.width/6)) / 8)
photonOriginY = 0.05 * playerX +
             sinPlayerDir *
             (canvas.width/-96+(i % Math.round(canvas.width/6)) / 8)-
             cosPlayerDir *
             (4*canvas.height/-240+(i / Math.round(canvas.width/6)) / 8)
photonX = photonOriginX
photonY = photonOriginY
    for(let j = 0; j < 20; j++) {
        photonX = photonX-(photonOriginX-playerY*0.05)/20
        photonY = photonY-(photonOriginY-playerX*0.05)/20
            if (grid[Math.round(Math.abs(photonX))%gridLength][Math.round((Math.abs(photonY))%gridLength)] === 1) {
      shadow = true
              }
    }
}else{
      shadow = true
    }
//render pixels
if (!(gridIdxX<0||gridIdxX>gridLength-1||gridIdxY<0||gridIdxY>gridLength-1)) {
if(grid[(Math.round(Math.abs(gridIdxX))%gridLength)][Math.round((Math.abs(gridIdxY))%gridLength)] === 1){
    if (shadow === false) {
  ctx.fillStyle = 'rgb(255, 0, 0)';
    }else{
  ctx.fillStyle = 'rgb(50, 0, 0)';
    }
      ctx.fillRect(Math.floor(i % Math.round(canvas.width/6))*6,
  Math.floor(i / Math.round(canvas.width/6))*6,
  6, 6)
  }else{
  if (shadow === false) {
        ctx.fillStyle = 'rgb(25, 25, 25)';
           ctx.fillRect(Math.floor(i % Math.round(canvas.width/6))*6,
  Math.floor(i / Math.round(canvas.width/6))*6,
  6, 6) 
  }
  }
  }
}
  //render points
  ctx.fillStyle = 'rgb(50, 0, 50)';
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
  ctx.arc(canvas.width / 2, (4 * canvas.height) / 5, 10, 0, Math.PI * 2);
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
