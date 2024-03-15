const { messages } = require('../../common/messages.js')

module.exports.GET = async ctx => {
	ctx.res.json(messages)
}
