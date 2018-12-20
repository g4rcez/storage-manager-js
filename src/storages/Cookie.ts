import { IParameters, IStorage } from "./../types";
import { setExpires, fnDate } from "./../utils";

export default class Cookie implements IStorage {
    parser() {
        return document.cookie === ""
            ? {}
            : document.cookie
                  .split("; ")
                  .map((v) => v.split("="))
                  .reduce((acc: any, v: any) => {
                      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                      return acc;
                  }, {});
    }
    clear(): IStorage {
        document.cookie.split(";").forEach((cookie) => {
            document.cookie = setExpires(cookie);
        });
        return this;
    }
    get(key: string) {
        const string = this.parser()[key];
        try {
            return JSON.parse(string);
        } catch (error) {
            return JSON.parse(string);
        }
    }
    unset(key: string): IStorage {
        document.cookie = `${encodeURIComponent(key)}=;${new Date().toUTCString()}`;
        return this;
    }
    set(key: string, object: any, parameters?: IParameters): IStorage {
        let path = "/";
        let expires = "1969-12-31T23:59:59.000Z";
        if (parameters) {
            if (parameters.path) {
                path = parameters.path;
            }
            if (parameters.expires) {
                expires = `${parameters.expires}`;
            }
        }
        document.cookie = `${encodeURIComponent(key)}=${decodeURIComponent(
            JSON.stringify(object),
        )};path=${path};expires=${fnDate(expires)}`;
        return this;
    }
}
