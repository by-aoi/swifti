#!/usr/bin/env node

import { build } from "./commands/build";
import { dev } from "./commands/dev";
import { init } from "./commands/init";
import { readConfig } from "./scripts/read-config";
import { Messages } from "./utils/messages";

const command = process.argv.slice(2)[0];

async function runCommand(command: string) {
  try {
    if (command === "init") return await init();
    await readConfig();
    if (command === "build") return await build();
    return await dev();
  } catch (error) {
    Messages.error(error.message);
    process.exit();
  }
}

runCommand(command);
