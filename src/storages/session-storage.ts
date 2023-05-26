import type { TypeStorage } from "../types";
import { createStorage } from "./storage";

const SessionStorage: TypeStorage = createStorage(() => window.sessionStorage);

export default SessionStorage;
