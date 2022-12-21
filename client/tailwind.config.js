/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				title: ["Bilbo", "cursive"],
				sans: ["Poppins", "sans-serif"],
			},
			colors: {
				button: "#F2C94C",
			},
			boxShadow: {
				"4xl": "0 15px 20px -5px rgba(0, 0, 0, 0.3)",
			},
		},
	},
	plugins: [require("tailwind-scrollbar")],
	variants: {
		scrollbar: ["rounded"],
	},
};
