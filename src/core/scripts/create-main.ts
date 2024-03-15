import fs from 'fs-extra'
import { MAIN_PATH } from '../lib/consts'
import { findSetup } from './find-routes'
import { config } from './read-config'

async function createImport() {
	return 'import routes from "./routes.js"'
}

let lastContent: string

export async function createMain({ devMode }: { devMode: boolean } = { devMode: false }) {
	const { assets = { basename: 'assets' } } = config
	const { port = 6855, ...serverOptions } = config.server ?? {}
	const importRoutes = await createImport()
	const importSwifti = 'import { createServer } from "swifti"'
	const importPath = 'import path from "path"'
	const assestsPath = `IMPORT{${
		devMode ? "path.join(__dirname, '../assets')" : "path.join(__dirname, 'assets')"
	}}`
	const createServer = `createServer(routes, { port: ${
		devMode ? port : `process.env.PORT ?? ${port}`
	}, assets: ${
		assets
			? JSON.stringify({
					...assets,
					path: assestsPath,
			  }).replace(/"IMPORT\{([^"]+)\}"/g, '$1')
			: undefined
	}, logs: ${serverOptions.logs ?? true} });`

	const setup = await findSetup()

	const mainFunction = `async function main() {${
		setup ? `\n$await ${setup.uniqueId}()` : ''
	}\n${createServer}\n};\nmain()`

	const content = `${importRoutes}\n${importSwifti}${assets ? `\n${importPath}` : ''}\n${mainFunction}`

	if (lastContent === content) return

	await fs.writeFile(MAIN_PATH, content, 'utf-8')
}
