import { type Route } from 'swifti'

export const GET: Route = ctx => {
	ctx.res.status(200).json({
		message: 'GET!',
	})
}
