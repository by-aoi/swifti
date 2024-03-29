import fs from 'fs-extra'
import path from 'path'

import { Messages } from '../lib/messages'

const content = `import { defineConfig } from "swifti";

export default defineConfig({});`

export async function initCommand() {
	const typescript = await fs.exists('tsconfig.json')
	const extname = typescript ? 'ts' : 'js'
	const filename = `swifti.config.${extname}`
	const pathname = path.join(process.cwd(), filename)
	await fs.writeFile(pathname, content, 'utf-8')
	Messages.success('swifti initialized successfully.')
}
