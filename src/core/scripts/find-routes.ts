import fs from 'fs-extra'
import path from 'path'

import { createPathname } from './create-routes'
import { createImport } from '../lib/create-import'
import { nanoid } from 'nanoid'
import { PROJECT_PATH } from '../lib/consts'

export interface FileImport {
	uniqueId: string
	import: string
}

export interface RouteData {
	matcher: RegExp
	isDynamic: boolean
	errorHandle?: FileImport
	middlewares: FileImport[]
	pathname: string
}

const allowRouteFile = ['route.js', 'route.ts']
const allowErrorHandleFile = ['error-handle.js', 'error-handle.ts']
const allowMiddlewaresFile = ['middlewares.js', 'middlewares.ts']

export async function isDynamicPathname(pathname) {
	return /\[.*\]/.test(pathname)
}

export async function createMatcher(pathname: string) {
	pathname = await createPathname(pathname)
	const isDynamic = await isDynamicPathname(pathname)

	if (pathname === '/') return { matcher: new RegExp('^/$'), isDynamic }

	pathname = pathname.replace(/[^a-zA-Z0-9_\-\/\[\]\.]/g, '')

	const regExpString = pathname
		.replace(/\[\.\.\..*?\]/g, match => {
			const name = match.substring(4, match.length - 1)
			return `${name}.*`
		})
		.replace(/\[.*?\]/g, '[^/]+')

	const matcher = new RegExp(`^${regExpString}$`)

	return { matcher, isDynamic }
}

function getPathnames(pathname: string) {
	const regex = /\[(.*?)\]/g
	const names: { name: string; position: number }[] = []
	let match: RegExpExecArray | null

	while ((match = regex.exec(pathname)) != null) {
		const position = pathname.substring(1, match.index).split('/').length - 1
		names.push({
			name: match[1],
			position,
		})
	}

	return names
}

export async function findSetup() {
	const files = await fs.readdir(PROJECT_PATH)
	let filename: string | null = null
	if (files.includes('setup.js')) filename = 'setup.js'
	if (files.includes('setup.ts')) filename = 'setup.ts'
	if (!filename) return null
	const uniqueId = `x${nanoid(52).replace(/-/g, '')}`
	return {
		import: createImport(path.join(PROJECT_PATH, filename), uniqueId),
		uniqueId,
	}
}

export async function matchUrl(
	route: {
		matcher: RegExp
		isDynamic: boolean
		pathname: string
	},
	url: string,
	params: Record<string, string>
): Promise<boolean> {
	const match = route.matcher.test(url)

	if (!match) return false

	if (route.isDynamic) {
		const names = getPathnames(route.pathname)
		const parts = url.split('/').slice(1)

		names.forEach(part => {
			params[part.name] = parts[part.position]
		})
	}

	return true
}

export async function findRoutes(
	directory: string,
	routes: RouteData[],
	middlewares: FileImport[] = [],
	errorHandle?: FileImport
) {
	const files = await fs.readdir(directory)
	for (const filename of files) {
		const pathname = path.join(directory, filename)
		const file = await fs.stat(pathname)
		const isDirectory = file.isDirectory()
		if (!isDirectory && allowErrorHandleFile.includes(filename)) {
			const uniqueId = `x${nanoid(52).replace(/-/g, '')}`
			errorHandle = {
				import: createImport(pathname, uniqueId),
				uniqueId,
			}
			continue
		}
		if (!isDirectory && allowMiddlewaresFile.includes(filename)) {
			const uniqueId = `x${nanoid(52).replace(/-/g, '')}`
			middlewares.push({
				import: createImport(pathname, uniqueId),
				uniqueId,
			})
			continue
		}
		if (!isDirectory && allowRouteFile.includes(filename)) {
			const { matcher, isDynamic } = await createMatcher(pathname)
			routes.push({
				matcher,
				isDynamic,
				middlewares,
				errorHandle,
				pathname,
			})
			continue
		}
		if (isDirectory) {
			await findRoutes(pathname, routes, middlewares, errorHandle)
			continue
		}
	}
}
