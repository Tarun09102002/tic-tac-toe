const mongoose = require("mongoose");
const { Schema } = mongoose;
const Game = require("./game-model");

const userSchema = new Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	name: { type: String, required: true },
	password: { type: String, required: true },
	games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
