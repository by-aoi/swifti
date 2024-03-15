import path from 'path'

export const PROJECT_PATH = path.join(process.cwd(), 'src')
export const ROUTES_PATH = path.join(PROJECT_PATH, 'routes')
export const CACHE_PATH = path.join(process.cwd(), '.swifti')
export const ASSETS_PATH = path.join(process.cwd(), 'assets')
export const CACHE_ROUTES_PATH = path.join(CACHE_PATH, 'routes.ts')
export const MAIN_PATH = path.join(CACHE_PATH, 'main.ts')
