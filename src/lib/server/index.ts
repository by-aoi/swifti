import http from 'http'
import chalk from 'chalk'
import { Router, type RouteData } from '../router'
import { Context } from '../context'
import { Messages } from '../../core/lib/messages'
import { Middleware } from '../middlewares'
import { SwiftiError } from '../errors'
import { type AssetsOptions, assets } from '../assets'

export enum Method {
	'GET' = 'GET',
	'POST' = 'POST',
	'OPTIONS' = 'OPTIONS',
	'PATCH' = 'PATCH',
	'DELETE' = 'DELETE',
	'PUT' = 'PUT',
}

export interface ServerConfig {
	port: number | string
	assets?: AssetsOptions
	logs?: boolean
}

export function createServer(routes: RouteData[], config: ServerConfig) {
	const router = new Router(routes)

	async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
		const method = req.method as Method
		let { url = '/' } = req
		if (url !== '/' && url.endsWith('/')) url = url.substring(0, url.length - 1)

		const ctx = new Context(req, res)

		if (config.logs) {
			const start = Date.now()
			res.on('close', () => {
				Messages.log({
					method: ctx.req.method,
					status: res.statusCode,
					url: ctx.req.url,
					start,
					end: Date.now(),
				})
			})
		}

		if (config.assets) {
			const sent = await assets(ctx, config.assets)
			if (sent) return
		}

		const route = await router.find(url, ctx.req.params)

		if (!route) {
			ctx.res.status(404).json({
				status: 404,
				message: 'Not found',
			})
			return
		}

		const routeHandle = route.methods[method]

		if (!routeHandle) {
			ctx.res.status(404).json({
				status: 405,
				message: 'Method not allowed',
			})
			return
		}

		try {
			async function execMiddlewares(middlewares: Middleware[]) {
				if (Array.isArray(middlewares)) {
					for (const middleware of middlewares) {
						if (Array.isArray(middleware)) await execMiddlewares(middleware)
						if (!(middleware instanceof Middleware)) continue
						await middleware.exec(ctx)
						if (ctx.res.headersSent()) break
					}
				}
			}
			await execMiddlewares(route.middlewares)
			await routeHandle(ctx)
		} catch (error) {
			if (error instanceof SwiftiError) {
				error.write(ctx)
				return
			}
			if (typeof route.errorHandle === 'function') {
				try {
					await route.errorHandle(ctx, error)
				} catch (error) {
					Messages.error('Error in error handle function', error)
					ctx.res.status(500).json({
						message: 'Internal error',
						statusCode: 500,
					})
				}
				return
			}
			Messages.error('Error in route function', error)
			ctx.res.status(500).json({
				message: 'Internal error',
				statusCode: 500,
			})
		}
	}

	const server = http.createServer(handleRequest)
	server.listen(config.port, () => {
		Messages.server(`server started on ${chalk.cyan(`http://localhost:${config.port}/`)}`)
	})
}
