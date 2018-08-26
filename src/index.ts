const isObject = value =>
  value && typeof value === "object" && value.constructor === Object;
const isStr = value => typeof value === "string" || value instanceof String;

const mapper = (object, callback) => {
  try {
    Object.keys(object).forEach(item => callback(item));
  } catch (error) {}
};

const has = (object, value) =>
  !isObject(object)
    ? false
    : Object.keys(object)
        .filter(item => item === value)
        .toString() === value && isStr(value);

const op = {
  localstorage: {
    parser: () => window.localStorage,
    get: key => window.localStorage.getItem(key),
    set: (key, value) => window.localStorage.setItem(key, value),
    unset: key => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {}
    },
    clear: () => {
      mapper(window.localStorage, op.localstorage.unset);
    }
  },
  sessionstorage: {
    parser: () => window.sessionStorage,
    get: key => window.sessionStorage.getItem(key),
    set: (key, value) => window.sessionStorage.setItem(key, value),
    unset: key => {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {}
    },
    clear: () => {
      mapper(window.sessionStorage, op.sessionstorage.unset);
    }
  },
  cookie: {
    parser: () => {
      return document.cookie === ""
        ? {}
        : document.cookie
            .split("; ")
            .map(v => v.split("="))
            .reduce((acc, v) => {
              acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim()
              );
              return acc;
            }, {});
    },
    set: (key, val) => {
      document.cookie = `${encodeURIComponent(key)}=${decodeURIComponent(
        val
      )};Path=/;`;
    },
    get: key => op.cookie.parser()[key],
    unset: key => {
      document.cookie = `${encodeURIComponent(
        key
      )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    },
    clear: () => {
      mapper(op.cookie.parser(), op.cookie.unset);
    }
  }
};
const managers = Object.freeze({
  c: "cookie",
  l: "localstorage",
  s: "sessionstorage",
  cookie: "cookie",
  localstorage: "localstorage",
  sessionstorage: "sessionstorage"
});
export default function StorageManagerJs(manager = "cookie") {
  if (!!Storage) {
    manager = managers[manager.toLowerCase()] || "cookie";
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
  function json() {
    return op[manager].parser();
  }
  function change(value = "cookie") {
    if (has(managers, value)) {
      manager = managers[value.toLowerCase().trim()];
    } else {
      manager = "cookie";
    }
    return this;
  }
  function get(key, expect) {
    let value = op[manager].get(key);
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
  function set(key, value) {
    if (isStr(value)) {
      op[manager].set(key, value.trim());
    } else {
      op[manager].set(key, JSON.stringify(value));
    }
    return this;
  }
  function unset(key) {
    op[manager].unset(key);
    return this;
  }
  function clear() {
    op[manager].clear();
    return this;
  }
  function clearAll() {
    ["cookie", "localstorage", "sessionstorage"].forEach(x => op[x].clear());
    return this;
  }
}
