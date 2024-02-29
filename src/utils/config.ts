export interface Config {
  port?: number;
  format?: "esm" | "cjs";
  outdir?: string;
  bundle?: boolean;
}

export function defineConfig(config: Config) {
  return config;
}
