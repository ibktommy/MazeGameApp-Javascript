const { World, Engine, Runner, Render, Bodies } = Matter;

// Setting our width and height Variable
const width = 600;
const height = 600;

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
const grid = Array(3)
	.fill(null)
	.map(() => Array(3).fill(false));

// Generate Vertical Columns
const vertical = Array(3)
	.fill(null)
	.map(() => Array(2).fill(false));

// Generate Horizontal Columns
const horizontal = Array(2)
	.fill(null)
	.map(() => Array(3).fill(false));

console.log(vertical, horizontal);
