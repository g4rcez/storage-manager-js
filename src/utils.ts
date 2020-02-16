export const map = (object: object, callback: any): void => {
	try {
		Object.keys(object).forEach((x) => callback(x));
	} catch (error) {
		window.console.log(error);
	}
};
