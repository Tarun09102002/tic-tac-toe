import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function StartUp() {
	const navigate = useNavigate();

	useEffect(() => {
		// if (sessionStorage.getItem("token")) {
		// 	navigate("/games");
		// }
	}, []);

	return (
		<div className="h-full w-full flex flex-col justify-around">
			<div className="font-title italic text-center mt-48">
				<div className="text-4xl">async</div>
				<div className="text-7xl">tic tac</div>
				<div className="text-7xl">toe</div>
			</div>
			<div className="flex flex-col text-white justify-center items-center">
				<div
					onClick={() => navigate("/login")}
					className="w-[320px] cursor-pointer mb-8 rounded-md drop-shadow-lg bg-button h-[56px] flex justify-center items-center"
				>
					Login
				</div>
				<div
					onClick={() => navigate("/register")}
					className="w-[320px] cursor-pointer bg-[#2F80ED] rounded-md drop-shadow-lg h-[56px] flex justify-center items-center"
				>
					Register
				</div>
			</div>
		</div>
	);
}

export default StartUp;
