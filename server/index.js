const express = require("express");
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user-model");
const Game = require("./models/game-model");
const PORT = process.env.PORT || 3001;
const jwt = require("jsonwebtoken");
const { populate } = require("./models/game-model");
const { Server } = require("socket.io");
const http = require("http").createServer(app);

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	});

// const io = new Server(8008, {
// 	cors: {
// 		origin: "*",
// 		credentials: true,
// 	},
// });

const io = require("socket.io")(http, {
	cors: {
		origin: "*",
		credentials: true,
	},
});

io.on("connection", (socket) => {
	socket.on("join-room", ({ roomid, token }) => {
		console.log(roomid);
		socket.join(roomid);
		const { id } = jwt.verify(token, process.env.JWT_SECRET);
		io.to(roomid).emit("message", "Hello World");
	});
	socket.on("get-game-details", async ({ roomid, token }) => {
		const game = await Game.findById(roomid)
			.populate("player1")
			.populate("player2");
		const { id } = jwt.verify(token, process.env.JWT_SECRET);
		// const gameDetails = {
		// 	id: game.id,
		// 	gameState: game.gameState,
		// 	turn:
		// 		game.turn === 0
		// 			? game.player1.id === id
		// 				? true
		// 				: false
		// 			: game.player2.id === id
		// 			? true
		// 			: false,
		// 	winner:
		// 		game.winner === 0
		// 			? 0
		// 			: game.winner === 3
		// 			? 3
		// 			: game.winner === 1
		// 			? game.player1.id === id
		// 				? 1
		// 				: 2
		// 			: game.player2.id === id
		// 			? 1
		// 			: 2,
		// 	completed: game.completed,
		// 	started: game.started,
		// 	you: game.player1.id === id ? game.player1 : game.player2,
		// 	opponent: game.player1.id === id ? game.player2 : game.player1,
		// 	player1: game.player1.id === id ? true : false,
		// };
		io.to(roomid).emit("game-details", game);
	});

	socket.on("move", async ({ roomid, token, i, j }) => {
		const { id } = jwt.verify(token, process.env.JWT_SECRET);
		console.log(roomid + " " + id + " " + i + " " + j);
		let game = await Game.findById(roomid)
			.populate("player1")
			.populate("player2");
		const state = game.gameState;
		state[i][j] = game.player1.id === id ? 1 : 0;
		const val = hasWon(state);
		let winner = game.winner;
		let completed = game.completed;
		if (val !== -1) {
			if (val === 0) {
				winner = 2;
			} else if (val === 1) {
				winner = 1;
			} else {
				winner = 3;
			}
			completed = true;
			console.log("winner is " + winner);
		}

		const turn = game.turn === 0 ? 1 : 0;
		await Game.findByIdAndUpdate(roomid, {
			gameState: state,
			turn: turn,
			winner: winner,
			completed: completed,
		});
		game = await Game.findById(roomid).populate("player1").populate("player2");
		io.to(roomid).emit("game-details", game);
	});
});

const hasWon = (state) => {
	for (let i = 0; i < 3; i++) {
		if (
			state[i][0] === state[i][1] &&
			state[i][1] === state[i][2] &&
			state[i][0] !== -1
		) {
			return state[i][0];
		}
		if (
			state[0][i] === state[1][i] &&
			state[1][i] === state[2][i] &&
			state[0][i] !== -1
		) {
			return state[0][i];
		}
	}
	if (
		state[0][0] === state[1][1] &&
		state[1][1] === state[2][2] &&
		state[0][0] !== -1
	) {
		return state[0][0];
	}
	if (
		state[0][2] === state[1][1] &&
		state[1][1] === state[2][0] &&
		state[0][2] !== -1
	) {
		return state[0][2];
	}
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (state[i][j] === -1) {
				return -1;
			}
		}
	}
	return 2;
};

app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.get("/player/:token", (req, res) => {
	const { token } = req.params;
	const { id } = jwt.verify(token, process.env.JWT_SECRET);
	res.status(200).json({ id });
});

app.post("/create-game", async (req, res) => {
	const { token, email } = req.body;
	const { id } = jwt.verify(token, process.env.JWT_SECRET);
	console.log(id, email);
	const user1 = await User.findById(id);
	const user2 = await User.findOne({ email });
	if (!user2) return res.status(400).json({ msg: "User not found" });
	const game = new Game({
		player1: id,
		player2: user2.id,
	});
	await game.save();
	await User.findByIdAndUpdate(id, { $push: { games: game.id } });
	await User.findOneAndUpdate({ email }, { $push: { games: game.id } });
	res.status(200).json({ msg: "Game created", roomid: game.id });
});

app.get("/games/:token", async (req, res) => {
	const { token } = req.params;
	const { id } = jwt.verify(token, process.env.JWT_SECRET);
	let user = await User.findById(id).populate([
		{
			path: "games",
			populate: {
				path: "player1",
			},
		},
		{
			path: "games",
			populate: {
				path: "player2",
			},
		},
	]);
	const games = user.games.map((game) => {
		return {
			id: game.id,
			gameState: game.gameState,
			turn:
				game.turn === 0
					? game.player1.id === id
						? true
						: false
					: game.player2.id === id
					? true
					: false,
			winner:
				game.winner === 0
					? 0
					: game.winner === 3
					? 3
					: game.winner === 1
					? game.player1.id === id
						? 1
						: 2
					: game.player2.id === id
					? 1
					: 2,
			completed: game.completed,
			started: game.started,
			you: game.player1.id === id ? game.player1 : game.player2,
			opponent: game.player1.id === id ? game.player2 : game.player1,
		};
	});
	res.send({ games: games });
});

app.post("/login", async (req, res) => {
	const { userName, password } = req.body;
	console.log(userName, password);
	const user = await User.findOne({ username: userName, password });
	console.log(user);
	if (user) {
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
		return res.status(200).json({ msg: "Login Successful", token });
	} else {
		return res.status(400).json({ msg: "Login Failed" });
	}
});

app.post("/register", async (req, res) => {
	const { name, email, userName, password } = req.body;
	console.log(name, email, userName, password);
	const user = await User.findOne({ email });
	if (user) {
		return res.status(400).json({ msg: "User already exists" });
	}

	const newUser = new User({
		name,
		email,
		username: userName,
		password,
	});
	newUser.save();
	return res.status(200).json({ msg: "User created" });
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

http.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
