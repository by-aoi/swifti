export interface Config {
	server?: {
		port?: number
		logs?: boolean
	}
	assets?:
		| {
				basename?: string
		  }
		| false
	format?: 'esm' | 'cjs'
	output?: string
	filename?: string
}

export function defineConfig(config: Config) {
	return config
}
