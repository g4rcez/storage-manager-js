import { IStorageManager, Storages as StorageTypes } from "./types";
export { default as Cookie } from "./storages/Cookie";
export { default as LocalStorage } from "./storages/LocalStorage";
export { default as SessionStorage } from "./storages/SessionStorage";
export declare const Storages: typeof StorageTypes;
declare type managersAccept = "cookie" | "localStorage" | "sessionStorage";
export declare function StorageManagerJs(managerName?: managersAccept): IStorageManager;
//# sourceMappingURL=index.d.ts.map