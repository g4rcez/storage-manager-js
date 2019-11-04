import { IStorage } from "../types";
import { map } from "../utils";

export default class SessionStorage implements IStorage {
	public parser() {
		return window.sessionStorage;
	}
	public clear(): IStorage {
		map(window.sessionStorage, this.unset);
		return this;
	}
	public get(key: string) {
		const str = window.sessionStorage.getItem(key) || "";
		try {
			return JSON.parse(str);
		} catch (error) {
			return str;
		}
	}
	public unset(key: string): IStorage {
		try {
			window.sessionStorage.removeItem(key);
		} catch (error) {
			window.sessionStorage.removeItem("");
		}
		return this;
	}
	public set(key: string, object: any): IStorage {
		window.sessionStorage.setItem(key, JSON.stringify(object));
		return this;
	}
}
