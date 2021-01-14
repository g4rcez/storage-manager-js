export const map = (object: object, callback: (x: string) => void): void => {
	try {
		Object.keys(object).forEach(callback);
	} catch (error) {
		window.console.log(error);
	}
};

export const isNil = <T>(item: T) => item === null || item === undefined;
