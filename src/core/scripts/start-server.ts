import path from 'path'

import { type ChildProcess, spawn } from 'child_process'

const FilePath = path.join(process.cwd(), '.swifti/main.js')

let childProcess: ChildProcess | undefined

export async function startServer() {
	if (childProcess) {
		childProcess.kill()
		childProcess.on('close', () => {
			childProcess = spawn('node', [FilePath], { stdio: 'inherit' })
		})
		return
	}

	childProcess = spawn('node', [FilePath], { stdio: 'inherit' })
}
