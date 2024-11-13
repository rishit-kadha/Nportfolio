const canvas = document.getElementById("game-canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 578;
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const playerDown = new Image();
playerDown.src = "./imgs/playerDown.png";
const playerUp = new Image();
playerUp.src = "./imgs/playerUp.png";
const playerLeft = new Image();
playerLeft.src = "./imgs/playerLeft.png";
const playerRight = new Image();
playerRight.src = "./imgs/playerRight.png";
const images = { playerUp, playerRight, playerDown, playerLeft };

const image = new Image();
image.src = "./map.png";
const foreImage = new Image();
foreImage.src = "./foreground.png";
const offset = { x: 0, y: -350 };

class Sprite {
  constructor({ position, image }) {
    this.position = position;
    this.image = image;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
class Player {
  constructor({
    image,
    position,
    frames = { max: 4 },
    moving = false,
    facing = { up: false, right: false, down: true, left: false },
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapse: 0 };
    this.sides = {
      top: this.position.y,
      bottom: this.position.y + this.image.height,
      left: this.position.x,
      right: this.position.x + this.image.width / 4,
    };
    this.facing = facing;
    this.moving = moving;
  }
  draw(step) {
    this.sides = {
      top: this.position.y,
      bottom: this.position.y + this.image.height,
      left: this.position.x,
      right: this.position.x + this.image.width / 4,
    };
    c.drawImage(
      this.image,
      this.frames.val * 48,
      0,
      this.image.width / 4,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / 4,
      this.image.height
    );
    if (this.moving) {
      if (step % 15 == 0 && this.frames.val < 3) {
        this.frames.val++;
      } else if (step % 15 == 0 && this.frames.val == 3) {
        this.frames.val = 0;
      }
    } else {
      this.frames.val = 0;
    }
  }
}

const player = new Player({
  position: {
    x: canvas.width / 2 - playerDown.width / (2 * 4),
    y: canvas.height / 2 - playerDown.height / 2,
  },
  image: playerDown,
});

const background = new Sprite({ position: offset, image: image });
const foreground = new Sprite({ position: offset, image: foreImage });
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};
const movables = [background];
let collisionMap = [];
for (let i = 0; i < 40; i++) {
  collisionMap.push(collisions.slice(i * 70, (i + 1) * 70));
}

class Boundary {
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }
  draw() {
    c.fillStyle = "rgba(0, 0, 0, 0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
const boundaries = [];
collisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol == 1025) {
      boundaries.push(
        new Boundary({
          position: { x: j * 48 + offset.x, y: i * 48 + offset.y },
        })
      );
    }
  });
});

boundaries.forEach((boundary) => {
  movables.push(boundary);
});
console.log(boundaries);
let lastKey = "";
function rectangularCollision(Boundary) {
  if (
    ((player.sides.right >= Boundary.position.x &&
      player.sides.right <= Boundary.position.x + Boundary.width) ||
      (player.sides.left >= Boundary.position.x &&
        player.sides.left <= Boundary.position.x + Boundary.width)) &&
    ((player.sides.top >= Boundary.position.y &&
      player.sides.top <= Boundary.position.y + Boundary.height) ||
      (player.sides.bottom >= Boundary.position.y &&
        player.sides.bottom <= Boundary.position.y + Boundary.height))
  ) {
    player.moving = false;
    console.log("colliding");
    return true;
  }
}
let step = 0;
function animate() {
  step++;
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
    rectangularCollision(boundary);
  });
  player.draw(step);
  foreground.draw();
  let moving = true;

  if (keys.w.pressed && lastKey === "w") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          ...boundary,
          position: { x: boundary.position.x, y: boundary.position.y + 3 },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((moveable) => {
        moveable.position.y += 3;
      });
    }
  } else if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          ...boundary,
          position: { x: boundary.position.x, y: boundary.position.y - 3 },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((moveable) => {
        moveable.position.y -= 3;
      });
    }
  } else if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          ...boundary,
          position: { x: boundary.position.x + 3, y: boundary.position.y },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((moveable) => {
        moveable.position.x += 3;
      });
    }
  } else if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          ...boundary,
          position: { x: boundary.position.x - 3, y: boundary.position.y },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((moveable) => {
        moveable.position.x -= 3;
      });
    }
  }
}
animate();
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      player.moving = true;
      keys.w.pressed = true;
      player.image = images.playerUp;
      lastKey = "w";
      break;
    case "a":
      player.moving = true;
      keys.a.pressed = true;
      player.image = images.playerLeft;
      lastKey = "a";
      break;
    case "s":
      player.moving = true;
      keys.s.pressed = true;
      player.image = images.playerDown;
      lastKey = "s";
      break;
    case "d":
      player.moving = true;
      keys.d.pressed = true;
      player.image = images.playerRight;
      lastKey = "d";
      break;
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
      player.moving = false;
      keys.w.pressed = false;
      break;
    case "a":
      player.moving = false;
      keys.a.pressed = false;
      break;
    case "s":
      player.moving = false;
      keys.s.pressed = false;
      break;
    case "d":
      player.moving = false;
      keys.d.pressed = false;
      break;
  }
});
