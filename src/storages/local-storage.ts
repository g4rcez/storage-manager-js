import { IStorage } from "../types";
import { map } from "../utils";
export default class LocalStorage implements IStorage {
	public has(key: string) {
		return window.localStorage.getItem(key) !== undefined;
	}
	public json() {
		return window.localStorage;
	}
	public deleteAll(): IStorage {
		map(window.localStorage, this.delete);
		return this;
	}
	public get(key: string) {
		const str: string = window.localStorage.getItem(key) || "";
		try {
			return JSON.parse(str);
		} catch (error) {
			return str;
		}
	}
	public delete(key: string): IStorage {
		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			window.localStorage.removeItem("");
		}
		return this;
	}
	public set(key: string, object: any): IStorage {
		window.localStorage.setItem(key, JSON.stringify(object));
		return this;
	}
}
