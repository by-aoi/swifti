import path from 'path'
import fs from 'fs-extra'

import { ASSETS_PATH } from '../lib/consts'
import { config } from './read-config'

export async function copyAssets() {
	const { output = 'dist', assets } = config
	if (assets === false) return
	const outdir = path.join(process.cwd(), output, 'assets')
	await fs.copy(ASSETS_PATH, outdir)
}
