import type { Env } from "@dniproanimals/env";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
