"use strict";
function start() {
    let canvas = document.getElementById("game-pacman");
    let ctx = canvas.getContext("2d");
    if (ctx) {
        const drawPacman = new DrawPacman(ctx, canvas.width, canvas.height);
        const pacman = new Pacman({ x: 60, y: 60 }, "#FFFF00", drawPacman);
        function move(event) {
            pacman.movePlayer(event);
        }
        window.addEventListener("keypress", move);
    }
}
class Player {
    constructor(p, color, drawPlayer) {
        this._position = p;
        this._color = color;
        this.draw = drawPlayer;
        this.draw.position = this._position;
        this.draw._color = this._color;
    }
    get position() {
        return this._position;
    }
    set position(position) {
        this._position = position;
    }
    get color() {
        return this._color;
    }
    set color(color) {
        this._color = color;
    }
    drawPlayer(direction) {
        this.draw.draw(direction);
    }
}
class Pacman extends Player {
    constructor() {
        super(...arguments);
        this.right = "f";
        this.left = "s";
        this.up = "e";
        this.down = "d";
    }
    movePlayer(event) {
        this.draw.clean();
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
class DrawPlayer {
    constructor(ctx, width, height) {
        this._position = { x: 0, y: 0 };
        this._color = "";
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }
    set position(position) {
        this._position = position;
    }
    set color(color) {
        this._color = color;
    }
    draw(direction) { }
}
class DrawPacman extends DrawPlayer {
    draw(direction) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#FFFF00";
        if (direction === "f") {
            this.ctx.arc(this._position.x, this._position.y, 30, (1 / 4) * Math.PI, (7 / 4) * Math.PI);
        }
        if (direction === "s") {
            this.ctx.arc(this._position.x, this._position.y, 30, (5 / 4) * Math.PI, (3 / 4) * Math.PI);
        }
        if (direction === "e") {
            this.ctx.arc(this._position.x, this._position.y, 30, (7 / 4) * Math.PI, (5 / 4) * Math.PI);
        }
        if (direction === "d") {
            this.ctx.arc(this._position.x, this._position.y, 30, (3 / 4) * Math.PI, (1 / 4) * Math.PI);
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
