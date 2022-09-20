import { execSync } from "child_process";

export function getCommitHash() {
  return execSync("git rev-parse HEAD").toString().trim();
}
