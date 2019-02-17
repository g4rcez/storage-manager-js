import { IStorage } from "../types";
export default class SessionStorage implements IStorage {
    parser(): Storage;
    clear(): IStorage;
    get(key: string): any;
    unset(key: string): IStorage;
    set(key: string, object: any): IStorage;
}
//# sourceMappingURL=SessionStorage.d.ts.map