interface IParameters {
    path?: string;
    expires?: number | string;
}
interface IStorageManager {
    purge(): IStorageManager;
    remove(key: string): IStorageManager;
    delete(key: string): IStorageManager;
    setItem(key: string, value: any, params?: IParameters): IStorageManager;
    getItem(key: string): any;
    create(key: string, value: any, params?: IParameters): IStorageManager;
    touch(key: string, value: any, params?: IParameters): IStorageManager;
    rm(key: string): IStorageManager;
    item(key: string): any;
    all(): any;
    cat(key: string): any;
    clearAll(): IStorageManager;
    change(manager: string): IStorageManager;
    unset(key: string): IStorageManager;
    get(key: string): any;
    set(key: string, value: any, params?: IParameters): IStorageManager;
    json(): any;
    clear(key: string): IStorageManager;
}
export declare const Storages: {
    cookie: string;
    localStorage: string;
    sessionStorage: string;
};
declare function StorageManagerJs(manager?: string): IStorageManager;
export default StorageManagerJs;
//# sourceMappingURL=index.d.ts.map