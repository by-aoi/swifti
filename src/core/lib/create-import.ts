export function createImport(pathname: string, uniqueId: string) {
	let imp: string = ''
	const url = `..${pathname.replace(process.cwd(), '').replace(/\\/g, '/')}`
	// if (format === "esm") imp = `import * as ${name} from "${url}"`;
	imp = `import * as ${uniqueId} from "${url}"`
	return imp
}
