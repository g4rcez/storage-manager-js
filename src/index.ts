interface Parameters {
  path?: string;
  expires?: number | string;
}

interface IStorageManager {
  get: Function;
  set: Function;
  json: Function;
  clear: Function;
  unset: Function;
  change: Function;
  clearAll: Function;
  cat: Function;
  all: Function;
  item: Function;
  rm: Function;
  touch: Function;
  create: Function;
  getItem: Function;
  setItem: Function;
  delete: Function;
  remove: Function;
  purge: Function;
}

const isStr = (value: any) =>
  typeof value === "string" || value instanceof String;

const fnDate = (str: any) => {
  let date: any = new Date();
  const integer: Date = new Date(date * 1 + str * 864e5);
  return !!parseInt(str, 10) ? integer : str;
};

const mapper = (object: object, callback: Function): void => {
  try {
    Object.keys(object).forEach(x => callback(x));
  } catch (error) {}
};

export const Storages = {
  cookie: "cookie",
  localStorage: "localstorage",
  sessionStorage: "sessionstorage"
};

const op: any = {
  localstorage: {
    parser: (): object => window.localStorage,
    get: (key: string): any => window.localStorage.getItem(key),
    set: (key: string, value: any): void =>
      window.localStorage.setItem(key, value),
    unset: (key: string): void => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {}
    },
    clear: (): void => {
      mapper(window.localStorage, op.localstorage.unset);
    }
  },
  sessionstorage: {
    parser: (): object => window.sessionStorage,
    get: (key: string): any => window.sessionStorage.getItem(key),
    set: (key: string, value: any): void =>
      window.sessionStorage.setItem(key, value),
    unset: (key: string): void => {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {}
    },
    clear: (): void => {
      mapper(window.sessionStorage, op.sessionstorage.unset);
    }
  },
  cookie: {
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
      parameters: Parameters = { path: "", expires: "" }
    ): void => {
      let string = `${encodeURIComponent(key)}=${decodeURIComponent(val)}`;
      if (parameters.path !== "" || parameters.path !== undefined) {
        string += `;path=${parameters.path}`;
      } else {
        string += ";path=/;";
      }
      if (parameters.expires !== "" && parameters.expires !== undefined) {
        string += `;expires=${fnDate(parameters.expires)}`;
      }
      document.cookie = string;
    },
    get: (key: string): any => op.cookie.parser()[key],
    unset: (key: string): void => {
      document.cookie = `${encodeURIComponent(
        key
      )}=;${new Date().toUTCString()}`;
    },
    clear: (): void => {
      document.cookie.split(";").forEach(cookie => {
        document.cookie = normalize(cookie)
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
    }
  }
};
const normalize = (str: string): string => str.toLowerCase().trim();

const getManager = (value: string): string => {
  const manager = normalize(value);
  const array: Array<string> = ["cookie", "localstorage", "sessionstorage"];
  return array.indexOf(manager) >= 0 ? manager : normalize(Storages.cookie);
};

export default function StorageManagerJs(
  manager: string = "cookie"
): IStorageManager {
  if (!!Storage) {
    manager = getManager(manager);
  } else {
    console.warn("Browser doesn't have support to Storage");
    manager = "cookie";
  }
  return Object.freeze({
    get,
    set,
    json,
    clear,
    unset,
    change,
    clearAll,
    cat: get,
    all: json,
    item: get,
    rm: unset,
    touch: set,
    create: set,
    getItem: get,
    setItem: set,
    delete: unset,
    remove: unset,
    purge: clearAll
  });
  function json(): object {
    return op[manager].parser();
  }
  function change(value: string = "cookie"): IStorageManager {
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
  function set(key: string, val: any, params: Parameters): IStorageManager {
    if (isStr(val)) {
      op[manager].set(key, val.trim(), params);
    } else {
      op[manager].set(key, JSON.stringify(val), params);
    }
    return this;
  }
  function unset(key: string): IStorageManager {
    op[manager].unset(key);
    return this;
  }
  function clear(): IStorageManager {
    op[manager].clear();
    return this;
  }
  function clearAll(): IStorageManager {
    ["cookie", "localstorage", "sessionstorage"].forEach(x => op[x].clear());
    return this;
  }
}
