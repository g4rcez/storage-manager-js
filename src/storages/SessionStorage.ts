import { IStorage } from "../types";
import { map } from "../utils";

export default class SessionStorage implements IStorage {
	parser() {
		return window.sessionStorage;
	}
	clear(): IStorage {
		map(window.sessionStorage, this.unset);
		return this;
	}
	get(key: string) {
		const string = window.sessionStorage.getItem(key) || "";
		try {
			return JSON.parse(string);
		} catch (error) {
			return string;
		}
	}
	unset(key: string): IStorage {
		try {
			window.sessionStorage.removeItem(key);
		} catch (error) {
			window.sessionStorage.removeItem("");
		}
		return this;
	}
	set(key: string, object: any): IStorage {
		window.sessionStorage.setItem(key, JSON.stringify(object));
		return this;
	}
}
