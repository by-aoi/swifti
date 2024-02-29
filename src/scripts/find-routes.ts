import fs from "fs-extra";
import path from "path";

import { ROUTES_DIR } from "../utils/consts";

export interface RouteDetails {
  pathname: string[];
  directory: string;
  middlewares: string[];
}

function getFilePathname(pathname: string) {
  return pathname.replace(ROUTES_DIR, "").replace(/\\/g, "/").toLowerCase();
}

function createParts(pathname: string) {
  const parts = getFilePathname(pathname).split("/").slice(1);
  if (parts.length === 0) return [""];
  return parts;
}

export async function findRoutes(
  routes: RouteDetails[] = [],
  directory: string = ROUTES_DIR,
  middlewares: string[] = []
) {
  const files = await fs.readdir(directory);
  if (files.includes("middlewares.js")) middlewares.push(directory);
  for (const filename of files) {
    const filePathname = path.join(directory, filename);
    const file = await fs.stat(filePathname);
    if (file.isDirectory()) {
      await findRoutes(routes, filePathname, middlewares);
      continue;
    }
    if (filename !== "route.js") continue;
    const pathname = createParts(directory);
    routes.push({
      pathname,
      directory,
      middlewares,
    });
  }
}
