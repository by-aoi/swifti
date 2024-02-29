import { type ChildProcess, spawn } from 'child_process'
import { MAIN_FILE_DIR } from '../utils/consts'

let childProcess: ChildProcess

export async function devServerStart() {
	if (childProcess) childProcess.kill()

	setTimeout(
		() => {
			childProcess = spawn('node', [MAIN_FILE_DIR], { stdio: 'inherit' })
		},
		childProcess ? 1000 : 0
	)
}
