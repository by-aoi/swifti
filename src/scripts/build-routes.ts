import esbuild from 'esbuild'
import fs from 'fs-extra'

import { PROJECT_DIR, ROUTES_DIR, SWIFTI_DIR } from '../utils/consts'
import { config } from './read-config'

async function hasOtherDirectories() {
	const exists = await fs.exists(PROJECT_DIR)
	if (!exists) throw new Error('project src directory not found.')
	const files = await fs.readdir(PROJECT_DIR)
	return files.length > 1
}

async function watch(callback: () => Promise<void>) {
	const { format = 'esm' } = config
	const hasDirectories = await hasOtherDirectories()
	const outdir = hasDirectories ? SWIFTI_DIR : ROUTES_DIR
	await fs.remove(outdir)
	const ctx = await esbuild.context({
		entryPoints: [`${PROJECT_DIR}/**`],
		outdir,
		platform: 'node',
		bundle: false,
		format,
		plugins: [
			{
				name: 'rebuild-callback',
				setup(build) {
					build.onEnd(async () => {
						await callback()
					})
				},
			},
		],
	})
	await ctx.watch()
}

async function build() {
	const { format = 'cjs' } = config
	const hasDirectories = await hasOtherDirectories()
	const outdir = hasDirectories ? SWIFTI_DIR : ROUTES_DIR
	await fs.remove(outdir)
	await esbuild.build({
		entryPoints: [`${PROJECT_DIR}/**`],
		outdir,
		platform: 'node',
		bundle: false,
		format,
	})
}

export async function buildRoutes(callback?: () => Promise<void>) {
	if (callback) {
		await watch(callback)
		return
	}
	await build()
}
