const { defaults } = require("jest-config");
module.exports = {
	// resolver: "browser-resolve",
	moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
};
