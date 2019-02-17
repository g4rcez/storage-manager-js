export type IParameters = {
	expires?: number | string;
	path?: string;
};

export type IStorageManager = {
	all(): any;
	cat(key: string): any;
	clear(key: string): IStorage;
	create(key: string, value: any, params?: IParameters): IStorage;
	delete(key: string): IStorage;
	get(key: string): any;
	getItem(key: string): any;
	item(key: string): any;
	json(): string;
	remove(key: string): IStorage;
	rm(key: string): IStorage;
	set(key: string, value: any, params?: IParameters): IStorage;
	setItem(key: string, value: any, params?: IParameters): IStorage;
	touch(key: string, value: any, params?: IParameters): IStorage;
	unset(key: string): IStorage;
};

export const Storages = {
	cookie: "cookie",
	localStorage: "localstorage",
	sessionStorage: "sessionstorage",
};

export interface IStorage {
	clear(): IStorage;
	get(key: string): any;
	parser(): any;
	set(key: string, object: any, parameters?: IParameters): IStorage;
	unset(key: string): IStorage;
}
