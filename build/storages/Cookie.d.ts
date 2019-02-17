import { IParameters, IStorage } from "./../types";
export default class Cookie implements IStorage {
    parser(): any;
    clear(): IStorage;
    get(key: string): any;
    unset(key: string): IStorage;
    set(key: string, object: any, parameters?: IParameters): IStorage;
}
//# sourceMappingURL=Cookie.d.ts.map