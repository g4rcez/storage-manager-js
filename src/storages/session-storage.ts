import type { TypeStorage } from "../types";
import { map } from "../utils";

const SessionStorage: TypeStorage = {
	has: (key: string) => {
		return window.sessionStorage.getItem(key) !== undefined;
	},
	json: <T>() => {
		return (window.sessionStorage as unknown) as T;
	},
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
	delete: (key: string) => {
		window.sessionStorage.removeItem(key);
	},
	set: (key: string, object: any) => {
		window.sessionStorage.setItem(key, JSON.stringify(object));
	},
};

export default SessionStorage;
