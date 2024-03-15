module.exports.GET = async ctx => {
	const { userId, taskId, msgId } = ctx.req.params
	if (ctx.req) throw new Error('Task messages not found.')
	ctx.res.json({
		user: {
			userId,
			taskId,
			msgId,
		},
	})
}
