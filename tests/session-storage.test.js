const { SessionStorage } = require("../build");

describe("Session Storage Tests", () => {
	beforeEach(() => SessionStorage.deleteAll());

	it("Has token", () => {
		expect(SessionStorage.has("token")).toBe(false);
	});

	it("Set Token, test and delete token", () => {
		expect(SessionStorage.has("token")).toBe(false);
		SessionStorage.set("token", "token");
		expect(SessionStorage.get("token")).toBe("token");
		SessionStorage.delete("token");
		expect(SessionStorage.has("token")).toBe(false);
	});
});
