import { IStorage } from "../types";
import { map } from "../utils";

export default class LocalStorage implements IStorage {
	public static has(key: string) {
		return window.localStorage.getItem(key) !== undefined;
	}

	public static json<T>() {
		return (window.localStorage as unknown) as T;
	}

	public static deleteAll() {
		map(window.localStorage, this.delete);
	}

	public static get<T>(key: string) {
		const str: string = window.localStorage.getItem(key) || "";
		try {
			return JSON.parse(str) as T;
		} catch (error) {
			return str;
		}
	}

	public static delete(key: string) {
		window.localStorage.removeItem(key);
	}

	public static set(key: string, object: any) {
		window.localStorage.setItem(key, JSON.stringify(object));
	}

	public has(key: string) {
		return LocalStorage.has(key);
	}

	public json<T>() {
		return (LocalStorage.json() as unknown) as T;
	}

	public deleteAll(): IStorage {
		map(window.localStorage, LocalStorage.delete);
		return this;
	}

	public get<T>(key: string) {
		return LocalStorage.get(key) as T;
	}

	public delete(key: string): IStorage {
		LocalStorage.delete(key);
		return this;
	}

	public set(key: string, object: any): IStorage {
		window.localStorage.setItem(key, object);
		return this;
	}
}
