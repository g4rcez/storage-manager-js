export type CookieSettings = Partial<{
	expires: number | string;
	path: string;
	useSecure: boolean;
	maxAge: number;
}>;

export interface IStorage {
	delete(key: string): IStorage;
	deleteAll(): IStorage;
	get<T>(key: string): T | string | undefined;
	has(key: string): boolean;
	json<T>(): T;
	set(key: string, object: any, parameters?: CookieSettings): IStorage;
}
