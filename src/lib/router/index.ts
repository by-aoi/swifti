import { type Middleware } from "../middlewares";
import { type Route } from "../routes";

export interface RouteMethods {
  GET?: Route;
  POST?: Route;
  OPTIONS?: Route;
  PATCH?: Route;
  DELETE?: Route;
  PUT?: Route;
}

export interface RouteData {
  pathname: string[];
  middlewares: Middleware[];
  methods: RouteMethods;
}

export class Router {
  readonly routes: RouteData[];

  constructor(routes: RouteData[]) {
    this.routes = this.sortRoutes(routes);
  }

  private sortRoutes(routes: RouteData[]): RouteData[] {
    return routes.sort((a, b) => {
      const aPathnameScore = this.getPathnameScore(a.pathname);
      const bPathnameScore = this.getPathnameScore(b.pathname);

      if (aPathnameScore !== bPathnameScore) {
        return aPathnameScore - bPathnameScore;
      }
      return 0;
    });
  }

  private getPathnameScore(pathname: string[]): number {
    let score = 0;
    for (const part of pathname) {
      if (part.includes("[")) {
        score += part.includes("...") ? 2 : 1;
      }
    }
    return score;
  }

  private getUrlParts(url: string) {
    const parts = url.split("/").slice(1);
    return parts;
  }

  private hasBrackeds(routePart: string) {
    return routePart.startsWith("[") && routePart.endsWith("]");
  }

  private removeBrackeds(routePart: string) {
    return routePart.substring(1, routePart.length - 1);
  }

  private getDinamicRoutePathname(routePart: string) {
    return this.removeBrackeds(routePart).replace("...", "");
  }

  private isDinamicRoute(routePart: string) {
    const hasBrackeds = this.hasBrackeds(routePart);
    if (!hasBrackeds) return false;
    return routePart.startsWith("[...");
  }

  private isParamsRoute(routePart: string) {
    const hasBrackeds = this.hasBrackeds(routePart);
    if (!hasBrackeds) return false;
    return !routePart.startsWith("[...");
  }

  private mathPathname(
    routeParts: string[],
    urlParts: string[],
    params: Record<string, string>
  ) {
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const urlPart = urlParts[i];
      if (routePart === urlPart) continue;
      if (this.isParamsRoute(routePart)) {
        const paramsName = this.removeBrackeds(routePart);
        params[paramsName] = urlPart;
        continue;
      }
      if (this.isDinamicRoute(routePart)) {
        const name = this.getDinamicRoutePathname(routePart);
        if (name === urlPart) continue;
      }
      return false;
    }
    return true;
  }

  async find(url: string, params: Record<string, string>) {
    url = url.split("?")[0];
    const urlParts = this.getUrlParts(url);
    const currentRoutes = this.routes.filter(
      (route) => route.pathname.length === urlParts.length
    );
    if (currentRoutes.length === 0) return null;
    for (const route of currentRoutes) {
      const { pathname } = route;
      const math = this.mathPathname(pathname, urlParts, params);
      if (math) return route;
    }
    return null;
  }
}
