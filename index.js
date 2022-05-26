const { World, Engine, Runner, Render, Bodies } = Matter;

// Setting our width and height Variable
const width = 600;
const height = 600;

// Making our Grid Array Values dynamic
const cells = 3;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		wireframes: false,
		width,
		height,
	},
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Creating Rectangular Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
	Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
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
		// [row - 1, column, "up"], //Neighbour cell at the top
		// [row + 1, column, "down"], //Neighbour cell at the bottom
		// [row, column + 1, "right"], //Neighbour cell at the right
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
		}
	}
};

stepThroughCell(1, 1);
