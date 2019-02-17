import { IStorageManager } from "./types";
export { default as Cookie } from "./storages/Cookie";
export { default as LocalStorage } from "./storages/LocalStorage";
export { default as SessionStorage } from "./storages/SessionStorage";
export declare const Storages: {
    cookie: string;
    localStorage: string;
    sessionStorage: string;
};
export declare function StorageManagerJs(managerName?: string): IStorageManager;
//# sourceMappingURL=index.d.ts.map