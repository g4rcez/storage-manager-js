const { Cookie } = require("../build");

test("Get nothing", () => {
	expect(Cookie.get("token")).toBe(undefined);
});

test("Set Token as string", () => {
	const token = "Hack the planet";
	Cookie.set("token", token, { useSecure: false });
	expect(Cookie.get("token")).toBe(token);
});

test("Set Token as object", () => {
	const token = { a: { b: { c: { d: 1 } } } };
	Cookie.set("token", token, { useSecure: false });
	expect(Cookie.get("token")).toEqual(token);
});

test("useSecure on unsafe env", () => {
	const token = { a: { b: { c: { d: 1 } } } };
	Cookie.set("token", token, { useSecure: true });
	expect(Cookie.get("token")).toEqual(undefined);
});

