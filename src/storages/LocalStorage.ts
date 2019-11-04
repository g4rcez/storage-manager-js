import { IStorage } from "../types";
import { map } from "../utils";
export default class LocalStorage implements IStorage {
	public parser() {
		return window.localStorage;
	}
	public clear(): IStorage {
		map(window.localStorage, this.unset);
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
	public unset(key: string): IStorage {
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
