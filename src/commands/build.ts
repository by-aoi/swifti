import { buildProject } from '../scripts/build-project'
import { buildRoutes } from '../scripts/build-routes'
import { createMainFile } from '../scripts/create-main'
import { createRoutes } from '../scripts/create-routes'
import { type RouteDetails, findRoutes } from '../scripts/find-routes'
import { Messages } from '../utils/messages'

export async function build() {
	await buildRoutes()
	const routes: RouteDetails[] = []
	await findRoutes(routes)
	await createRoutes(routes)
	await createMainFile()
	await buildProject()
	Messages.success('Build completed successfully.')
}
