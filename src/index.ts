const isObject = value => {
	return value && typeof value === 'object' && value.constructor === Object;
};

const isString = value => {
	return typeof value === 'string' || value instanceof String;
};

const objectForIn = (object, callback) => {
	try {
		Object.keys(object).map(item => {
			return callback(item);
		});
	} catch (error) {}
};

const parseDateOrInteger = string => {
	let date: any = new Date();
	const withInteger: Date = new Date(date * 1 + string * 864e5);
	return !!parseInt(string) ? withInteger : string;
};

const objectContains = (object, value) => {
	if (!isObject(object)) return false;
	return (
		Object.keys(object)
			.filter(item => item === value)
			.toString() === value && isString(value)
	);
};

let cache = {};

const storageOperator = (type, key = '', value = '') => {
	return {
		parser: () => {
			return window[type];
		},
		get: key => {
			return window[type][key];
		},
		set: (key, value) => {
			window[type][key] = value;
		},
		unset: key => {
			window[type].removeItem(key);
		},
	};
};

const operator = {
	localstorage: {
		parser: () => {
			return storageOperator('localStorage').parser();
		},
		get: key => {
			return storageOperator('localStorage').get(key);
		},
		set: (key, value) => {
			storageOperator('localStorage').set(key, value);
		},
		unset: key => {
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
		get: key => {
			return storageOperator('sessionStorage').get(key);
		},
		set: (key, value) => {
			storageOperator('sessionStorage').set(key, value);
		},
		unset: key => {
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
			return cookies.map(value => value.split('=')).reduce((cookieAccumulator, cookieValue) => {
				cookieAccumulator[decodeURIComponent(cookieValue[0])] = decodeURIComponent(cookieValue[1]);
				return cookieAccumulator;
			}, {});
		},
		set: (key, val, parameters = { expires: '' }) => {
			let exp = parseDateOrInteger(parameters.expires) || '';
			!!exp
				? (document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(val)};expires="${exp}";`)
				: (document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
		},
		get: (key, expect) => {
			return cache[key];
		},
		unset: key => {
			document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			cache[key] = undefined;
		},
		clear: () => {
			objectForIn(operator.cookie.parser(), operator.cookie.unset);
			cache = {};
		},
	},
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
	if (!!Storage) {
		manager = managers[manager.toLowerCase()] || 'cookie';
	} else {
		console.warn("Browser doesn't have support to Storage");
		manager = 'cookie';
	}

	return Object.freeze({
		changeManager,
		get,
		set,
		unset,
		clear,
		clearAll,
		// Alias for Get
		item: get,
		getItem: get,
		cat: get,
		// Alias for set
		create: set,
		setItem: set,
		touch: set,
		// Alias for unset
		delete: unset,
		remove: unset,
		rm: unset,
		// Alias for clearAll
		purge: clearAll,
		json,
	});

	function json() {
		let parser = operator[manager].parser(),
			json = {};
		Object.keys(parser).map(item => {
			try {
				json = { ...json, [item]: JSON.parse(parser[item]) };
			} catch (error) {
				json = { ...json, [item]: parser[item] };
			}
		});
		return json;
	}

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
				: expect === 'array' || expect === 'a'
					? value.split(',')
					: JSON.parse(value);
		} catch (error) {
			return value;
		}
	}

	function set(key, value, expires = '') {
		operator[manager].set(key, JSON.stringify(value), expires);
		cache = { ...cache, [key]: value };
	}

	function unset(key) {
		operator[manager].unset(key);
	}

	function clear() {
		operator[manager].clear();
	}

	function clearAll() {
		['cookie', 'localstorage', 'sessionstorage'].forEach(x => operator[x].clear());
	}
}
