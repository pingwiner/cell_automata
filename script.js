const width = 32
const height = 16;
const cellSize = 10;
const canvas = document.getElementById("canvas");
const startButton = document.getElementById("start");
const clearButton = document.getElementById("clear");
const randomButton = document.getElementById("random");
const algorithm = document.getElementById("algorithm");

let field = Array(width * height);
let interval = null;
let selectedAlgorithm = conways_game_of_life;
let algos = [
	conways_game_of_life, 
	function() { rule(110) },
	function() { rule(54) }
];

function getRandom() {
  return Math.floor(Math.random() * 2);
}

function clear() {
	for (let i = 0; i < height; i+= 1) {
		for (let j = 0; j < width; j+= 1) {
			field[i * width + j] = 0;
		}
	}	
}

function init() {
	canvas.addEventListener("click", function(e) {
		let x = Math.floor(event.clientX / cellSize) - 1;
		let y = Math.floor(event.clientY / cellSize) - 1;
		let v = field[y * width + x];
		field[y * width + x] = (v == 1) ? 0 : 1;
		draw();
	});
	startButton.addEventListener("click", function(e) {
		if (interval == null) {
			setAlgorithm();
			interval = setInterval(tick, 1000);
			startButton.innerText= "Stop";
		} else {
			clearInterval(interval);
			interval = null;
			startButton.innerText= "Start";
		}
	});	
	clearButton.addEventListener("click", function(e) {
		clear();
		draw();			
	});	
	randomButton.addEventListener("click", function(e) {
		for (let i = 0; i < height; i+= 1) {
			for (let j = 0; j < width; j+= 1) {
				field[i * width + j] = getRandom();
			}
		}	
		draw();
	});
	clear();
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

function tick() {
	draw();
	selectedAlgorithm();
}

function setAlgorithm() {
	let value = algorithm.value;
	index = parseInt(value);
	selectedAlgorithm = algos[index];
}

function conways_game_of_life() {
	let cellFunc = function(y, x) {
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

	let newField = Array(width * height);
	for (let i = 0; i < height; i+= 1) {
		for (let j = 0; j < width; j+= 1) {
			newField[i * width + j] = cellFunc(i, j);
		}
	}
	field = newField;		
}

function intToArray(x) {
	let result = [];
	while(result.length < 8) {
		result.push(x % 2);
		x = Math.floor(x / 2);
	}
	return result;
} 

function rule(x) {
	let values = intToArray(x);	
	let cellFunc = function(y, x) {
		if (y == 0) return get(y, x);
		let index =  get(y - 1, x - 1) * 4 +
					get(y - 1, x) * 2 +
					get(y - 1, x + 1);
		return values[index];
	}

	let newField = Array(width * height);

	for (let i = 0; i < height; i+= 1) {
		for (let j = 0; j < width; j+= 1) {
			newField[i * width + j] = cellFunc(i, j);
		}
	}
	field = newField;		
}

init();
draw();
