import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocalStorage, SessionStorage } from "../src";

const createStorageTest = (storage: typeof SessionStorage | typeof LocalStorage) => {
	beforeEach(() => storage.deleteAll());

	it("Has token", () => {
		expect(storage.has("token")).toBe(false);
	});

	it("Set Token, test and delete token", () => {
		expect(storage.has("token")).toBe(false);
		storage.set("token", "token");
		expect(storage.get("token")).toBe("token");
		storage.delete("token");
		expect(storage.has("token")).toBe(false);
	});

	it("Listeners", () => {
		const fns = {
			listener: () => {},
		};
		const fn = vi.spyOn(fns, "listener");
		storage.listener(fn);
		storage.set("ok", true);
		expect(fn).toBeCalledTimes(1);
	});
};

describe("Session Storage Tests", () => createStorageTest(SessionStorage));

describe("Local Storage Tests", () => createStorageTest(LocalStorage));
