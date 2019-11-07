import { IStorage } from "../types";
export default class LocalStorage implements IStorage {
    parser(): Storage;
    clear(): IStorage;
    get(key: string): any;
    unset(key: string): IStorage;
    set(key: string, object: any): IStorage;
}
//# sourceMappingURL=LocalStorage.d.ts.map