import { IParameters, IStorage } from "./../types";
import { setExpires, fnDate } from "./../utils";

const defaultParams = {path:"/","expires":"1969-12-31T23:59:59.000Z"}
export default class Cookie implements IStorage {
	parser() {
		if (document.cookie === "") {
			return {};
		}
		return document.cookie
			.split("; ")
			.map((v) => v.split("="))
			.reduce((acc: any, v: any) => {
				acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
				return acc;
			}, {});
	}
	clear(): IStorage {
		document.cookie.split(";").forEach((cookie) => {
			document.cookie = setExpires(cookie);
		});
		return this;
	}
	get(key: string) {
		const value = this.parser()[key];
		try {
			return JSON.parse(value);
		} catch (error) {
			return value
		}
	}
	unset(key: string): IStorage {
		document.cookie = `${encodeURIComponent(key)}=;${new Date().toUTCString()}`;
		return this;
	}
	set(key: string, object: any, parameters: IParameters = defaultParams): IStorage {
        const {expires,path} = parameters
		document.cookie = `${encodeURIComponent(key)}=${decodeURIComponent(
			JSON.stringify(object),
		)};path=${path};expires=${fnDate(expires)}`;
		return this;
	}
}
