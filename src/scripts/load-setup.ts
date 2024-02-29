import fs from "fs-extra";
import { config } from "./read-config";
import { SETUP_FILE_DIR } from "../utils/consts";
import { esmRequire } from "../utils/esm";

export async function loadSetup() {
  const { format = "cjs" } = config;
  const exists = await fs.exists(SETUP_FILE_DIR);
  if (!exists) return null;
  const setupFile = await esmRequire(SETUP_FILE_DIR);
  const setup = setupFile.default ?? setupFile;
  if (typeof setup !== "function") return null;
  if (format === "esm") return 'import setup from "./setup.js"';
  return 'const setup = require("./setup.js")';
}
