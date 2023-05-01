import { Subscribe, TypeStorage } from "../types";
import { getStorage, isNil, json, map } from "../utils";

export const createStorage = (storage: Storage): TypeStorage => {
	const listeners = new Set<Subscribe>();

	const deleteItem = (key: string) => {
		storage.removeItem(key);
		const store = json(storage);
		listeners.forEach((fn) => fn(store));
	};

	return {
		delete: deleteItem,
		listener: (fn) => {
			listeners.add(fn);
			return () => listeners.delete(fn);
		},
		json: <T>(parse: boolean = false) => (parse ? json(storage) : (storage as unknown as T)),
		has: (key: string) => {
			const item = storage.getItem(key);
			return !isNil(item);
		},
		deleteAll: () => {
			map(storage, deleteItem);
			listeners.forEach((fn) => fn(storage));
		},
		get: <T>(key: string) => getStorage(key, storage),
		set: (key, object) => {
			storage.setItem(key, JSON.stringify(object));
			listeners.forEach((fn) => fn(storage));
		},
	};
};
