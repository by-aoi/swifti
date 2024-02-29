import { buildRoutes } from "../scripts/build-routes";
import { createMainFile } from "../scripts/create-main";
import { createRoutes } from "../scripts/create-routes";
import { devServerStart } from "../scripts/dev-server";
import { RouteDetails, findRoutes } from "../scripts/find-routes";
import { Messages } from "../utils/messages";

export async function dev() {
  await buildRoutes(async () => {
    try {
      Messages.info("changes detected, restarting...");
      const routes: RouteDetails[] = [];
      await findRoutes(routes);
      await createRoutes(routes);
      await createMainFile();
      await devServerStart();
    } catch (error) {
      Messages.error(error.message);
      process.exit();
    }
  });
}
