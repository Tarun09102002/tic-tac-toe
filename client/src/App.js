import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import "./App.css";
import {
	StartUp,
	Login,
	Register,
	Games,
	CreateGame,
	MainGame,
} from "./pages/index";
import { createContext, useEffect } from "react";
const io = require("socket.io-client");
const socket = io(`${process.env.REACT_APP_SERVER_URL}`);
export const SocketContext = createContext();

function App() {
	useEffect(() => {
		socket.on("connect", () => {
			console.log("connected");
		});
	}, []);

	return (
		<SocketContext.Provider value={socket}>
			<div className="min-h-screen w-full flex flex-row justify-center items-center bg-button ">
				<div className="min-h-full bg-[#FFFFFF] w-[360px] h-[720px] overflow-auto scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500 scrollbar-track-rou scrollbar-thumb-rounded-full">
					<Routes>
						<Route
							element={ProtectedRoutes(
								!sessionStorage.getItem("token") && true,
								"/games"
							)}
						>
							<Route path="/" element={<StartUp />} />
						</Route>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route
							element={ProtectedRoutes(
								sessionStorage.getItem("token") && true,
								"/"
							)}
						>
							<Route path="/games" element={<Games />} />
							<Route path="/create-game" element={<CreateGame />} />
							<Route path="/game/:roomid" element={<MainGame />} />
						</Route>
					</Routes>
				</div>
			</div>
		</SocketContext.Provider>
	);
}

const ProtectedRoutes = (auth, path) => {
	return auth ? <Outlet /> : <Navigate to={`${path}`} />;
};

export default App;
