import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "jsdom",

	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",

	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
		"^.+\\.(js|jsx)$": "babel-jest",
	},

	moduleNameMapper: {
		"\\.(css|scss|sass|less)$": "identity-obj-proxy",
	},

	transformIgnorePatterns: [
		"/node_modules/",
		"\\.pnp\\.[^\\/]+$",
	],

	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

export default config;
