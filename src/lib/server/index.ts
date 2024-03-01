import http from 'http'
import chalk from 'chalk'
import { Router, type RouteData } from '../router'
import { Context } from '../context'
import { Messages } from '../../utils/messages'
import { Middleware } from '../middlewares'
import { SwiftiError } from '../errors'

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
}

export function createServer(routes: RouteData[], config: ServerConfig) {
	const router = new Router(routes)

	async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
		const method = req.method as Method
		let { url = '/' } = req
		if (url !== '/' && url.endsWith('/')) url = url.substring(0, url.length - 1)

		const ctx = new Context(req, res)

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
			for (const middleware of route.middlewares ?? []) {
				if (!(middleware instanceof Middleware)) continue
				await middleware.exec(ctx)
				if (ctx.res.headersSent()) return
			}
			await routeHandle(ctx)
		} catch (error) {
			if (error instanceof SwiftiError) {
				error.write(ctx)
				return
			}
			Messages.error('invalid route function')
			ctx.res.status(404).json({
				status: 500,
				message: 'Internal error',
			})
		}
	}

	const server = http.createServer(handleRequest)
	server.listen(config.port, () => {
		Messages.server(`server started on ${chalk.cyan(`localhost:${config.port}`)}`)
	})
}
