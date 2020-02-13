import { CookieSettings, IStorage } from "../types";
import { fnDate } from "../utils";

export default class Cookie<T> implements IStorage {
	public has(key: string) {
		return document.cookie.split(";").some((item) => item.trim().startsWith(`${key}=`));
	}
	public json(): T | {} {
		const cookie = document.cookie;
		if (cookie === "") {
			return {};
		}
		return cookie
			.split("; ")
			.map((v) => v.split("="))
			.reduce((acc: any, v: any) => {
				acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
				return acc;
			}, {});
	}
	public deleteAll(): IStorage {
		document.cookie.split(";").forEach((cookie) => {
			document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
		});
		return this;
	}
	public get(key: string) {
		const value = this.json()[key];
		try {
			return JSON.parse(value);
		} catch (error) {
			return value;
		}
	}
	public delete(key: string): IStorage {
		document.cookie = `${encodeURIComponent(key)}=;expires=${new Date().toUTCString()}`;
		return this;
	}
	public set(key: string, object: any, { expires = "1969-12-31T23:59:59.000Z", path = "/", useSecure = true }: CookieSettings): IStorage {
		const secure = window.location.protocol === "https" ? ";secure" : useSecure ? ";secure" : ";";
		const exp = fnDate(expires);
		const value = encodeURIComponent(JSON.stringify(object));
		document.cookie = `${encodeURIComponent(key)}=${value};path=${path};expires=${exp};samesite=strict${secure}`;
		return this;
	}
}
