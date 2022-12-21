const mongoose = require("mongoose");
const User = require("./user-model");
const { Schema } = mongoose;

const gameSchema = new Schema({
	player1: { type: Schema.Types.ObjectId, ref: "User" },
	player2: { type: Schema.Types.ObjectId, ref: "User" },
	winner: { type: Number, default: 0 },
	gameState: {
		type: Array,
		default: [
			[-1, -1, -1],
			[-1, -1, -1],
			[-1, -1, -1],
		],
	},
	turn: { type: Number, default: 0 },
	completed: { type: Boolean, default: false },
	started: { type: Boolean, default: false },
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
