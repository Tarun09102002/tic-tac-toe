import React from "react";
import { useNavigate } from "react-router-dom";

function Button({ handler, text }) {
	const navigate = useNavigate();
	return (
		<div
			onClick={handler}
			className="w-[320px] text-white cursor-pointer mb-8 rounded-md drop-shadow-lg bg-button h-[56px] flex justify-center items-center"
		>
			{text}
		</div>
	);
}

export default Button;
