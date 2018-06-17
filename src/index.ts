const isObject = value => {
  return value && typeof value === "object" && value.constructor === Object;
};

const isString = value => {
  return typeof value === "string" || value instanceof String;
};

const objKeysMap = (object, callback) => {
  try {
    Object.keys(object).map(item => {
      return callback(item);
    });
  } catch (error) {}
};

const intDate = string => {
  let date: any = new Date();
  const withInteger: Date = new Date(date * 1 + string * 864e5);
  return !!parseInt(string) ? withInteger : string;
};

const contains = (object, value) => {
  if (!isObject(object)) return false;
  return (
    Object.keys(object)
      .filter(item => item === value)
      .toString() === value && isString(value)
  );
};

let cache = {};

const operator = {
  localstorage: {
    parser: () => {
      return window.localStorage;
    },
    get: key => {
      return window.localStorage.getItem(key);
    },
    set: (key, value) => {
      window.localStorage.setItem(key, value);
    },
    unset: key => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {}
    },
    clear: () => {
      objKeysMap(window.localStorage, operator.localstorage.unset);
    }
  },
  sessionstorage: {
    parser: () => {
      return window.sessionStorage;
    },
    get: key => {
      return window.sessionStorage.getItem(key);
    },
    set: (key, value) => {
      window.sessionStorage.setItem(key, value);
    },
    unset: key => {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {}
    },
    clear: () => {
      objKeysMap(window.sessionStorage, operator.sessionstorage.unset);
    }
  },
  cookie: {
    parser: () => {
      const all = document.cookie !== "" ? document.cookie.split("; ") : [];
      if (all.length === 0) return;
      return all.map(val => val.split("=")).reduce((acc, val) => {
        acc[decodeURIComponent(val[0])] = decodeURIComponent(val[1]);
        return acc;
      }, {});
    },
    set: (key, val, parameters = { expires: "", path: "/", domain: "" }) => {
      let exp = intDate(parameters.expires) || "";
      let path = parameters.path || "";
      let domain = parameters.domain || document.location.hostname;
      document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
        val
      )};expires="${exp}";path=${path};domain=${domain}`;
    },
    get: key => {
      return cache[key];
    },
    unset: key => {
      document.cookie =
        encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      cache[key] = undefined;
    },
    clear: () => {
      objKeysMap(operator.cookie.parser(), operator.cookie.unset);
      cache = {};
    }
  }
};

export default function StorageManage(manager = "cookie") {
  const managers = Object.freeze({
    c: "cookie",
    l: "localstorage",
    s: "sessionstorage",
    cookie: "cookie",
    localstorage: "localstorage",
    sessionstorage: "sessionstorage"
  });
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
    const parser = operator[manager].parser();
    let json = {};
    Object.keys(parser).map(item => {
      try {
        json = { ...json, [item]: JSON.parse(parser[item]) };
      } catch (error) {
        json = { ...json, [item]: parser[item] };
      }
    });
    return json;
  }

  function change(value = "cookie") {
    if (contains(managers, value)) {
      manager = managers[value.toLowerCase().trim()];
    } else {
      manager = "cookie";
    }
    cache = operator[manager].parser();
    return this;
  }

  function get(key, expect) {
    let value = operator[manager].get(key);
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

  function set(key, value, expires = "") {
    operator[manager].set(key, JSON.stringify(value), expires);
    cache = { ...cache, [key]: value };
    return this;
  }

  function unset(key) {
    operator[manager].unset(key);
    return this;
  }

  function clear() {
    operator[manager].clear();
    return this;
  }

  function clearAll() {
    ["cookie", "localstorage", "sessionstorage"].forEach(x =>
      operator[x].clear()
    );
    return this;
  }
}
