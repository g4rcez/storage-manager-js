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
	listener: Subscribe;
};

export type Unsubscribe = () => void;

export type Subscribe = (storage: any) => Unsubscribe;

export type TypeStorage = Methods & {
	json<T>(parse?: boolean): T;
	set<T = unknown>(key: string, object: T): void;
};

export type CookieStorage = Methods & {
	json<T>(): T;
	set<T = unknown>(key: string, object: T, parameters?: CookieSettings): void;
};
