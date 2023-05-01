import { createStorage } from "./storage";

const LocalStorage = createStorage(window.localStorage);

export default LocalStorage;
