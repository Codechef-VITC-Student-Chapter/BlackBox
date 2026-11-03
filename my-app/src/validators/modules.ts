import { GAME_CONFIG } from "@/config/game";

export function isValidModule(module: number): boolean {
  return Number.isInteger(module) && module >= GAME_CONFIG.firstModule && module <= GAME_CONFIG.totalModules;
}
