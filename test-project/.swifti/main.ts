import routes from "./routes.js"
import { createServer } from "swifti"
import path from "path"
async function main() {
createServer(routes, { port: process.env.PORT ?? 4000, assets: {"basename":"assets","path":path.join(__dirname, 'assets')}, logs: true });
};
main()