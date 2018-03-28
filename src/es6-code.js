const isObject = value => {
  return value && typeof value === "object" && value.constructor === Object;
};

const isString = value => {
  return typeof value === "string" || value instanceof String;
};

const objectForIn = (object, callback, comparator = "") => {
  if (isObject(object)) {
    try {
      Object.keys(object).map(item => {
        callback(item);
      });
    } catch (error) {}
  }
};

const objectContains = (object, value) => {
  if (!isObject(object)) return false;
  return (
    Object.keys(object)
      .filter(item => item === value)
      .toString() === value && isString(value)
  );
};

const allAreObjects = array => {
  if (Array.isArray(array)) {
    array.map(item => {
      if (!isObject(item)) return false;
    });
    return true;
  }
  return false;
};

const storageOperator = (type, key = "", value = "") => {
  return {
    parser: () => {
      return window[type];
    },
    get: key => {
      return window[type][key];
    },
    set: (key, value) => {
      window[type].setItem(key, value);
    },
    unset: key => {
      window[type].removeItem(key);
    }
  };
};

export default class StorageManage {
  constructor(value = "cookie") {
    this.options = {
      c: "cookie",
      cookie: "cookie",
      l: "localstorage",
      localstorage: "localstorage",
      s: "sessionstorage",
      sessionstorage: "sessionstorage"
    };
    Object.freeze(this.options);
    this.manage;
    this.changeManager(value);
  }

  changeManager = value => {
    if (objectContains(this.options, value)) {
      this.manage = this.options[value.toLowerCase().trim()];
    } else {
      console.log("Value not exists:", value);
      console.log("Accept only:", JSON.stringify(this.options));
      this.manage = "cookie";
    }
  };

  get = (key, expect) => {
    let value = this[this.manage].get(key);
    try {
      return expect === "raw" || expect === "r"
        ? value
        : expect === "array" || expect === "a"
          ? value.split(",")
          : JSON.parse(value);
    } catch (error) {
      return value;
    }
  };

  set = (key, value) => {
    if (isObject(value)) value = JSON.stringify(value);
    if (Array.isArray(value) && allAreObjects(value))
      value = JSON.stringify(value);
    this[this.manage].set(key, value);
  };

  unset = key => {
    this[this.manage].unset(key);
  };

  clear = () => {
    this[this.manage].clear();
  };

  clearAll = () => {
    this.cookie.clear();
    this.localstorage.clear();
    this.sessionstorage.clear();
  };

  json = key => {
    try {
      return JSON.parse(this[this.manage].get(key));
    } catch (error) {
      return {
        [key]: this[this.manage].get(key)
      };
    }
  };

  localstorage = {
    parser: () => {
      return storageOperator("localStorage").parser();
    },
    get: key => {
      return storageOperator("localStorage").get(key);
    },
    set: (key, value) => {
      storageOperator("localStorage").set(key, value);
    },
    unset: key => {
      try {
        storageOperator("localStorage").unset(key);
      } catch (error) {}
    },
    clear: () => {
      objectForIn(window.localStorage, this.localstorage.unset);
    }
  };

  sessionstorage = {
    parser: () => {
      return storageOperator("sessionStorage").parser();
    },
    get: key => {
      return storageOperator("sessionStorage").get(key);
    },
    set: (key, value) => {
      storageOperator("sessionStorage").set(key, value);
    },
    unset: key => {
      try {
        storageOperator("sessionStorage").unset(key);
      } catch (error) {}
    },
    clear: () => {
      objectForIn(window.sessionStorage, this.sessionstorage.unset);
    }
  };

  cookie = {
    parser: () => {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      if (cookies.length === 0) return;
      return cookies
        .map(value => value.split("="))
        .reduce((cookieAccumulator, cookieValue) => {
          cookieAccumulator[
            decodeURIComponent(cookieValue[0].trim())
          ] = decodeURIComponent(cookieValue[1].trim());
          return cookieAccumulator;
        }, {});
    },
    set: (key, value) => {
      document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
        value
      )}`;
    },
    get: (key, expect) => {
      try {
        return decodeURIComponent(
          this.cookie.parser()[encodeURIComponent(key)]
        );
      } catch (error) {}
    },
    unset: key => {
      document.cookie =
        encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    },
    clear: () => {
      objectForIn(this.cookie.parser, this.cookie.unset);
    }
  };
}
