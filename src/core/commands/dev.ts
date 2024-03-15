import { ROUTES_PATH } from '../lib/consts'
import { buildProject } from '../scripts/build-project'
import { createMain } from '../scripts/create-main'
import { createRoutes } from '../scripts/create-routes'
import { detectChanges } from '../scripts/detect-changes'
import { findRoutes, type RouteData } from '../scripts/find-routes'

export async function devCommand() {
	const routes: RouteData[] = []
	await findRoutes(ROUTES_PATH, routes)
	await createRoutes(routes)
	await createMain({ devMode: true })
	await detectChanges()
	await buildProject({
		devMode: true,
	})
}
