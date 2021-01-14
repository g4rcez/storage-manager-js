import type { TypeStorage } from "../types";
import { isNil, map } from "../utils";

const LocalStorage: TypeStorage = {
	has: (key: string) => {
		const item = window.localStorage.getItem(key);
		return !isNil(item);
	},
	json: <T>() => (window.localStorage as unknown) as T,
	deleteAll: () => {
		map(window.localStorage, LocalStorage.delete);
	},
	get: <T>(key: string) => {
		const str = window.localStorage.getItem(key);
		try {
			return JSON.parse(str as never) as T;
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
