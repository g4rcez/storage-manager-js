type TStorage = {
	delete(key: string): void;
	deleteAll(): void;
	get<T = unknown>(key: string): T | string | null;
	has(key: string): boolean;
	listener: Subscribe;
};

export type Unsubscribe = () => void;

export type Subscribe = (storage: any) => Unsubscribe;

export type TypeStorage = TStorage & {
	json<T>(parse?: boolean): T;
	set<T = unknown>(key: string, object: T): void;
};

type CookieAge = number | string | Date;

export type SetCookiesParser = Array<{ name: keyof SetCookies; parse: (opts: SetCookies) => string }>;

export type SetCookies = Partial<{
	domain: string;
	expires: CookieAge;
	maxAge: CookieAge;
	multiDomain?: boolean;
	partitioned: boolean;
	path: string;
	sameSite: "strict" | "lax" | "none" | "";
	useSecure: boolean;
}>;

export type CookieStorage = TStorage & {
	json<T>(): T;
	set<T = unknown>(key: string, object: T, parameters?: SetCookies): void;
};
