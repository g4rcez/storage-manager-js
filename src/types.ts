export type CookieSettings = Partial<{
	expires: number | string;
	path: string;
	sameSite: "lax" | "strict" | "";
	useSecure: boolean;
}>;

type Methods = {
	delete(key: string): void;
	deleteAll(): void;
	get<T = unknown>(key: string): T | string | null;
	has(key: string): boolean;
	json<T>(): T;
};

export type TypeStorage = Methods & {
	set<T = unknown>(key: string, object: T): void;
};

export type CookieStorage = Methods & {
	set<T = unknown>(key: string, object: T, parameters?: CookieSettings): void;
};
