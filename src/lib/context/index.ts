import type { ServerResponse, IncomingMessage, IncomingHttpHeaders } from 'http'
import { type Socket } from 'net'
import { Writable } from 'stream'

export type CookieOptions = Record<string, any>

export interface Cookie {
	name: string
	value: string
	options: CookieOptions
}

export class Cookies {
	private request: IncomingMessage
	private response: ServerResponse
	private cookies: Record<string, any>

	constructor(request: IncomingMessage, response: ServerResponse) {
		this.request = request
		this.cookies = this.parseCookies()
		this.response = response
	}

	get(name: string): string | undefined {
		return this.cookies[name]
	}

	getValues() {
		return this.cookies
	}

	set(name: string, value: string, options?: CookieOptions): void
	set(cookie: Cookie): void
	set(cookies: Cookie[]): void
	set(name: string | Cookie | Cookie[], value?: string, options: CookieOptions = {}) {
		if (typeof name === 'string') {
			this.setOne(name, value as string, options)
		} else if (Array.isArray(name)) {
			for (const cookie of name) {
				this.setOne(cookie.name, cookie.value, cookie.options)
			}
		} else {
			this.setOne(name.name, name.value, name.options)
		}
	}

	private setOne(name: string, value: string, options: Record<string, any> = {}): void {
		const cookieOptions = { ...options, path: '/' }
		const cookie = `${name}=${value}; ${this.serializeOptions(cookieOptions)}`
		this.response.setHeader('Set-Cookie', cookie)
	}

	remove(name: string): void {
		this.setOne(name, '', { expires: new Date(0) })
	}

	private parseCookies(): Record<string, any> {
		const cookieHeader = this.request.headers.cookie ?? ''
		return cookieHeader.split(';').reduce((cookies, cookie) => {
			const [name, value] = cookie.trim().split('=')
			cookies[name] = value
			return cookies
		}, {})
	}

	private serializeOptions(options: Record<string, any>): string {
		return Object.entries(options)
			.map(([key, value]) => `${key}=${value}`)
			.join('; ')
	}
}

export class Request {
	raw: IncomingMessage
	method: string
	url: string
	headers: IncomingHttpHeaders

	protocol: string
	hostname: string
	path: string
	query: Record<string, string>
	params: Record<string, string>
	body: any
	socket: Socket

	constructor(request: IncomingMessage) {
		this.raw = request
		this.method = request.method ?? ''
		this.url = request.url ?? ''
		this.headers = request.headers ?? {}
		const parsedUrl = new URL(request.url ?? '', 'http://localhost')
		this.protocol = parsedUrl.protocol ?? ''
		this.hostname = parsedUrl.hostname ?? ''
		this.path = parsedUrl.pathname
		this.query = this.parseQueryString(request.url ?? '')
		this.params = {}
		this.socket = request.socket
	}

	private parseQueryString(url: string): Record<string, string> {
		const queryString = new URL(url, 'http://localhost').searchParams
		const query: Record<string, string> = {}
		queryString.forEach((value, key) => {
			query[key] = value
		})
		return query
	}
}

export class Response extends Writable {
	private response: ServerResponse

	constructor(response: ServerResponse) {
		super({
			write(chunk: any, encoding: BufferEncoding, callback?: (error?: Error | null) => void) {
				response.write(chunk, encoding, callback)
			},
		})
		this.response = response
	}

	status(code: number) {
		this.response.statusCode = code
		return this
	}

	redirect(pathname: string, status: number = 304) {
		this.status(status)
		this.setHeader('Location', pathname)
		this.end()
	}

	headersSent() {
		return this.response.headersSent
	}

	getHeaders() {
		return this.response.getHeaders()
	}

	setHeader(name: string, value: string | string[] | number) {
		this.response.setHeader(name.toLowerCase(), value)
		return this
	}

	send(body: string | Buffer) {
		if (!this.response.headersSent) {
			this.setHeader('Content-Type', 'text/plain')
		}

		this.write(body)
		this.end()
	}

	json(data: string | number | object) {
		if (!this.response.headersSent) {
			this.setHeader('Content-Type', 'application/json')
		}
		this.write(JSON.stringify(data))
		this.end()
	}

	end(cb?: (() => void) | undefined) {
		this.response.end(cb)
		return this
	}
}

export class Context {
	res: Response
	req: Request
	state: Record<string, any>
	cookies: Cookies
	pathname: string

	constructor(request: IncomingMessage, response: ServerResponse) {
		this.req = new Request(request)
		this.cookies = new Cookies(request, response)
		this.res = new Response(response)
		this.state = {}
	}
}
