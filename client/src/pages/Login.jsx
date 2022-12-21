import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Input, Button } from "../components/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (!userName || !password) return setError("Please fill all the fields");
		setError("");
		const res = await axios
			.post(`${process.env.REACT_APP_SERVER_URL}/login`, {
				userName,
				password,
			})
			.then((res) => {
				sessionStorage.setItem("token", res.data.token);
				navigate("/games");
			})
			.catch((err) => {
				console.log(err.response.data);
				setError(err.response.data.msg);
			});
	};

	return (
		<div className="font-sans font-bold flex flex-col justify-between h-full pt-4 pl-4">
			<div>
				<div className="mb-10" onClick={() => navigate(-1)}>
					<ChevronLeftIcon height={36} />
				</div>
				<div>
					<div className="text-[14px]">Login</div>
					<div className="text-[28px] w-[255px]">Please enter your details</div>
				</div>
				<div className="mt-10">
					<Input
						placeholder={"Username"}
						value={userName}
						setValue={setUserName}
					/>
					<Input
						placeholder="Password"
						value={password}
						setValue={setPassword}
					/>
				</div>
				<div className="text-red-600 text-md">{error}</div>
			</div>
			<div>
				<Button text={"Login"} handler={handleSubmit}></Button>
			</div>
		</div>
	);
}

export default Login;
