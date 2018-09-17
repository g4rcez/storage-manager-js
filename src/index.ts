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

const isStr = (value: any) =>
  typeof value === "string" || value instanceof String;

const fnDate = (str: any) => {
  const date: any = new Date();
  const integer: Date = new Date(date * 1 + str * 864e5);
  return !!parseInt(str, 10) ? integer : str;
};

const mapper = (object: object, callback: any): void => {
  try {
    Object.keys(object).forEach(x => callback(x));
  } catch (error) {
    window.console.log(error);
  }
};

export const Storages = {
  cookie: "cookie",
  localStorage: "localstorage",
  sessionStorage: "sessionstorage"
};

const setExpires = (cookie: string) =>
  cookie
    .replace(/^ +/, "")
    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);

const op: any = {
  cookie: {
    clear: (): void => {
      document.cookie.split(";").forEach(cookie => {
        document.cookie = setExpires(cookie);
      });
    },
    get: (key: string): any => op.cookie.parser()[key],
    parser: (): object => {
      return document.cookie === ""
        ? {}
        : document.cookie
            .split("; ")
            .map(v => v.split("="))
            .reduce((acc: any, v: any) => {
              acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim()
              );
              return acc;
            }, {});
    },
    set: (
      key: string,
      val: any,
      parameters: IParameters = {
        expires: "1969-12-31T23:59:59.000Z",
        path: "/"
      }
    ): void => {
      document.cookie = `${encodeURIComponent(key)}=${decodeURIComponent(
        val
      )};path=${parameters.path};expires=${fnDate(parameters.expires)}`;
    },
    unset: (key: string): void => {
      document.cookie = `${encodeURIComponent(
        key
      )}=;${new Date().toUTCString()}`;
    }
  },
  localstorage: {
    clear: (): void => {
      mapper(window.localStorage, op.localstorage.unset);
    },
    get: (key: string): any => window.localStorage.getItem(key),
    parser: (): object => window.localStorage,
    set: (key: string, value: any): void =>
      window.localStorage.setItem(key, value),
    unset: (key: string): void => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        window.localStorage.removeItem("");
      }
    }
  },
  sessionstorage: {
    clear: (): void => {
      mapper(window.sessionStorage, op.sessionstorage.unset);
    },
    get: (key: string): any => window.sessionStorage.getItem(key),
    parser: (): object => window.sessionStorage,
    set: (key: string, value: any): void =>
      window.sessionStorage.setItem(key, value),
    unset: (key: string): void => {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {
        window.sessionStorage.removeItem("");
      }
    }
  }
};

const normalize = (str: string): string => str.toLowerCase().trim();

const getManager = (value: string): string => {
  const manager = normalize(value);
  const array: string[] = ["cookie", "localstorage", "sessionstorage"];
  return array.indexOf(manager) >= 0 ? manager : normalize(Storages.cookie);
};

function StorageManagerJs(manager: string = "cookie"): IStorageManager {
  if (!!Storage) {
    manager = getManager(manager);
  } else {
    manager = "cookie";
  }
  
  return {
    all: json,
    cat: get,
    change,
    clear,
    clearAll,
    create: set,
    delete: unset,
    get,
    getItem: get,
    item: get,
    json,
    purge: clearAll,
    remove: unset,
    rm: unset,
    set,
    setItem: set,
    touch: set,
    unset
  }

  function json(): any {
    return op[manager].parser();
  }

  function change(
    this: IStorageManager,
    value: string = "cookie"
  ): IStorageManager {
    manager = getManager(value);
    return this;
  }
  
  function get(key: string, expect?: string): any {
    const value = op[manager].get(key);
    try {
      return expect === "raw" || expect === "r"
        ? value
        : expect === "array" || expect === "a"
          ? value.split(",")
          : JSON.parse(value);
    } catch (error) {
      return value;
    }
  }
  
  function set(
    this: IStorageManager,
    key: string,
    val: any,
    params?: IParameters
  ): IStorageManager {
    if (isStr(val)) {
      op[manager].set(key, val.trim(), params);
    } else {
      op[manager].set(key, JSON.stringify(val), params);
    }
    return this;
  }
  
  function unset(this: IStorageManager, key: string): IStorageManager {
    op[manager].unset(key);
    return this;
  }
  
  function clear(this: IStorageManager): IStorageManager {
    op[manager].clear();
    return this;
  }
  
  function clearAll(this: IStorageManager): IStorageManager {
    ["cookie", "localstorage", "sessionstorage"].forEach(x => op[x].clear());
    return this;
  }
}
export default StorageManagerJs;
