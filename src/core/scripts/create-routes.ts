import { nanoid } from 'nanoid'
import { type RouteData } from './find-routes'

import { type RouteData as RouterRouteData } from '../../lib/router'

import fs from 'fs-extra'
import { CACHE_PATH, CACHE_ROUTES_PATH, ROUTES_PATH } from '../lib/consts'
import { createImport } from '../lib/create-import'

export interface RouteObjectData extends RouteData {
	uniqueId: string
	import: string
}

export async function createPathname(pathname: string) {
	pathname = pathname
		.replace(ROUTES_PATH, '')
		.replace(/\\/g, '/')
		.replace('route.js', '')
		.replace('route.ts', '')
	if (pathname !== '/') pathname = pathname.replace(/\/$/, '')
	return pathname
}

function createFileContent(routes: RouterRouteData[], imports: string[]) {
	const routesString = JSON.stringify(routes)
		.replace(/"IMPORT\{([^"]+)\}"/g, '$1')
		.replace(/\\\\\//g, '\\/')
	const content = `${imports.join('\n')}\nexport default ${routesString}`
	return content
}

function createRouteObjects(routes: RouteData[]) {
	const routeObjects: RouteObjectData[] = []
	for (const route of routes) {
		const uniqueId = `x${nanoid(52).replace(/-/g, '')}`
		routeObjects.push({
			...route,
			import: createImport(route.pathname, uniqueId),
			uniqueId,
		})
	}
	return routeObjects
}

function createMiddlewareImports(route: RouteData, imports: string[]) {
	for (const middleware of route.middlewares) {
		if (imports.includes(middleware.import)) continue
		imports.push(middleware.import)
	}
	return route.middlewares.map(m => m.uniqueId)
}

export async function createRoutes(routes: RouteData[]) {
	await fs.ensureDir(CACHE_PATH)
	const routeObjects = createRouteObjects(routes)
	const imports = routeObjects.map(route => route.import)
	const data: RouterRouteData[] = []
	for (const route of routeObjects) {
		const middlewares = createMiddlewareImports(route, imports)
		const errorHandle = route.errorHandle ? (`IMPORT{${route.errorHandle.uniqueId}}` as any) : undefined
		if (route.errorHandle && !imports.includes(route.errorHandle.import))
			imports.push(route.errorHandle.import)
		data.push({
			matcher: `IMPORT{${route.matcher}}` as any,
			pathname: await createPathname(route.pathname),
			middlewares: `IMPORT{[${middlewares.join(',')}]}` as any,
			isDynamic: route.isDynamic,
			methods: `IMPORT{${route.uniqueId}}` as any,
			errorHandle,
		})
	}
	const content = createFileContent(data, imports)
	await fs.writeFile(CACHE_ROUTES_PATH, content, 'utf-8')
}
