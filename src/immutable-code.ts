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
	let date: any = new Date();
	const withInteger: any = new Date(date * 1 + string * 864e5);
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

const allAreObjects = (array) => {
	if (Array.isArray(array)) {
		array.map((item) => {
			if (!isObject(item)) return false;
		});
		return true;
	}
	return false;
};

let cache = {};

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

const operator = {
	localstorage: {
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
			objectForIn(window.localStorage, operator.localstorage.unset);
		},
	},
	sessionstorage: {
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
			objectForIn(window.sessionStorage, operator.sessionstorage.unset);
		},
	},
	cookie: {
		parser: () => {
			const cookies = document.cookie ? document.cookie.split('; ') : [];
			if (cookies.length === 0) return;
			return cookies.map((value) => value.split('=')).reduce((cookieAccumulator, cookieValue) => {
				cookieAccumulator[decodeURIComponent(cookieValue[0])] = decodeURIComponent(cookieValue[1]);
				return cookieAccumulator;
			}, {});
		},
		set: (key, value, parameters = { path: '', domain: '', expires: '' }) => {
			let path;
			let domain;
			let expires;
			try {
				path = parameters.path || '';
				domain = parameters.domain || '';
				expires = parseDateOrInteger(parameters.expires.toString()) || '';
			} catch (error) {}
			document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; expires=${expires}; path='${path}'`;
			cache = {
				...cache,
				[key]: value,
			};
		},
		get: (key, expect) => {
			try {
				return decodeURIComponent(cache[encodeURIComponent(key)]);
			} catch (error) {}
		},
		unset: (key) => {
			document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			cache[key] = undefined;
		},
		clear: () => {
			objectForIn(operator.cookie.parser(), operator.cookie.unset);
			cache = {};
		},
	},
};
// * TODO: compare a object if one equal exists
const isEqual = (left, right) => {
	const lengthObjects: Boolean = Object.keys(left).length === Object.keys(right).length;
	if (!lengthObjects) return false;
	const arrayOfTruth: Array<Boolean> = Object.keys(left).map((itemLeft) => {
		return left[itemLeft] === right[itemLeft];
	});
	return arrayOfTruth.filter(Boolean).length === Object.keys(left).length;
};

export default function StorageManage(manager) {
	const managers = Object.freeze({
		c: 'cookie',
		l: 'localstorage',
		s: 'sessionstorage',
		cookie: 'cookie',
		localstorage: 'localstorage',
		sessionstorage: 'sessionstorage',
	});

	manager = managers[manager.toLowerCase()] || 'cookie';

	return Object.freeze({
		changeManager,
		get,
		set,
		unset,
		clear,
		clearAll,
	});

	function changeManager(value) {
		if (objectContains(managers, value)) {
			manager = managers[value.toLowerCase().trim()];
		} else {
			manager = 'cookie';
		}
		cache = operator[manager].parser();
	}

	function get(key, expect) {
		let value = operator[manager].get(key);
		try {
			return expect === 'raw' || expect === 'r'
				? value
				: expect === 'array' || expect === 'a' ? value.split(',') : JSON.parse(value);
		} catch (error) {
			return value;
		}
	}

	function set(key, value, expires = '') {
		let objects;
		if (cache !== {}) {
			objects = cache;
		} else {
			objects = operator[manager].parser();
		}
		for (var object in objects) {
			if (isEqual(value, JSON.parse(objects[object]))) {
				console.warn('Object value already exists >_', key, value);
				return;
			}
		}
		if (isObject(value)) value = JSON.stringify(value);
		if (Array.isArray(value) && allAreObjects(value)) value = JSON.stringify(value);
		operator[manager].set(key, value, expires);
	}

	function unset(key) {
		operator[manager].unset(key);
	}

	function clear() {
		operator[manager].clear();
	}

	function clearAll() {
		operator.cookie.clear();
		operator.localstorage.clear();
		operator.sessionstorage.clear();
	}

	function json(key) {
		try {
			return JSON.parse(operator[manager].get(key));
		} catch (error) {
			return {
				[key]: operator[manager].get(key),
			};
		}
	}
}
