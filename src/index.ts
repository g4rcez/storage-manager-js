import { IStorage, IStorageManager, Storages as StorageTypes, IParameters } from "./types";
import Cookie from "./storages/Cookie";
import LocalStorage from "./storages/LocalStorage";
import SessionStorage from "./storages/SessionStorage";
export { default as Cookie } from "./storages/Cookie";
export { default as LocalStorage } from "./storages/LocalStorage";
export { default as SessionStorage } from "./storages/SessionStorage";
export const Storages = { ...StorageTypes };

type Managers = {
	cookie(): IStorage;
	localstorage(): IStorage;
	sessionstorage(): IStorage;
};

function normalize(str: string) {
	return str.toLowerCase().trim();
}
const managers: Managers = {
	cookie: () => new Cookie(),
	localstorage: () => new LocalStorage(),
	sessionstorage: () => new SessionStorage(),
};

function getManager(value: string): IStorage {
	return managers[normalize(value)];
}

export function StorageManagerJs(managerName: string = "cookie"): IStorageManager {
	const manager = getManager(managerName);
	return Object.freeze({
		all: () => manager.parser(),
		cat: (key: string) => manager.get(key),
		clear: (key: string) => manager.unset(key),
		create: (key: string, value: any, params?: IParameters) => manager.set(key, value, params),
		delete: (key: string) => manager.unset(key),
		get: (key: string) => manager.get(key),
		getItem: (key: string) => manager.get(key),
		item: (key: string) => manager.get(key),
		json: () => JSON.stringify(manager.parser()),
		remove: (key: string) => manager.unset(key),
		rm: (key: string) => manager.unset(key),
		set: (key: string, value: any, params?: IParameters) => manager.set(key, value, params),
		setItem: (key: string, value: any, params?: IParameters) => manager.set(key, value, params),
		touch: (key: string, value: any, params?: IParameters) => manager.set(key, value, params),
		unset: (key: string) => manager.unset(key),
	});
}
