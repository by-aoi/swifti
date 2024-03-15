module.exports.GET = async ctx => {
	const { userId, taskId } = ctx.req.params
	console.log(ctx.req.params)
	ctx.res.json({
		user: {
			userId,
			taskId,
		},
	})
}
