import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../components/index";
import { useNavigate } from "react-router-dom";

function Games() {
	const [games, setGames] = useState([]);
	const navigate = useNavigate();
	const fetchGames = async () => {
		const res = await axios.get(
			`${process.env.REACT_APP_SERVER_URL}/games/${sessionStorage.getItem(
				"token"
			)}`
		);
		setGames(res.data.games.reverse());
	};

	useEffect(() => {
		fetchGames();
	}, []);

	useEffect(() => {
		console.log(games);
	}, [games]);

	return (
		<div className="flex flex-col h-full p-2 justify-between">
			<div>
				<div className="text-2xl font-sans font-semibold ">Your Games</div>
				<div className="flex flex-col mt-4 items-center">
					{games.length > 0 ? (
						games.map((game) => {
							return (
								<div className="w-[328px] flex flex-col justify-between shadow-4xl pt-4 rounded-lg mb-5">
									<div className="flex flex-col ml-4">
										<div className="font-sans font-semibold text-[24px]">
											Game with {game.opponent.name}
										</div>
										<div className="font-sans text-[14px]">
											{game.completed ? (
												game.winner === 1 ? (
													"You Won!"
												) : game.winner === 2 ? (
													"You Lost!"
												) : (
													"Its a Draw!"
												)
											) : game.turn ? (
												<div>
													<div>{game.opponent.name} made their move!</div>
													<div>Its your Move!</div>
												</div>
											) : (
												<div>
													<div>You made your move</div>
													<div>Its {game.opponent.name}'s Move!</div>
												</div>
											)}
										</div>
									</div>
									<div className="mt-4 flex justify-center">
										<div
											onClick={() => navigate(`/game/${game.id}`)}
											className="w-[296px] text-white cursor-pointer mb-8 rounded-md drop-shadow-lg bg-button h-[56px] flex justify-center items-center"
										>
											{game.turn ? "Play!" : "View Game"}
										</div>
									</div>
								</div>
							);
						})
					) : (
						<div className="font-title text-4xl mt-40 font-semibold italic">
							No games found
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-row justify-end">
				<div
					className="bg-black px-2 py-3 text-sm rounded-md text-white w-[110px] absolute bottom-0 -translate-y-14 cursor-pointer"
					onClick={() => navigate("/create-game")}
				>
					+ New Game
				</div>
			</div>
		</div>
	);
}

export default Games;
