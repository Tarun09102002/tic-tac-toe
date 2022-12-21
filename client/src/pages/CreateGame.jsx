import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Input, Button } from "../components/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateGame() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const createGame = async () => {
		const res = await axios
			.post(`${process.env.REACT_APP_SERVER_URL}/create-game`, {
				token: sessionStorage.getItem("token"),
				email,
			})
			.then((res) => {
				console.log(res.data);
				navigate(`/game/${res.data.roomid}`);
				setError("");
			})
			.catch((err) => {
				setError(err.response.data.msg);
			});
	};

	return (
		<div className="flex flex-col font-bold h-full justify-between p-4">
			<div>
				<div className="mb-10" onClick={() => navigate(-1)}>
					<ChevronLeftIcon height={36} />
				</div>
				<div>
					<div className="text-[14px]">Start a new game</div>
					<div className="text-[28px] w-[255px]">Please enter your details</div>
				</div>
				<div className="mt-10">
					<Input placeholder={"Email"} value={email} setValue={setEmail} />
					<div className="text-red-600 text-md">{error}</div>
				</div>
			</div>
			<Button
				text={"Create Game"}
				handler={() => {
					createGame();
				}}
			></Button>
		</div>
	);
}

export default CreateGame;
