import { TypeStorage } from "../types";
import { map } from "../utils";

const LocalStorage: TypeStorage = {
	has(key: string) {
		return window.localStorage.getItem(key) !== undefined;
	},
	json: <T>() => {
		return (window.localStorage as unknown) as T;
	},
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
	delete: (key: string) => {
		window.localStorage.removeItem(key);
	},
	set: (key: string, object: any) => {
		window.localStorage.setItem(key, JSON.stringify(object));
	},
};

export default LocalStorage;
