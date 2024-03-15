module.exports.GET = async ctx => {
	const { userId } = ctx.req.params
	ctx.res.json({
		user: {
			id: userId,
			name: 'Aoi',
		},
	})
}
