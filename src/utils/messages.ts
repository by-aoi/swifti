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

	static error(message: string) {
		console.log(`[${chalk.red('ERROR')}] ${this.date()} ${message}`)
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
