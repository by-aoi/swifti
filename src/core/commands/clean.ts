import fs from 'fs-extra'
import { CACHE_PATH } from '../lib/consts'

export async function cleanCommand() {
	await fs.rm(CACHE_PATH)
}
