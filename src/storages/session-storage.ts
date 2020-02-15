import { IStorage } from "../types";
import { map } from "../utils";

export default class SessionStorage implements IStorage {
	public static has(key: string) {
		return window.sessionStorage.getItem(key) !== undefined;
	}
	public static json() {
		return window.sessionStorage;
	}

	public static deleteAll() {
		map(window.sessionStorage, this.delete);
	}

	public static get(key: string) {
		const str = window.sessionStorage.getItem(key) || "";
		try {
			return JSON.parse(str);
		} catch (error) {
			return str;
		}
	}

	public static delete(key: string) {
		window.sessionStorage.removeItem(key);
	}

	public static set(key: string, object: any) {
		window.sessionStorage.setItem(key, JSON.stringify(object));
	}

	public has(key: string) {
		return SessionStorage.has(key);
	}

	public json() {
		return window.sessionStorage;
	}

	public deleteAll() {
		map(window.sessionStorage, SessionStorage.delete);
		return this;
	}

	public get(key: string) {
		return SessionStorage.get(key);
	}
	public delete(key: string): IStorage {
		SessionStorage.delete(key);
		return this;
	}
	public set(key: string, object: any): IStorage {
		SessionStorage.set(key, JSON.stringify(object));
		return this;
	}
}
