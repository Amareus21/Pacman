function start() {
  let canvas = document.getElementById("game-pacman") as HTMLCanvasElement;
  let ctx = canvas.getContext("2d");

  if (ctx) {
    const pacman = new Pacman({ x: 65, y: 300 }, 30, "#FFFF00", "right");
    const drawPacman = new DrawPacman(pacman, ctx, canvas.width, canvas.height);
    const drawLayer = new DrawLayer(ctx);
    function move(event: KeyboardEvent) {
      let lastposition = { ...pacman.position };
      if (event.key === pacman.right) {
        pacman.position.x += 5;
        pacman.direction = "right";
      }
      if (event.key === pacman.left) {
        pacman.position.x -= 5;
        pacman.direction = "left";
      }
      if (event.key === pacman.up) {
        pacman.position.y -= 5;
        pacman.direction = "up";
      }
      if (event.key === pacman.down) {
        pacman.position.y += 5;
        pacman.direction = "down";
      }
      if (Colision.colision(DrawLayer.arrayobstacles, pacman)) {
        pacman.position = lastposition;
      }
    }

    window.addEventListener("keypress", move);
    window.requestAnimationFrame(drawGame);
    function drawGame() {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPacman.draw();

        drawLayer.init();
        window.requestAnimationFrame(drawGame);
      }
    }
  }
}

class Player {
  _position: position;
  _color: string;
  _width: number;
  _direction: string;
  constructor(p: position, width: number, color: string, direction: string) {
    this._position = p;
    this._color = color;
    this._direction = direction;
    this._width = width;
  }

  get position(): position {
    return this._position;
  }
  set position(position: position) {
    this._position = position;
  }
  set positionX(x: number) {
    this._position.x = x;
  }
  set positionY(y: number) {
    this._position.y = y;
  }
  get positionX() {
    return this._position.x;
  }
  get positionY() {
    return this._position.y;
  }
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color;
  }
  get direction(): string {
    return this._direction;
  }
  set direction(direction: string) {
    this._direction = direction;
  }
  get width(): number {
    return this._width;
  }
  set width(width: number) {
    this._width = width;
  }
}

class Pacman extends Player {
  readonly right = "f";
  readonly left = "s";
  readonly up = "e";
  readonly down = "d";
}

type position = {
  x: number;
  y: number;
};

abstract class DrawPlayer {
  ctx: CanvasRenderingContext2D;
  _color: string = "";
  width: number;
  height: number;
  player: Player;

  constructor(
    player: Player,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.player = player;
  }

  abstract draw(): void;
}

class DrawPacman extends DrawPlayer {
  override draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#FFFF00";
    if (this.player.direction === "right") {
      this.ctx.arc(
        this.player.position.x,
        this.player.position.y,
        this.player.width,
        (1 / 4) * Math.PI,
        (7 / 4) * Math.PI
      );
    }
    if (this.player.direction === "left") {
      this.ctx.arc(
        this.player.position.x,
        this.player.position.y,
        this.player.width,
        (5 / 4) * Math.PI,
        (3 / 4) * Math.PI
      );
    }
    if (this.player.direction === "up") {
      this.ctx.arc(
        this.player.position.x,
        this.player.position.y,
        this.player.width,
        (7 / 4) * Math.PI,
        (5 / 4) * Math.PI
      );
    }
    if (this.player.direction === "down") {
      this.ctx.arc(
        this.player.position.x,
        this.player.position.y,
        this.player.width,
        (3 / 4) * Math.PI,
        (1 / 4) * Math.PI
      );
    }
    this.ctx.lineTo(this.player.position.x, this.player.position.y);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }
}

abstract class DrawObstacle {
  width: number;
  heigth: number;
  round: number;
  ctx: CanvasRenderingContext2D;
  position: position;
  constructor(
    ctx: CanvasRenderingContext2D,
    position: position,
    width: number,
    heigth: number,
    round: number
  ) {
    this.ctx = ctx;
    this.width = width;
    this.heigth = heigth;
    this.position = position;
    this.round = round;
  }
  abstract drawObstacle(): void;
}

class DrawBorder extends DrawObstacle {
  _isBorder: boolean;
  constructor(
    ctx: CanvasRenderingContext2D,
    position: position,
    width: number,
    heigth: number,
    round: number,
    isBorder: boolean
  ) {
    super(ctx, position, width, heigth, round);
    this._isBorder = isBorder;
  }
  get isBorder(): boolean {
    return this._isBorder;
  }
  drawObstacle() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#0000FF";
    this.ctx.roundRect(
      this.position.x,
      this.position.y,
      this.width,
      this.heigth,
      this.round
    );
    this.ctx.stroke();
  }
}
class DrawLayer {
  border: DrawObstacle;
  border2: DrawObstacle;
  obstacle1: DrawObstacle;
  obstacle2: DrawObstacle;
  obstacle3: DrawObstacle;
  width: number;
  heigth: number;
  x: number;
  y: number;
  static _arrayObstacles = new Array<DrawObstacle>();
  static get arrayobstacles() {
    return this._arrayObstacles;
  }
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = 1230;
    this.heigth = 735;
    this.x = 35;
    this.y = 35;
    this.border = new DrawBorder(this.ctx, { x: 5, y: 5 }, 1290, 790, 20, true);
    this.border2 = new DrawBorder(
      this.ctx,
      { x: this.x, y: this.y },
      this.width,
      this.heigth,
      20,
      true
    );
    this.obstacle1 = new DrawBorder(
      this.ctx,
      { x: this.x + 65, y: this.y + 65 },
      this.width / 2 - 95,
      30,
      20,
      false
    );
    this.obstacle2 = new DrawBorder(
      this.ctx,
      { x: this.width / 2 + 65, y: this.y + 65 },
      this.width / 2 - 95,
      30,
      20,
      false
    );
    this.obstacle3 = new DrawBorder(
      this.ctx,
      { x: this.x, y: this.y + 155 },
      300,
      30,
      20,
      false
    );
    DrawLayer._arrayObstacles.push(this.obstacle1);
    DrawLayer._arrayObstacles.push(this.obstacle2);
    DrawLayer._arrayObstacles.push(this.obstacle3);
    DrawLayer._arrayObstacles.push(this.border);
    DrawLayer._arrayObstacles.push(this.border2);
  }
  init() {
    this.border.drawObstacle();
    this.border2.drawObstacle();
    for (const obstacle of DrawLayer._arrayObstacles) {
      obstacle.drawObstacle();
    }
  }
}
class Colision {
  static colision(obstacles: Array<DrawObstacle>, player: Player): boolean {
    for (let obstacle of obstacles) {
      
      let pointA = {
        x: player.positionX - player.width,
        y: player.positionY - player.width,
      };
      let pointB = {
        x: player.positionX + player.width,
        y: player.positionY - player.width,
      };
      let pointC = {
        x: player.positionX + player.width,
        y: player.positionY + player.width,
      };
      let pointD = {
        x: player.positionX - player.width,
        y: player.positionY + player.width,
      };
      let a = { ...obstacle.position };
      let b = {
        x: obstacle.position.x + obstacle.width,
        y: obstacle.position.y,
      };
      let c = {
        x: obstacle.position.x + obstacle.width,
        y: obstacle.position.y + obstacle.heigth,
      };
      let d = {
        x: obstacle.position.x,
        y: obstacle.position.y + obstacle.heigth,
      };
      let arrayPlayer = [pointA, pointB, pointC, pointD];
      let arrayobstacles = [a, b, c, d];
      for (const point of arrayPlayer) {
        let sign1 = Math.sign(calProdVectorial(point, a, b));
        let sign2 = Math.sign(calProdVectorial(point, b, c));
        let sign3 = Math.sign(calProdVectorial(point, c, d));
        let sign4 = Math.sign(calProdVectorial(point, d, a));
        if ((<DrawBorder>obstacle).isBorder) {
          if (sign1 !== sign2 || sign3 !== sign4 || sign1 !== sign3) {
            return true;
          }
        } else if (sign1 === sign2 && sign3 === sign4 && sign1 === sign3) {
          return true;
        }
      }
      for (const point of arrayobstacles) {
        let sign1 = Math.sign(calProdVectorial(point, pointA, pointB));
        let sign2 = Math.sign(calProdVectorial(point, pointB, pointC));
        let sign3 = Math.sign(calProdVectorial(point, pointC, pointD));
        let sign4 = Math.sign(calProdVectorial(point, pointD, pointA));
        if (sign1 === sign2 && sign3 === sign4 && sign1 === sign3) {
          return true;
        }
      }
      function calProdVectorial(
        point: position,
        a: position,
        b: position
      ): number {
        let v = { x: a.x - point.x, y: a.y - point.y };
        let w = { x: b.x - point.x, y: b.y - point.y };
        let vw = v.x * w.y - v.y * w.x;
        return vw;
      }
    }
    return false;
  }
}
