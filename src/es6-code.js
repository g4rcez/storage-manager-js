const isObject = value => {
	return value && typeof value === 'object' && value.constructor === Object;
};

const objectForIn = (object, callback) => {
	try {
		Object.keys(object).map(item => {
			callback(item);
		});
	} catch (error) {}
};

const storageOperator = (type, key = '', value = '') => {
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
	constructor(managementType = 'cookie') {
		let options = {
			l: 'localstorage',
			s: 'sessionstorage',
			c: 'cookie',
			cookie: 'cookie',
			localstorage: 'localstorage',
			sessionstorage: 'sessionstorage'
		};
		this.manage = options[managementType.toLowerCase().trim()];
	}

	parser = () => {
		return this[this.manage].parser();
	};

	get = (key, expect) => {
		let value = this[this.manage].get(key);
		try {
			return expect === 'raw' || expect === 'r'
				? value
				: expect === 'array' || expect === 'a' ? value.split(',') : JSON.parse(value);
		} catch (error) {
			return value;
		}
	};

	set = (key, value) => {
		if (isObject(value)) value = JSON.stringify(value);
		if (Array.isArray(value) && isObject(value[0])) value = JSON.stringify(value);
		this[this.manage].set(key, value);
	};

	unset = key => {
		this[this.manage].unset(key);
	};

	clear = () => {
		this[this.manage].clear();
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

	changeStruct = value => {
		this.manage = value.toLowerCase().trim();
	};

	localstorage = {
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
			objectForIn(window.localStorage, this.localstorage.unset);
		}
	};

	sessionstorage = {
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
			objectForIn(window.sessionStorage, this.sessionstorage.unset);
		}
	};

	cookie = {
		parser: () => {
			let cookies = document.cookie ? document.cookie.split('; ') : [];
			if (cookies.length === 0) return;
			return cookies.map(value => value.split('=')).reduce((cookieItem, cookieValue) => {
				cookieItem[decodeURIComponent(cookieValue[0].trim())] = decodeURIComponent(cookieValue[1].trim());
				return cookieItem;
			}, {});
		},
		set: (key, value) => {
			document.cookie = this.cookie.serializeCookie(key, value);
		},
		get: (key, expect) => {
			try {
				return decodeURIComponent(this.cookie.parser()[encodeURIComponent(key)]);
			} catch (error) {}
		},
		serializeCookie: (key, value) => {
			return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
		},
		unset: key => {
			document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		},
		clear: () => {
			objectForIn(this.parser(), this.cookie.unset);
		}
	};
}
