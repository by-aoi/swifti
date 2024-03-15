import { ROUTES_PATH } from '../lib/consts'
import { Messages } from '../lib/messages'
import { buildProject } from '../scripts/build-project'
import { copyAssets } from '../scripts/copy-assets'
import { createMain } from '../scripts/create-main'
import { createRoutes } from '../scripts/create-routes'
import { findRoutes, type RouteData } from '../scripts/find-routes'

export async function buildCommand() {
	const routes: RouteData[] = []
	await findRoutes(ROUTES_PATH, routes)
	await createRoutes(routes)
	await createMain()
	await copyAssets()
	await buildProject()
	Messages.success('project built correctly.')
}
