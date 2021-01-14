export type CookieSettings = Partial<{
	expires: number | string;
	path: string;
	sameSite: "lax" | "strict" | "";
	useSecure: boolean;
}>;

type Methods = {
	delete(key: string): void;
	deleteAll(): void;
	get<T = any>(key: string): T | string | null;
	has(key: string): boolean;
	json<T>(): T;
};

export type TypeStorage = Methods & {
	set(key: string, object: any): void;
};

export type CookieStorage = Methods & {
	set(key: string, object: any, parameters?: CookieSettings): void;
};
