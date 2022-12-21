import React from "react";

function Input({ placeholder, value, setValue }) {
	return (
		<div className="flex flex-col mb-3">
			<div className="text-[14px] mb-2">{placeholder}</div>
			<input
				className="bg-[#f4f4f4] w-[312px] h-[56px] pl-4 rounded-md font-normal outline-none text-[14px]"
				placeholder={`Type your ${placeholder} here`}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				type={placeholder === "Password" ? "password" : "text"}
			/>
		</div>
	);
}

export default Input;
