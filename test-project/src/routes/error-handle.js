module.exports = function errorHandle(ctx, error) {
	console.log(error)
	ctx.res.status(500).json({
		message: error.message,
		statusCode: 500,
	})
}
