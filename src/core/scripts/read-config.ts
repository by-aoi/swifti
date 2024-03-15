import path from 'path'
import fs from 'fs-extra'

import { esmRequire } from '../lib/esm-require'
import { type Config } from '../../config'

export const CONFIG_FILE_PATH = path.join(process.cwd(), 'swifti.config')

export const CONFIG_FILE_ALLOWED_EXTENSIONS = ['.ts', '.js', '.cjs', '.json', '.mjs']

export let config: Config

export async function readConfig() {
	for (const extension of CONFIG_FILE_ALLOWED_EXTENSIONS) {
		const filePath = CONFIG_FILE_PATH + extension

		if (await fs.exists(filePath)) {
			try {
				const loadConfig = await esmRequire(filePath)
				config = loadConfig.default ?? loadConfig
				return
			} catch (error) {
				console.log(error)
				throw new Error('config could not be loaded.')
			}
		}
	}

	throw new Error('config is required.')
}
