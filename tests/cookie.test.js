const { Cookie } = require("../build");

describe("Cookies test", () => {
	it("Get nothing", () => {
		expect(Cookie.get("token")).toBe(null);
	});

	it("Set Token as string", () => {
		const token = "Hack the planet";
		Cookie.set("token", token, { useSecure: false });
		expect(Cookie.get("token")).toBe(token);
	});

	it("Set Token as object", () => {
		const token = { a: { b: { c: { d: 1 } } } };
		Cookie.set("token", token, { useSecure: false });
		expect(Cookie.get("token")).toEqual(token);
	});

	it("useSecure on unsafe env", () => {
		const token = { a: { b: { c: { d: 1 } } } };
		Cookie.set("token", token, { useSecure: true });
		expect(Cookie.get("token")).toEqual(null);
	});
});
