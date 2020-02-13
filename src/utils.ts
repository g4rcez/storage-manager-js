export const isStr = (value: any) => typeof value === "string" || value instanceof String;

export const fnDate = (str: number | string) => {
	const date: any = new Date();
	return typeof str === "number" ? new Date(date * 1 + (str as number) * 864e5) : str;
};

export const map = (object: object, callback: any): void => {
	try {
		Object.keys(object).forEach((x) => callback(x));
	} catch (error) {
		window.console.log(error);
	}
};
