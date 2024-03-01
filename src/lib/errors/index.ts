import { type Context } from '../context'

export class SwiftiError extends Error {
	readonly data: string | object
	readonly status: number

	constructor({ message, status, data }: { message: string; status: number; data?: string | object }) {
		super(message)
		this.status = status ?? 500
		if (data) this.data = data
	}

	write(ctx: Context) {
		ctx.res.status(this.status)
		if (typeof this.data === 'object') {
			ctx.res.json(this.data)
			return
		}
		ctx.res.send(this.data)
	}
}
