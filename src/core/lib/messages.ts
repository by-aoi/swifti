import chalk from 'chalk'

export class Messages {
	private static date() {
		const now = new Date()

		let hours: string | number = now.getHours()
		let minutes: string | number = now.getMinutes()
		let seconds: string | number = now.getSeconds()

		const amOrPm = hours >= 12 ? 'PM' : 'AM'
		hours = hours % 12
		hours = hours ?? 12

		hours = hours.toString().padStart(2, '0')
		minutes = minutes.toString().padStart(2, '0')
		seconds = seconds.toString().padStart(2, '0')

		const formattedTime = `${hours}:${minutes}:${seconds} ${amOrPm}`

		return `${chalk.gray(formattedTime)}`
	}

	static logStatusCode(statusCode: number) {
		let status: string

		switch (statusCode) {
			case 200:
				status = chalk.green(statusCode)
				break
			case 404:
				status = chalk.red(statusCode)
				break
			case 500:
				status = chalk.red(statusCode)
				break
			default:
				status = chalk.yellow(statusCode)
		}
		return status
	}

	static logTime(start: number, end: number) {
		const timeInMs = end - start
		let formatedTime: string

		if (timeInMs < 1000) {
			formatedTime = `${timeInMs} ms`
		} else if (timeInMs < 60000) {
			const timeInSeconds = timeInMs / 1000
			formatedTime = `${timeInSeconds.toFixed(2)} s`
		} else {
			const timeInMinutes = timeInMs / 60000
			formatedTime = `${timeInMinutes.toFixed(2)} min`
		}

		return formatedTime
	}

	static log(data: { method: string; status: number; url: string; start: number; end: number }) {
		const message = `${data.method} ${chalk.gray(data.url)} ${this.logStatusCode(
			data.status
		)} - ${this.logTime(data.start, data.end)}`
		this.info(message)
	}

	static error(message: string, error?: any) {
		console.log(`[${chalk.red('ERROR')}] ${this.date()} ${message}`)
		if (error) console.error(error)
	}

	static info(message: string) {
		console.log(`[${chalk.cyan('INFO')}] ${this.date()} ${message}`)
	}

	static success(message: string) {
		console.log(`[${chalk.green('SUCCESS')}] ${this.date()} ${message}`)
	}

	static server(message: string) {
		console.log(`[${chalk.yellow('SERVER')}] ${this.date()} ${message}`)
	}
}
