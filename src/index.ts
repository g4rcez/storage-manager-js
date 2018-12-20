import { IStorage, IStorageManager, Storages as StorageTypes, IParameters } from "./types";
import Cookie from "./storages/Cookie";
import LocalStorage from "./storages/LocalStorage";
import SessionStorage from "./storages/SessionStorage";

export { default as Cookie } from "./storages/Cookie";
export { default as LocalStorage } from "./storages/LocalStorage";
export { default as SessionStorage } from "./storages/SessionStorage";
export const Storages = { ...StorageTypes };

type Managers = {
    [key: string]: IStorage;
};

const normalize = (str: string): string => str.toLowerCase().trim();
const managers: Managers = {
    cookie: new Cookie(),
    localstorage: new LocalStorage(),
    sessionstorage: new SessionStorage(),
};

const getManager = (value: string): IStorage => {
    const manager = normalize(value);
    return managers[manager];
};


export function StorageManagerJs(managerName: string = "cookie"): IStorageManager {
    const manager = getManager(managerName);
    return {
        all: () => manager.parser(),
        json: () => manager.parser(),
        cat: (key: string) => manager.get(key),
        get: (key: string) => manager.get(key),
        item: (key: string) => manager.get(key),
        getItem: (key: string) => manager.get(key),
        clear: (key) => manager.unset(key),
        rm: (key: string) => manager.unset(key),
        unset: (key: string) => manager.unset(key),
        delete: (key: string) => manager.unset(key),
        remove: (key: string) => manager.unset(key),
        set: (key: string, value: any, params?: IParameters) => manager.set(key, value, params),
        touch: (key: string, value: any, params?: IParameters) => manager.set(key, value, params),
        create: (key: string, value: any, params?: IParameters) => manager.set(key, value, params),
        setItem: (key: string, value: any, params?: IParameters) => manager.set(key, value, params),
    };
}
