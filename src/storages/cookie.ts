import type { CookieStorage, SetCookies, SetCookiesParser } from "../types";
import { isNil, isPrimitive } from "../utils";
import { Subscribe } from "../types";

const fnDate = (str: number | string | Date) =>
	str instanceof Date ? str : typeof str === "number" ? new Date((new Date() as any) * 1 + (str as number) * 864e5) : str;

const zeroEpoch = "1969-12-31T23:59:59.000Z";

const json = <T>(): T => {
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
};

const listeners = new Set<Subscribe>();
const callListeners = () => {
	const store = json();
	listeners.forEach((fn) => fn(store));
};

const parsers: SetCookiesParser = [
	{ name: "expires", parse: (opts) => `expires=${fnDate(opts.expires ?? zeroEpoch)}` },
	{ name: "maxAge", parse: (opts) => (opts.maxAge ? `max-age=${fnDate(opts.expires ?? zeroEpoch)}` : "") },
	{ name: "path", parse: (opts) => `path=${opts.path ?? "/"}` },
	{ name: "sameSite", parse: (opts) => `samesite=${opts.sameSite ?? "strict"}` },
	{ name: "useSecure", parse: (opts) => `${opts.useSecure ?? true ? "secure" : ""}` },
	{
		name: "domain",
		parse: (opts) => {
			const domain = opts.domain ?? "";
			if (domain === "") return "";
			return `domain=${opts.multiDomain ? "." : ""}${domain}`;
		},
	},
	{ name: "partitioned", parse: (opts) => (opts.partitioned ? `Partitioned` : "") },
];

const Cookie: CookieStorage = {
	json,
	listener: (fn) => {
		listeners.add(fn);
		return () => listeners.delete(fn);
	},
	has: (key) => document.cookie.split(";").some((item) => item.trim().startsWith(`${key}=`)),
	deleteAll: () => {
		document.cookie.split(";").forEach((cookie) => {
			document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
		});
		callListeners();
	},
	get: <E>(key: string): E | null => {
		const value = (Cookie.json<E>() as any)[key];
		if (isNil(value)) {
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
		callListeners();
	},
	set: (key: string, object: unknown, opts: SetCookies = {}) => {
		const value = isPrimitive(object) ? object : encodeURIComponent(JSON.stringify(object));
		const cookies = parsers
			.reduce<string[]>(
				(acc, el) => {
					const val = el.parse(opts);
					return val === "" ? acc : acc.concat(val);
				},
				[`${encodeURIComponent(key)}=${value}`],
			)
			.join(";");
		document.cookie = cookies;
		callListeners();
	},
};

export default Cookie;
