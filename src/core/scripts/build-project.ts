import esbuild from 'esbuild'
import path from 'path'
import { MAIN_PATH } from '../lib/consts'
import { startServer } from './start-server'
import { config } from './read-config'

async function watch() {
	const { format = 'cjs' } = config
	const ctx = await esbuild.context({
		entryPoints: [MAIN_PATH],
		bundle: true,
		outfile: path.join(process.cwd(), '.swifti/main.js'),
		format,
		platform: 'node',
		external: ['swifti'],
		plugins: [
			{
				name: 'rebuild-callback',
				setup(build) {
					build.onEnd(async () => {
						await startServer()
					})
				},
			},
		],
	})
	await ctx.watch()
}

export async function buildProject({ devMode }: { devMode: boolean } = { devMode: false }) {
	if (devMode) {
		await watch()
		return
	}
	const { format = 'cjs', output = 'dist', filename = 'main' } = config
	await esbuild.build({
		entryPoints: [MAIN_PATH],
		bundle: true,
		outfile: path.join(process.cwd(), `${output}/${filename}.js`),
		format,
		platform: 'node',
		external: ['swifti'],
	})
}
