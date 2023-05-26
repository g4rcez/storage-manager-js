import { Subscribe, TypeStorage } from "../types";
import { getStorage, isNil, json, map } from "../utils";

export const createStorage = (getStorageProvider: () => Storage): TypeStorage => {
	const listeners = new Set<Subscribe>();

	const deleteItem = (key: string) => {
		getStorageProvider().removeItem(key);
		const store = json(getStorageProvider());
		listeners.forEach((fn) => fn(store));
	};

	return {
		delete: deleteItem,
		listener: (fn) => {
			listeners.add(fn);
			return () => listeners.delete(fn);
		},
		json: <T>(parse: boolean = false) => (parse ? json(getStorageProvider()) : (getStorageProvider() as unknown as T)),
		has: (key: string) => {
			const item = getStorageProvider().getItem(key);
			return !isNil(item);
		},
		deleteAll: () => {
			map(getStorageProvider(), deleteItem);
			listeners.forEach((fn) => fn(getStorageProvider()));
		},
		get: <T>(key: string) => getStorage(key, getStorageProvider()),
		set: (key, object) => {
			getStorageProvider().setItem(key, JSON.stringify(object));
			listeners.forEach((fn) => fn(getStorageProvider()));
		},
	};
};
