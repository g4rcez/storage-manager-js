const isObject = (value) => {
	return value && typeof value === 'object' && value.constructor === Object;
};

const isString = (value) => {
	return typeof value === 'string' || value instanceof String;
};

const objectForIn = (object, callback) => {
	try {
		Object.keys(object).map((item) => {
			return callback(item);
		});
	} catch (error) {}
};

const parseDateOrInteger = (string) => {
	const withInteger = new Date(new Date() * 1 + string * 864e5);
	return !!parseInt(string) ? withInteger : string;
};

const objectContains = (object, value) => {
	if (!isObject(object)) return false;
	return (
		Object.keys(object)
			.filter((item) => item === value)
			.toString() === value && isString(value)
	);
};

const storageOperator = (type, key = '', value = '') => {
	return {
		parser: () => {
			return window[type];
		},
		get: (key) => {
			return window[type][key];
		},
		set: (key, value) => {
			window[type].setItem(key, value);
		},
		unset: (key) => {
			window[type].removeItem(key);
		},
	};
};

export default class StorageManage {
	constructor(value = 'cookie') {
		this.options = {
			c: 'cookie',
			l: 'localstorage',
			s: 'sessionstorage',
			cookie: 'cookie',
			localstorage: 'localstorage',
			sessionstorage: 'sessionstorage',
		};
		this.cache;
		this.manage;
		Object.freeze(this.options);
		this.changeManager(value);
	}

	changeManager = (value) => {
		if (objectContains(this.options, value) && !!Storage) {
			this.manage = this.options[value.toLowerCase().trim()];
		} else {
			console.warn("Browser doesn't have support to Storage");
			this.manage = 'cookie';
		}
		this.cache = this[this.manage].parser();
	};

	get = (key, expect) => {
		let value = this[this.manage].get(key);
		try {
			return expect === 'raw' || expect === 'r'
				? value
				: expect === 'array' || expect === 'a'
					? value.split(',')
					: JSON.parse(value);
		} catch (error) {
			return value;
		}
	};

	set = (key, value, expires = '') => {
		this[this.manage].set(key, JSON.stringify(value), expires);
		this.cache = { ...cache, [key]: value };
	};

	unset = (key) => {
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

	json = () => {
		let parser = this[this.manage].parser(),
			json = {};
		Object.keys(parser).map((item) => {
			try {
				json = { ...json, [item]: JSON.parse(parser[item]) };
			} catch (error) {
				json = { ...json, [item]: parser[item] };
			}
			return undefined;
		});
		return json;
	};

	localstorage = {
		parser: () => {
			return storageOperator('localStorage').parser();
		},
		get: (key) => {
			return storageOperator('localStorage').get(key);
		},
		set: (key, value) => {
			storageOperator('localStorage').set(key, value);
		},
		unset: (key) => {
			try {
				storageOperator('localStorage').unset(key);
			} catch (error) {}
		},
		clear: () => {
			objectForIn(window.localStorage, this.localstorage.unset);
		},
	};

	sessionstorage = {
		parser: () => {
			return storageOperator('sessionStorage').parser();
		},
		get: (key) => {
			return storageOperator('sessionStorage').get(key);
		},
		set: (key, value) => {
			storageOperator('sessionStorage').set(key, value);
		},
		unset: (key) => {
			try {
				storageOperator('sessionStorage').unset(key);
			} catch (error) {}
		},
		clear: () => {
			objectForIn(window.sessionStorage, this.sessionstorage.unset);
		},
	};

	cookie = {
		parser: () => {
			const cookies = document.cookie ? document.cookie.split('; ') : [];
			if (cookies.length === 0) return;
			return cookies.map((value) => value.split('=')).reduce((cookieAccumulator, cookieValue) => {
				cookieAccumulator[decodeURIComponent(cookieValue[0])] = decodeURIComponent(cookieValue[1]);
				return cookieAccumulator;
			}, {});
		},
		set: (key, value, parameters) => {
			let path = parameters.path || '';
			let domain = parameters.domain || '';
			let expires = parseDateOrInteger(parameters.expires) || '';
			const query = `${encodeURIComponent(key)}=${encodeURIComponent(
				value,
			)}; expires=${expires}; path='${path}'; domain='${domain}'`;
			document.cookie = query;
		},
		get: (key, expect) => {
			try {
				return decodeURIComponent(this.cache[encodeURIComponent(key)]);
			} catch (error) {}
		},
		unset: (key) => {
			document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		},
		clear: () => {
			objectForIn(this.cookie.parser(), this.cookie.unset);
		},
	};
}
