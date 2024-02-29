#!/usr/bin/env node

import { build } from './commands/build'
import { dev } from './commands/dev'
import { init } from './commands/init'
import { readConfig } from './scripts/read-config'
import { Messages } from './utils/messages'

const command = process.argv.slice(2)[0]

async function runCommand(command: string) {
	if (command === 'init') {
		await init()
		return
	}
	await readConfig()
	if (command === 'build') {
		await build()
		return
	}
	await dev()
}

runCommand(command).catch(error => {
	Messages.error(error.message)
	process.exit()
})
