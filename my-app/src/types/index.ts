export type ModuleStatus = "LOCKED" | "UNLOCKED" | "FAILED" | "IN_PROGRESS";

export interface SystemState {
  authentication: ModuleStatus;
  repository: ModuleStatus;
  network: ModuleStatus;
  memory: ModuleStatus;
  core: ModuleStatus;
}