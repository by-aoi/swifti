import { matchUrl } from '../../core/scripts/find-routes'
import { type Context } from '../context'
import { type Middleware } from '../middlewares'
import { type Route } from '../routes'

export interface RouteMethods {
	GET?: Route
	POST?: Route
	OPTIONS?: Route
	PATCH?: Route
	DELETE?: Route
	PUT?: Route
}

export interface RouteData {
	matcher: RegExp
	pathname: string
	middlewares: Middleware[]
	errorHandle?: (ctx: Context, error: any) => Promise<void> | void
	isDynamic: boolean
	methods: RouteMethods
}

export class Router {
	readonly routes: RouteData[]

	constructor(routes: RouteData[]) {
		this.routes = this.sortRoutes(routes)
	}

	private sortRoutes(routes: RouteData[]): RouteData[] {
		return routes.sort((a, b) => {
			const aValue = a.isDynamic
			const bValue = b.isDynamic
			return !aValue && bValue ? -1 : aValue && !bValue ? 1 : 0
		})
	}

	async find(url: string, params: Record<string, string>): Promise<RouteData | null> {
		url = url.split('?')[0]
		for (const route of this.routes) {
			const matchResult = await matchUrl(route, url, params)
			if (!matchResult) continue
			return route
		}
		return null
	}
}
