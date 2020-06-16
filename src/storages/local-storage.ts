import type { TypeStorage } from "../types";
import { map } from "../utils";

const LocalStorage: TypeStorage = {
	has: (key: string) => window.localStorage.getItem(key) !== undefined,
	json: <T>() => (window.localStorage as unknown) as T,
	deleteAll: () => {
		map(window.localStorage, LocalStorage.delete);
	},
	get: <T>(key: string) => {
		const str = window.localStorage.getItem(key) || "";
		try {
			return JSON.parse(str) as T;
		} catch (error) {
			return str;
		}
	},
	delete: (key) => {
		window.localStorage.removeItem(key);
	},
	set: (key, object) => {
		window.localStorage.setItem(key, JSON.stringify(object));
	},
};

export default LocalStorage;
