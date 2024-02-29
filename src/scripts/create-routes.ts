import fs from "fs-extra";

import { RouteDetails } from "./find-routes";
import { RouteData } from "../lib/router";
import { createImport } from "../utils/import";
import { MiddlewareData, createMiddlewares } from "./create-middlewares";
import { config } from "./read-config";
import { ROUTES_FILE_DIR } from "../utils/consts";

function createRoutesContent(routes: RouteData[], imports: string[]) {
  const { format = "cjs" } = config;
  const routesString = JSON.stringify(routes).replace(
    /"IMPORT\{([^"]+)\}"/g,
    "$1"
  );
  let content = `${imports.join("\n")}\n${
    format === "esm" ? "export const routes" : "module.exports.routes"
  } = ${routesString}`;
  return content;
}

export async function createRoutes(routesDetails: RouteDetails[]) {
  const imports: string[] = [];
  const middlewares: MiddlewareData[] = [];
  const routes: RouteData[] = [];
  for (const routeDetails of routesDetails) {
    const fileImport = createImport(routeDetails.directory, "route.js");
    imports.push(fileImport.imp);
    routes.push({
      pathname: routeDetails.pathname,
      middlewares: await createMiddlewares(middlewares, routeDetails),
      methods: `IMPORT{${fileImport.name}}` as any,
    });
  }
  middlewares.forEach((middleware) => {
    imports.push(middleware.import);
  });
  const content = createRoutesContent(routes, imports);
  await fs.writeFile(ROUTES_FILE_DIR, content, "utf-8");
}
