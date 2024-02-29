import { createImport } from "../utils/import";
import { RouteDetails } from "./find-routes";
import path from "path";
import { esmRequire } from "../utils/esm";
import { Middleware } from "../main";

const invalidDirectories: string[] = [];

export interface MiddlewareData {
  import: string;
  directory: string;
  name: string;
}

export async function createMiddlewareImport(
  middlewares: MiddlewareData[],
  directory: string
): Promise<void> {
  if (invalidDirectories.includes(directory)) return;
  const middlewaresIsImported = middlewares.find(
    (m) => m.directory === directory
  );
  if (middlewaresIsImported) return;
  const content = await esmRequire(path.join(directory, "middlewares.js"));
  const middlewareContent = content.default ? content.default : content;
  const hasMiddlewares = Array.isArray(middlewareContent);
  if (!hasMiddlewares) {
    invalidDirectories.push(directory);
    return;
  }
  const middlewareImport = createImport(directory, "middlewares.js");
  middlewares.push({
    import: middlewareImport.imp,
    directory,
    name: middlewareImport.name,
  });
}

export async function createMiddlewares(
  middlewares: MiddlewareData[],
  routeDetails: RouteDetails
): Promise<any> {
  for (const directory of routeDetails.middlewares) {
    await createMiddlewareImport(middlewares, directory);
  }
  return middlewares.map((middleware) => {
    return `IMPORT{...(${middleware.name}.default ? ${middleware.name}.default : ${middleware.name})}`;
  });
}
