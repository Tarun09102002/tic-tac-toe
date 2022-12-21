import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../App";
import { useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MainGame() {
	const socket = useContext(SocketContext);
	const [game, setGame] = useState();
	const [gameDetails, setGameDetails] = useState();
	const [gameState, setGameState] = useState([[]]);
	const [id, setId] = useState();
	const navigate = useNavigate();
	// const [turn, setTurn] = useState(null);

	const { roomid } = useParams();

	const handleClick = (i, j) => {
		if (gameDetails.turn && !gameDetails.completed && gameState[i][j] === -1) {
			socket.emit("move", {
				roomid: roomid,
				token: sessionStorage.getItem("token"),
				i: i,
				j: j,
			});
		}
	};

	useEffect(() => {
		axios
			.get(
				`${process.env.REACT_APP_SERVER_URL}/player/${sessionStorage.getItem(
					"token"
				)}`
			)
			.then((res) => {
				setId(res.data.id);
			});
		console.log(id + " 74");
		socket.emit("join-room", {
			roomid: roomid,
			token: sessionStorage.getItem("token"),
		});
		socket.emit("get-game-details", {
			roomid: roomid,
			token: sessionStorage.getItem("token"),
		});
	}, []);

	useEffect(() => {
		socket.on("game-details", (game) => {
			setGameState(game.gameState);
			setGame(game);
			console.log(game);
		});
	});

	useEffect(() => {
		console.log(id);
		console.log(83);
		if (game && id) {
			const details = {
				gameState: game.gameState,
				turn:
					game.turn === 0
						? game.player1._id === id
							? true
							: false
						: game.player2._id === id
						? true
						: false,
				winner:
					game.winner === 0
						? 0
						: game.winner === 3
						? 3
						: game.winner === 1
						? game.player1._id === id
							? 1
							: 2
						: game.player2._id === id
						? 1
						: 2,
				completed: game.completed,
				started: game.started,
				you: game.player1._id === id ? game.player1 : game.player2,
				opponent: game.player1._id === id ? game.player2 : game.player1,
				player1: game.player1._id === id ? true : false,
			};
			setGameDetails(details);
			console.log(details);
			console.log(112);
		}
	}, [game, id]);

	return (
		<div>
			{!gameDetails ? (
				<div>Loading...</div>
			) : (
				<div className="flex flex-col font-sans h-full p-4">
					<div className="mb-10 cursor-pointer" onClick={() => navigate(-1)}>
						<ChevronLeftIcon height={36} />
					</div>
					<div className="text-[28px] font-bold">
						Game with {gameDetails.opponent.name}
					</div>
					<div className="text-[14px]">Your piece</div>
					<div>
						{`${id}` === game.player1._id ? (
							<img src="/X.png" alt="" className="h-[64px]" />
						) : (
							<img src="/0.png" alt="" className="h-[64px]" />
						)}
					</div>
					<div className="flex flex-col w-[330px] bg-[#FFE79E] items-center self-center">
						<div className="py-2">
							{gameDetails.completed
								? gameDetails.winner === 3
									? "Its a Draw"
									: gameDetails.winner === 1
									? "You Won"
									: "You Lost"
								: gameDetails.turn
								? "Your Move"
								: "Their Move"}
						</div>
						<div className="flex flex-col w-full">
							{gameState.map((row, i) => {
								return (
									<div
										className="flex flex-row mt-2 justify-between w-full"
										key={i}
									>
										{row.map((col, j) => {
											return (
												<div
													className="w-[105px] h-[105px] bg-white flex justify-center items-center"
													key={j}
													onClick={() => handleClick(i, j)}
												>
													{col === -1 ? (
														""
													) : col === 1 ? (
														<img src="/X.png" alt="" className="h-[105px]" />
													) : (
														<img src="/0.png" alt="" className="h-[105px]" />
													)}
												</div>
											);
										})}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default MainGame;
