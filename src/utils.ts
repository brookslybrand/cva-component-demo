/**
 * Calls the callback if in the appropriate environment
 */
export function checkEnv(env: "development" | "production", cb: () => void) {
  if (import.meta.env.MODE === env) {
    cb();
  }
}
