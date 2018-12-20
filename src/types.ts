export type IParameters = {
    path?: string;
    expires?: number | string;
};

export type IStorageManager = {
    remove(key: string): IStorage;
    delete(key: string): IStorage;
    setItem(key: string, value: any, params?: IParameters): IStorage;
    getItem(key: string): any;
    create(key: string, value: any, params?: IParameters): IStorage;
    touch(key: string, value: any, params?: IParameters): IStorage;
    rm(key: string): IStorage;
    item(key: string): any;
    all(): any;
    cat(key: string): any;
    unset(key: string): IStorage;
    get(key: string): any;
    set(key: string, value: any, params?: IParameters): IStorage;
    json(): any;
    clear(key: string): IStorage;
};

export const Storages = {
    cookie: "cookie",
    localStorage: "localstorage",
    sessionStorage: "sessionstorage",
};

export interface IStorage {
    parser(): any;
    clear(): IStorage;
    get(key: string): any;
    unset(key: string): IStorage;
    set(key: string, object: any, parameters?: IParameters): IStorage;
}
