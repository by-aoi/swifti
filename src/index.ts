#!/usr/bin/env node

import { Messages } from './core/lib/messages'

import { buildCommand } from './core/commands/build'
import { devCommand } from './core/commands/dev'
import { readConfig } from './core/scripts/read-config'
import { initCommand } from './core/commands/init'
import { cleanCommand } from './core/commands/clean'

const command = process.argv.slice(2)[0]

async function runCommand(command: string) {
	if (command === 'init') {
		await initCommand()
		return
	}
	if (command === 'clean') {
		await cleanCommand()
		return
	}
	await readConfig()
	if (command === 'build') {
		await buildCommand()
		return
	}
	await devCommand()
}

runCommand(command).catch(error => {
	Messages.error(error.message)
	process.exit()
})
