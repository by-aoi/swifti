import { type Context } from "../context";

export type Route = (ctx: Context) => Promise<void> | void;
