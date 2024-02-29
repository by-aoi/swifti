import esbuild from "esbuild";
import fs from "fs-extra";

import { MAIN_FILE_DIR, SWIFTI_DIR } from "../utils/consts";
import { config } from "./read-config";

export async function buildProject() {
  const { bundle = true, outdir = "dist", format = "cjs" } = config;
  await fs.remove(outdir);
  await esbuild.build({
    entryPoints: [bundle ? MAIN_FILE_DIR : `${SWIFTI_DIR}/**`],
    outdir,
    platform: "node",
    format,
    bundle,
  });
}
