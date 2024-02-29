import { type Context } from '../context'

export type MatcherFunction = (url: string) => Promise<boolean> | boolean

export class Middleware {
	private callback: (ctx: Context, next: () => void) => Promise<void> | void
	private options: {
		matcher?: (string | RegExp | MatcherFunction)[]
	}

	constructor(
		callback: (ctx: Context, next: () => void) => Promise<void> | void,
		options: {
			matcher?: (string | RegExp | MatcherFunction)[]
		} = {}
	) {
		this.options = options
		this.callback = callback
	}

	private async mathUrl(url: string): Promise<boolean> {
		if (!this.options.matcher) return true
		const exists = this.options.matcher.includes(url)
		if (exists) return true
		for (const matcherUrl of this.options.matcher) {
			if (typeof matcherUrl === 'string') continue
			if (matcherUrl instanceof RegExp) {
				const valid = matcherUrl.test(url)
				if (valid) return true
				continue
			}
			const valid = await matcherUrl(url)
			if (valid) return true
		}
		return false
	}

	async exec(ctx: Context) {
		return await new Promise(async (resolve, reject) => {
			const next = () => {
				resolve(null)
			}
			const urlMath = await this.mathUrl(ctx.req.url)
			if (!urlMath) {
				next()
				return
			}
			try {
				this.callback(ctx, next)
			} catch (error) {
				reject(error)
			}
		})
	}
}
