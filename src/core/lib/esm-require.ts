import esm from 'esm'
import { config } from '../scripts/read-config'

export async function esmRequire(modulePath: string) {
	const format = config?.format ?? 'cjs'
	if (format === 'esm') return require
	const r = await esm(module)(`${modulePath}?v=` + Math.random())
	return r
}
