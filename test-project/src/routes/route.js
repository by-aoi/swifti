const { messages } = require('../common/messages.js')

module.exports.GET = async ctx => {
	if (ctx.req) throw new Error('Error message 02')
	ctx.res.json(messages)
}
