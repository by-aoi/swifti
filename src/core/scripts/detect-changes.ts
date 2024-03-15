import fs from 'fs-extra'
import { PROJECT_PATH, ROUTES_PATH } from '../lib/consts'
import { type RouteData, findRoutes } from './find-routes'
import { createRoutes } from './create-routes'
import { createMain } from './create-main'
import { Messages } from '../lib/messages'

export async function detectChanges() {
	fs.watch(PROJECT_PATH, { recursive: true }, async event => {
		if (event === 'rename') {
			const routes: RouteData[] = []
			await findRoutes(ROUTES_PATH, routes)
			await createRoutes(routes)
			await createMain()
		}
		Messages.info('changes detected, restarting...')
	})
}
