import type { GambaHandler } from "../handlers/gambaHandler";

let handler: GambaHandler | null = null;

export function setGambaHandler(instance: GambaHandler) {
  handler = instance;
}

export function getGambaHandler(): GambaHandler | null {
  return handler;
}
