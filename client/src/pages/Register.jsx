import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Input, Button } from "../components/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (!name || !email || !userName || !password)
			return setError("Please fill all the fields");
		setError("");
		const res = await axios
			.post(`${process.env.REACT_APP_SERVER_URL}/register`, {
				name,
				email,
				userName,
				password,
			})
			.then((res) => {
				navigate("/login");
			})
			.catch((err) => {
				console.log(err.response.data);
				setError(err.response.data.msg);
			});
		console.log(name, email, userName, password);
	};

	return (
		<div className="font-sans font-bold flex flex-col justify-between h-full pt-4 pl-4">
			<div>
				<div className="mb-4" onClick={() => navigate(-1)}>
					<ChevronLeftIcon height={36} />
				</div>
				<div>
					<div className="text-[14px]">Create Account</div>
					<div className="text-[28px] w-[255px]">
						Let's get to know you better!
					</div>
				</div>
				<div className="mt-10">
					<Input placeholder="Name" value={name} setValue={setName} />
					<Input
						placeholder={"Username"}
						value={userName}
						setValue={setUserName}
					/>
					<Input placeholder="Email" value={email} setValue={setEmail} />
					<Input
						placeholder="Password"
						value={password}
						setValue={setPassword}
					/>
					<div className="text-red-600 text-md">{error}</div>
				</div>
			</div>
			<div className="">
				<Button text={"Register"} handler={handleSubmit}></Button>
			</div>
		</div>
	);
}

export default Register;
