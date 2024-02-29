import { nanoid } from "nanoid";
import { config } from "../scripts/read-config";
import { SWIFTI_DIR } from "./consts";

export function createImport(directory: string, filename: string) {
  const { format = "cjs" } = config;
  const name = `x${nanoid(80).replace(/-/g, "")}`;
  let imp: string = "";
  const url = `.${directory
    .replace(SWIFTI_DIR, "")
    .replace(/\\/g, "/")}/${filename}`;
  if (format === "esm") imp = `import * as ${name} from "${url}"`;
  else imp = `const ${name} = require("${url}")`;
  return { imp, name };
}
