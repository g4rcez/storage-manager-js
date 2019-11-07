import { IParameters, IStorage } from "../types";
import { fnDate } from "../utils";

export const expire = (cookie: string) => cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);

const defaultParams = { path: "/", expires: "1969-12-31T23:59:59.000Z", domain: window.location.hostname };
export default class Cookie implements IStorage {
	public parser() {
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
	public clear(): IStorage {
		document.cookie.split(";").forEach((cookie) => {
			document.cookie = expire(cookie);
		});
		return this;
	}
	public get(key: string) {
		const value = this.parser()[key];
		try {
			return JSON.parse(value);
		} catch (error) {
			return value;
		}
	}
	public unset(key: string): IStorage {
		document.cookie = `${encodeURIComponent(key)}=;expires=${new Date().toUTCString()}`;
		return this;
	}
	public set(key: string, object: any, parameters: IParameters = defaultParams): IStorage {
		const { expires, path } = parameters;
		const useSecure = window.location.protocol === "https" ? ";secure" : ";";
		document.cookie = `${encodeURIComponent(key)}=${decodeURIComponent(JSON.stringify(object))};path=${path};expires=${fnDate(
			expires,
		)};samesite=strict${useSecure}`;
		return this;
	}
}
