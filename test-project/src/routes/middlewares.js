const { Middleware } = require('../../../dist/main')

module.exports = [
	new Middleware((ctx, next) => {
		console.log('Hello from middleware!!')
		next()
	}),
]
