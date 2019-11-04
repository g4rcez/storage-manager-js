export const isStr = (value: any) => typeof value === "string" || value instanceof String;

export const fnDate = (str: any) => {
	const date: any = new Date();
	const integer = new Date(date * 1 + str * 864e5);
	return !!parseInt(str, 10) ? integer : str;
};

export const map = (object: object, callback: any): void => {
	try {
		Object.keys(object).forEach((x) => callback(x));
	} catch (error) {
		window.console.log(error);
	}
};
