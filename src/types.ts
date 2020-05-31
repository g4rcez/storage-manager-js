export type CookieSettings = Partial<{
	expires: number | string;
	path: string;
	sameSite: "lax" | "strict" | "";
	useSecure: boolean;
}>;

export type TypeStorage = {
	delete(key: string): void;
	deleteAll(): void;
	get<T extends any>(key: string): T | string | undefined;
	has(key: string): boolean;
	json<T>(): T;
	set(key: string, object: any, parameters?: CookieSettings): void;
};
