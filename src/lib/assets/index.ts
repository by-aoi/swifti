import path from 'path'
import mime from 'mime-types'
import fs from 'fs-extra'

import { type Context } from '../context'
import { type Writable } from 'stream'

export interface AssetsOptions {
	path: string
	basename: string
}

export async function assets(ctx: Context, options: AssetsOptions) {
	const { basename, path: assetsPath } = options
	const { url } = ctx.req
	if (!url.startsWith(`/${basename}`)) return false
	const filePath = path.join(assetsPath, url.replace(`/${basename}`, ''))
	const fileExists = await fs.exists(filePath)
	if (!fileExists) return false
	const fileStat = await fs.stat(filePath)
	if (fileStat.isDirectory()) return false
	const extname = path.extname(url)
	if (extname) {
		const contentType = mime.contentType(extname)
		ctx.res.setHeader('Content-Type', typeof contentType === 'string' ? contentType : 'text/plain')
	} else {
		ctx.res.setHeader('Content-Type', 'text/plain')
	}
	const fileStream = fs.createReadStream(filePath)
	fileStream.pipe(ctx.res as Writable)
	return true
}
