function start() {
  let canvas = document.getElementById("game-pacman") as HTMLCanvasElement;
  let ctx = canvas.getContext("2d");

  if (ctx) {
    const drawPacman = new DrawPacman(ctx, canvas.width, canvas.height);
    const pacman = new Pacman({ x: 60, y: 60 }, "#FFFF00", drawPacman);
    function move(event: KeyboardEvent) {
      pacman.movePlayer(event);
    }
    window.addEventListener("keypress", move);
  }
}

class Player {
  _position: position;
  _color: string;
  draw: DrawPlayer;
  constructor(p: position, color: string, drawPlayer: DrawPlayer) {
    this._position = p;
    this._color = color;
    this.draw = drawPlayer;
    this.draw.position = this._position;
    this.draw._color = this._color;
  }

  get position(): position {
    return this._position;
  }
  set position(position: position) {
    this._position = position;
  }
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color;
  }

  drawPlayer(direction: string) {
    this.draw.draw(direction);
  }
}

class Pacman extends Player {
  readonly right = "f";
  readonly left = "s";
  readonly up = "e";
  readonly down = "d";

  movePlayer(event: KeyboardEvent) {
    (this.draw as DrawPacman).clean();
    if (event.key === this.right) {
      this._position.x += 5;
      this.drawPlayer(this.right);
    }
    if (event.key === this.left) {
      this._position.x -= 5;
      this.drawPlayer(this.left);
    }
    if (event.key === this.up) {
      this._position.y -= 5;
      this.drawPlayer(this.up);
    }
    if (event.key === this.down) {
      this._position.y += 5;
      this.drawPlayer(this.down);
    }
  }
}

interface Draw {
  draw(direction: string): void;
}

type position = {
  x: number;
  y: number;
};

abstract class DrawPlayer implements Draw {
  ctx: CanvasRenderingContext2D;
  _position: position = { x: 0, y: 0 };
  _color: string = "";
  width: number;
  height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }
  set position(position: position) {
    this._position = position;
  }
  set color(color: string) {
    this._color = color;
  }
  draw(direction: string): void {}
}

class DrawPacman extends DrawPlayer {
  override draw(direction: string) {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#FFFF00";
    if (direction === "f") {
      this.ctx.arc(
        this._position.x,
        this._position.y,
        30,
        (1 / 4) * Math.PI,
        (7 / 4) * Math.PI
      );
    }
    if (direction === "s") {
      this.ctx.arc(
        this._position.x,
        this._position.y,
        30,
        (5 / 4) * Math.PI,
        (3 / 4) * Math.PI
      );
    }
    if (direction === "e") {
      this.ctx.arc(
        this._position.x,
        this._position.y,
        30,
        (7 / 4) * Math.PI,
        (5 / 4) * Math.PI
      );
    }
    if (direction === "d") {
      this.ctx.arc(
        this._position.x,
        this._position.y,
        30,
        (3 / 4) * Math.PI,
        (1 / 4) * Math.PI
      );
    }
    this.ctx.lineTo(this._position.x, this._position.y);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }
  clean() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
