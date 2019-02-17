import { IStorage } from "./../types";
import { map } from "../utils";
export default class LocalStorage implements IStorage {
	parser() {
		return window.localStorage;
	}
	clear(): IStorage {
		map(window.localStorage, this.unset);
		return this;
	}
	get(key: string) {
		const string: string = window.localStorage.getItem(key) || "";
		try {
			return JSON.parse(string);
		} catch (error) {
			return string;
		}
	}
	unset(key: string): IStorage {
		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			window.localStorage.removeItem("");
		}
		return this;
	}
	set(key: string, object: any): IStorage {
		window.localStorage.setItem(key, JSON.stringify(object));
		return this;
	}
}
