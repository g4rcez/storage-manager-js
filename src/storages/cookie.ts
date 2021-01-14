import type { CookieSettings, CookieStorage } from "../types";

const fnDate = (str: number | string) => {
	const date: any = new Date();
	return typeof str === "number" ? new Date(date * 1 + (str as number) * 864e5) : str;
};

const zeroEpoch = "1969-12-31T23:59:59.000Z";

const Cookie: CookieStorage = {
	has: (key) => document.cookie.split(";").some((item) => item.trim().startsWith(`${key}=`)),
	json: <T>(): T => {
		const cookie = document.cookie;
		if (cookie === "") {
			return {} as T;
		}
		return document.cookie
			.split("; ")
			.map((v) => v.split("="))
			.reduce((acc: any, v: any) => {
				acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
				return acc;
			}, {});
	},
	deleteAll: () => {
		document.cookie.split(";").forEach((cookie) => {
			document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
		});
	},
	get: <E>(key: string): E | null => {
		const value = (Cookie.json<E>() as any)[key];
		if (value === null) {
			return null;
		}
		try {
			return JSON.parse(decodeURIComponent(value)) as E;
		} catch (error) {
			return value;
		}
	},
	delete: (key: string) => {
		document.cookie = `${encodeURIComponent(key)}=;expires=${new Date().toUTCString()}`;
	},
	set: (key: string, object: any, { expires = zeroEpoch, path = "/", sameSite = "strict", useSecure = true } = {}) => {
		const secure = useSecure ? ";secure" : ";";
		const exp = fnDate(expires);
		const value = encodeURIComponent(JSON.stringify(object));
		const samesite = sameSite === "" ? "" : `${sameSite};`;
		document.cookie = `${encodeURIComponent(key)}=${value};path=${path};expires=${exp};${samesite}${secure}`;
	},
};

export default Cookie;
