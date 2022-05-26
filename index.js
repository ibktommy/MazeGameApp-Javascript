const { World, Engine, Runner, Render, Bodies, Body, Events } = Matter;

// Setting our width and height Variable
const width = window.innerWidth;
const height = window.innerHeight;

// Setting the Height And Width of Our Grid Cell
const cellsHorizontal = 4;
const cellsVertical = 3;

// Calculating the lenght of our wall lines
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		wireframes: true,
		width,
		height,
	},
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Creating Rectangular Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
	Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];

World.add(world, walls);

// Generating the Maze
const grid = Array(cells)
	.fill(null)
	.map(() => Array(cells).fill(false));

// Generate Vertical Columns
const vertical = Array(cells)
	.fill(null)
	.map(() => Array(cells - 1).fill(false));

// Generate Horizontal Columns
const horizontal = Array(cells - 1)
	.fill(null)
	.map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

// Function to randomize elements in an Array
const shuffleArray = (arr) => {
	let counter = arr.length;

	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);

		counter--;

		const tempValue = arr[counter];
		arr[counter] = arr[index];
		arr[index] = tempValue;
	}

	return arr;
};

const stepThroughCell = (row, column) => {
	// If the cell as been visited at [row, column], then return
	if (grid[row][column]) {
		return;
	}

	// Mark the cell as being visited
	grid[row][column] = true;

	// Assemble randomly-ordered list of Neighbours
	const cellNeighbours = shuffleArray([
		[row - 1, column, "up"], //Neighbour cell at the top
		[row + 1, column, "down"], //Neighbour cell at the bottom
		[row, column + 1, "right"], //Neighbour cell at the right
		[row, column - 1, "left"], //Neighbour cell at the left
	]);

	// For Each Neighbours..
	// We iterate
	for (let neighbour of cellNeighbours) {
		const [nextRow, nextColumn, direction] = neighbour;

		// See if that Neighbour is out of bounds
		if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
			continue;
		}

		// If we have visited that Neighbour, continue to next Neighbour
		if (grid[nextRow][nextColumn]) {
			continue;
		}

		// Removing A Cell Wall from either Horizontal or Vertical based on our Direction
		if (direction === "right") {
			vertical[row][column] = true;
		} else if (direction === "left") {
			vertical[row][column - 1] = true;
		} else if (direction === "up") {
			horizontal[row - 1][column] = true;
		} else if (direction === "down") {
			horizontal[row][column] = true;
		}

		stepThroughCell(nextRow, nextColumn);
	}
};

stepThroughCell(startRow, startColumn);

// Drawing Horizontal Segments
horizontal.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		const wall = Bodies.rectangle(
			columnIndex * unitLength + unitLength / 2,
			rowIndex * unitLength + unitLength,
			unitLength,
			10,
			{
				label: "wall",
				isStatic: true,
			},
		);

		World.add(world, wall);
	});
});

// Drawing Vertical Segments
vertical.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		const wall = Bodies.rectangle(
			columnIndex * unitLength + unitLength,
			rowIndex * unitLength + unitLength / 2,
			10,
			unitLength,
			{
				label: "wall",
				isStatic: true,
			},
		);

		World.add(world, wall);
	});
});

// Drawing the End Goal Object
const endGoalObject = Bodies.rectangle(
	width - unitLength / 2,
	height - unitLength / 2,
	unitLength * 0.7,
	unitLength * 0.7,
	{
		isStatic: true,
		label: "goalObject",
	},
);

World.add(world, endGoalObject);

// Drawing the Ball that will navigate through the Maze to the End-Goal Object
const Ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength / 4, {
	isStatic: false,
	label: "ball",
});
World.add(world, Ball);

document.addEventListener("keydown", (event) => {
	// Getting the Velocity of the Ball
	const { x, y } = Ball.velocity;

	if (event.code === "ArrowUp") {
		Body.setVelocity(Ball, { x, y: y - 3 });
	}
	if (event.code === "ArrowDown") {
		Body.setVelocity(Ball, { x, y: y + 3 });
	}
	if (event.code === "ArrowRight") {
		Body.setVelocity(Ball, { x: x + 3, y });
	}
	if (event.code === "ArrowLeft") {
		Body.setVelocity(Ball, { x: x - 3, y });
	}
});

// Condition For the Engine Event to Determine if the Ball Has Reached The Goal Object
Events.on(engine, "collisionStart", (event) => {
	event.pairs.forEach((collision) => {
		const labels = ["ball", "goalObject"];

		if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
			// Setting Back Gravity After The Ball Reached The Goal Object
			world.gravity.y = 1;

			// Collapsing the Vertical and Horizontal wall when the Ball Reached the Goal Object
			world.bodies.forEach((body) => {
				if (body.label === "wall") {
					Body.setStatic(body, false);
				}
			});
		}
	});
});
