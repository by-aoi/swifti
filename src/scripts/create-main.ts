import fs from "fs-extra";
import { config } from "./read-config";
import { loadSetup } from "./load-setup";
import { MAIN_FILE_DIR } from "../utils/consts";

export async function createMainFile() {
  const { port = 3000, format = "cjs" } = config;
  const importRoutes =
    format === "esm"
      ? 'import { routes } from "./routes.js"'
      : 'const { routes } = require("./routes.js")';
  const importSwifti =
    format === "esm"
      ? 'import * as swifti from "swifti"'
      : 'const swifti = require("swifti")';
  const setup = await loadSetup();

  const createServerText = `async function main() {${
    setup ? "\nawait setup.default ? setup.default() : setup()" : ""
  }\nswifti.createServer(routes, { port: process.env.PORT ?? ${port} });\n}`;
  const startMainFunction = "main()";

  const content = `${importRoutes}\n${importSwifti}${
    setup ? `\n${setup}` : ""
  }\n${createServerText}\n${startMainFunction}`;

  await fs.writeFile(MAIN_FILE_DIR, content, "utf-8");
}
