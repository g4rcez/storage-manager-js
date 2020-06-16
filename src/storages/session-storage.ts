import type { TypeStorage } from "../types";
import { map } from "../utils";

const SessionStorage: TypeStorage = {
	has: (key: string) => window.sessionStorage.getItem(key) !== undefined,
	json: <T>() => (window.sessionStorage as unknown) as T,
	deleteAll: () => {
		map(window.sessionStorage, SessionStorage.delete);
	},
	get: <T>(key: string) => {
		const str = window.sessionStorage.getItem(key) || "";
		try {
			return JSON.parse(str) as T;
		} catch (error) {
			return str;
		}
	},
	delete: (key) => {
		window.sessionStorage.removeItem(key);
	},
	set: (key, object) => {
		window.sessionStorage.setItem(key, JSON.stringify(object));
	},
};

export default SessionStorage;
