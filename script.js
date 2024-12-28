const width = 32
const height = 16;
const cellSize = 10;
const canvas = document.getElementById("canvas");
const start = document.getElementById("start");

let field = Array(width * height);

function init() {
	for (let i = 0; i < height; i+= 1) {
		for (let j = 0; j < width; j+= 1) {
			field[i * width + j] = j % 2;
		}
	}	
	canvas.addEventListener("click", function(e) {
		let x = Math.floor(event.clientX / cellSize) - 1;
		let y = Math.floor(event.clientY / cellSize) - 1;
		let v = field[y * width + x];
		field[y * width + x] = (v == 1) ? 0 : 1;
		draw();
	});
	start.addEventListener("click", function(e) {
		setInterval(tick, 1000);
	});	
}

function draw() {
	if (canvas.getContext) {
		const ctx = canvas.getContext("2d");
	  	ctx.lineWidth = 1;

		for (let i = 0; i < height; i+= 1) {
			for (let j = 0; j < width; j+= 1) {
				if (field[i * width + j] == 1) {
					ctx.fillStyle = "blue";
				} else {
					ctx.fillStyle = "grey";
				}
				ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
			}
		}
	}
}

function get(y, x) {
	if (y < 0) return 0;
	if (y >= height) return 0
	if (x < 0) return 0;
	if (x >= width) return 0
	return field[y * width + x];	
}

function neigboursCount(y, x) {
	return  get(y - 1, x - 1) + get(y - 1, x) + get(y - 1, x + 1) +
			get(y, x - 1) + get(y, x + 1) +
			get(y + 1, x - 1) + get(y + 1, x) + get(y + 1, x + 1);
}

function cellFunc(y, x) {
	let neigbours = neigboursCount(y, x);
	if (neigbours < 2) return 0;
	if (neigbours > 3) return 0;
	let currentState = get(y, x);
	if (currentState == 0) {
		if (neigbours == 3) return 1;
		return 0;
	}
	return currentState;
}

function tick() {
	let newField = Array(width * height);
	for (let i = 0; i < height; i+= 1) {
		for (let j = 0; j < width; j+= 1) {
			newField[i * width + j] = cellFunc(i, j);
		}
	}
	field = newField;	
	draw();
}

init();
draw();
