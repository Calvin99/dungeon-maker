var canvas = document.getElementById("dungeon");
var ctx = canvas.getContext("2d");

console.clear();

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

var dots = true;

var finished = false;
var crosshatchImg = new Image();
crosshatchImg.src = "images/crosshatch.png";

var maskCanvas = document.createElement('canvas');
maskCanvas.width = canvas.width;
maskCanvas.height = canvas.height;
var mask = maskCanvas.getContext('2d');

//GRID
var grid = [];
for (x = 0; x < WIDTH / 20; ++x) {
	grid[x] = [];
	for (y = 0; y < HEIGHT / 20; ++y) {
		grid[x][y] = false;
	}
}

var hWalls = [];
for (x = 0; x < WIDTH / 20; ++x) {
	hWalls[x] = [];
	for (y = 0; y < HEIGHT / 20; ++y) {
		hWalls[x][y] = false;
	}
}

var vWalls = [];
for (x = 0; x < WIDTH / 20; ++x) {
	vWalls[x] = [];
	for (y = 0; y < HEIGHT / 20; ++y) {
		vWalls[x][y] = false;
	}
}

function clearWalls() {
	for (x = 0; x < vWalls.length; ++x) {
		for (y = 0; y < vWalls[0].length; ++y) {
			vWalls[x][y] = false;
		}
	}
	for (x = 0; x < hWalls.length; ++x) {
		for (y = 0; y < hWalls[0].length; ++y) {
			hWalls[x][y] = false;
		}
	}
}

function smartWalls() {
	clearWalls();
	for (x = 0; x < grid.length; ++x) {
		for (y = 0; y < grid[0].length; ++y) {
			if(grid[x][y]) { 
				if(x > 0 && !grid[x - 1][y])
					vWalls[x][y] = true;
				if(x < grid.length - 1 && !grid[x + 1][y])
					vWalls[x + 1][y] = true;
				if(y > 0 && !grid[x][y - 1])
					hWalls[x][y] = true;
				if(y < grid[0].length - 1 && !grid[x][y + 1])
					hWalls[x][y + 1] = true;
			}
		}
	}
}

//MOUSE
const MODE = {
	GRID: 0,
	WALLS: 1
};

function Mouse() {
	this.hover = false;
	this.x = 0;
	this.y = 0;
	this.mode = MODE.GRID;
	this.click = false;
	this.fill;
}

Mouse.prototype.move = function(e) {
    rect = canvas.getBoundingClientRect();
    this.x = Math.round((e.clientX - rect.left));
    this.y = Math.round((e.clientY - rect.top));
	
	if (this.click) {
		switch (this.mode) {
			case MODE.GRID:
				grid[Math.floor(this.x / 20)][Math.floor(this.y / 20)] = this.fill;
				break;
			case MODE.WALLS:
				if(Math.abs(this.x % 20 - 10) > Math.abs(this.y % 20 - 10)) {
					vWalls[Math.round(this.x / 20)][Math.floor(this.y / 20)] = this.fill;
				} else {
					hWalls[Math.floor(this.x / 20)][Math.round(this.y / 20)] = this.fill;
				}
				break;
		}
	}
}

Mouse.prototype.down = function() {
	this.click = true;
	
	switch (this.mode) {
		case MODE.GRID:
			grid[Math.floor(this.x / 20)][Math.floor(this.y / 20)] = !grid[Math.floor(this.x / 20)][Math.floor(this.y / 20)];
			this.fill = grid[Math.floor(this.x / 20)][Math.floor(this.y / 20)];
			break;
		case MODE.WALLS:
			if(Math.abs(this.x % 20 - 10) > Math.abs(this.y % 20 - 10)) {
				vWalls[Math.round(this.x / 20)][Math.floor(this.y / 20)] = !vWalls[Math.round(this.x / 20)][Math.floor(this.y / 20)];
				this.fill = vWalls[Math.round(this.x / 20)][Math.floor(this.y / 20)];
			} else {
				hWalls[Math.floor(this.x / 20)][Math.round(this.y / 20)] = !hWalls[Math.floor(this.x / 20)][Math.round(this.y / 20)];
				this.fill = hWalls[Math.floor(this.x / 20)][Math.round(this.y / 20)];
			}
			break;
	}
}

Mouse.prototype.up = function() {
	this.click = false;
}

var mouse = new Mouse();

//DRAW
setInterval(draw, 20);
function draw() {
	ctx.fillStyle = "#888";
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	
	if (finished) {
		ctx.drawImage(crosshatchImg, 0, 0, WIDTH, HEIGHT);
		
		mask.fillStyle = "white";
		mask.fillRect(0, 0, WIDTH, HEIGHT);
		
		mask.globalCompositeOperation = 'destination-out';
		
		mask.filter = "blur(3px)";
		for (x = 0; x < grid.length; ++x) {
			for (y = 0; y < grid[0].length; ++y) {
				if (grid[x][y]) {
					mask.beginPath();
					mask.moveTo(x * 20 - 20, y * 20);
					mask.arcTo(x * 20 - 20, y * 20 - 20, x * 20, y * 20 - 20, 20);
					mask.lineTo(x * 20 + 20, y * 20 - 20);
					mask.arcTo(x * 20 + 40, y * 20 - 20, x * 20 + 40, y * 20, 20);
					mask.lineTo(x * 20 + 40, y * 20 + 20);
					mask.arcTo(x * 20 + 40, y * 20 + 40, x * 20 + 20, y * 20 + 40, 20);
					mask.lineTo(x * 20, y * 20 + 40);
					mask.arcTo(x * 20 - 20, y * 20 + 40, x * 20 -20, y * 20 + 20, 20);
					mask.lineTo(x * 20 - 20, y * 20);
					mask.fill();
				}
			}
		}
		mask.filter = "none";
		
		ctx.drawImage(maskCanvas, 0, 0);
		
		mask.globalCompositeOperation = 'source-over';
	}
	
	if (dots && !finished) {
		ctx.fillStyle = "black";
		for(x = 1; x < WIDTH / 20; ++x) {
			for(y = 1; y < HEIGHT / 20; ++y) {
				ctx.beginPath();
				ctx.arc(x * 20, y * 20, 1, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	}
	
	//Draw grid squares
	ctx.fillStyle = "white";
	ctx.strokeStyle = "rgba(0,0,0,0.25)";
	ctx.lineWidth = 1;
	for (x = 0; x < grid.length; ++x) {
		for (y = 0; y < grid[0].length; ++y) {
			if (grid[x][y]) {
				ctx.fillRect(x * 20, y * 20, 20, 20);
				
				ctx.beginPath();
				ctx.moveTo(x * 20 + 4, y * 20);
				ctx.lineTo(x * 20 + 16, y * 20);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(x * 20 + 4, y * 20 + 20);
				ctx.lineTo(x * 20 + 16, y * 20 + 20);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(x * 20, y * 20 + 4);
				ctx.lineTo(x * 20, y * 20 + 16);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(x * 20 + 20, y * 20 + 4);
				ctx.lineTo(x * 20 + 20, y * 20 + 16);
				ctx.stroke();
			}
		}
	}
	
	//Draw walls
	ctx.strokeStyle = "black";
	ctx.lineWidth = 4;
	for (x = 0; x < vWalls.length; ++x) {
		for (y = 0; y < vWalls[0].length; ++y) {
			if (vWalls[x][y]) {
				ctx.beginPath();
				ctx.moveTo(x * 20, y * 20 - 2);
				ctx.lineTo(x * 20, y * 20 + 22);
				ctx.stroke();
			}
		}
	}
	for (x = 0; x < hWalls.length; ++x) {
		for (y = 0; y < hWalls[0].length; ++y) {
			if (hWalls[x][y]) {
				ctx.beginPath();
				ctx.moveTo(x * 20 - 2, y * 20);
				ctx.lineTo(x * 20 + 22, y * 20);
				ctx.stroke();
			}
		}
	}
}

//Input
document.onmousemove = function(e) {
    e = window.event || e;
	
	if (mouse.hover) mouse.move(e);
}

document.onmousedown = function(e) {
    e = window.event || e;
	
	if (mouse.hover && !finished) mouse.down();
}

document.onmouseup = function(e) {
    e = window.event || e;
	
	mouse.up();
}


document.onkeydown = function(e) {
    e = window.event || e;
    var key = e.keyCode;
    if (mouse.hover) e.preventDefault();
	
	//Left
	if (key == 37) {
		for (y = 0; y < grid[0].length; ++y) {
			var temp = grid[0][y];
			for (x = 0; x < grid.length - 1; ++x) {
				grid[x][y] = grid[x+1][y];
			}
			grid[grid.length - 1][y] = temp;
		}
		
		for (y = 0; y < vWalls[0].length; ++y) {
			var temp = vWalls[0][y];
			for (x = 0; x < vWalls.length - 1; ++x) {
				vWalls[x][y] = vWalls[x+1][y];
			}
			vWalls[vWalls.length - 1][y] = temp;
		}
		
		for (y = 0; y < hWalls[0].length; ++y) {
			var temp = hWalls[0][y];
			for (x = 0; x < hWalls.length - 1; ++x) {
				hWalls[x][y] = hWalls[x+1][y];
			}
			hWalls[hWalls.length - 1][y] = temp;
		}
	}
	
	//Right
	if (key == 39) {
		for (y = 0; y < grid[0].length; ++y) {
			var temp = grid[grid.length - 1][y];
			for (x = grid.length - 1; x > 0; --x) {
				grid[x][y] = grid[x-1][y];
			}
			grid[0][y] = temp;
		}
		
		for (y = 0; y < vWalls[0].length; ++y) {
			var temp = vWalls[vWalls.length - 1][y];
			for (x = vWalls.length - 1; x > 0; --x) {
				vWalls[x][y] = vWalls[x-1][y];
			}
			vWalls[0][y] = temp;
		}
		
		for (y = 0; y < hWalls[0].length; ++y) {
			var temp = hWalls[hWalls.length - 1][y];
			for (x = hWalls.length - 1; x > 0; --x) {
				hWalls[x][y] = hWalls[x-1][y];
			}
			hWalls[0][y] = temp;
		}
	}
	
	//Up
	if (key == 38) {
		for (x = 0; x < grid[0].length; ++x) {
			var temp = grid[x][0];
			for (y = 0; y < grid.length - 1; ++y) {
				grid[x][y] = grid[x][y+1];
			}
			grid[x][grid[0].length - 1] = temp;
		}
		
		for (x = 0; x < vWalls[0].length; ++x) {
			var temp = vWalls[x][0];
			for (y = 0; y < vWalls.length - 1; ++y) {
				vWalls[x][y] = vWalls[x][y+1];
			}
			vWalls[x][vWalls[0].length - 1] = temp;
		}
		
		for (x = 0; x < hWalls[0].length; ++x) {
			var temp = hWalls[x][0];
			for (y = 0; y < hWalls.length - 1; ++y) {
				hWalls[x][y] = hWalls[x][y+1];
			}
			hWalls[x][hWalls[0].length - 1] = temp;
		}
	}
	
	//Down
	if (key == 40) {
		for (x = 0; x < grid[0].length; ++x) {
			var temp = grid[x][grid[0].length - 1];
			for (y = grid[0].length - 1; y > 0; --y) {
				grid[x][y] = grid[x][y-1];
			}
			grid[x][0] = temp;
		}
		
		for (x = 0; x < vWalls[0].length; ++x) {
			var temp = vWalls[x][vWalls[0].length - 1];
			for (y = vWalls[0].length - 1; y > 0; --y) {
				vWalls[x][y] = vWalls[x][y-1];
			}
			vWalls[x][0] = temp;
		}
		
		for (x = 0; x < hWalls[0].length; ++x) {
			var temp = hWalls[x][hWalls[0].length - 1];
			for (y = hWalls[0].length - 1; y > 0; --y) {
				hWalls[x][y] = hWalls[x][y-1];
			}
			hWalls[x][0] = temp;
		}
	}
}