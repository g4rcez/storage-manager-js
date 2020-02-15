export type CookieSettings = Partial<{
	expires: number | string;
	path: string;
	useSecure: boolean;
	maxAge: number;
}>;

export interface IStorage {
	delete(key: string): IStorage;
	deleteAll(): IStorage;
	get(key: string): any;
	has(key: string): boolean;
	json(): any;
	set(key: string, object: any, parameters?: CookieSettings): IStorage;
}
