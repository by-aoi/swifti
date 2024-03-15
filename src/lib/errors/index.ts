import { type Context } from '../context'

export interface SwiftiErrorOptions extends Record<string, any> {
	message: string
	status: number
}

export class SwiftiError extends Error {
	readonly data: Record<string, any>
	readonly status: number

	constructor({ message, status }: SwiftiErrorOptions) {
		super(message)
		this.status = status ?? 500
	}

	write(ctx: Context) {
		ctx.res.status(this.status).json({
			message: this.message,
			...this.data,
		})
	}
}
