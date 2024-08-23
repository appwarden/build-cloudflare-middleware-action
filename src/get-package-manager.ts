import { existsSync } from "node:fs"
import * as path from "node:path"

interface PackageManager {
  name: string
  install: string
  exec: string
  execNoInstall: string
}

const PACKAGE_MANAGERS = {
  npm: {
    name: "npm",
    install: "npm i --no-save --ignore-scripts",
    exec: "npx",
    execNoInstall: "npx --no-install",
  },
  yarn: {
    name: "yarn",
    install: "yarn i --no-lockfile --no-save --ignore-scripts",
    exec: "yarn",
    execNoInstall: "yarn",
  },
  pnpm: {
    name: "pnpm",
    install: "pnpm i --ignore-scripts --ignore-workspace",
    exec: "pnpm exec",
    execNoInstall: "pnpm exec",
  },
  bun: {
    name: "bun",
    install: "bun i --no-save --ignore-scripts",
    exec: "bunx",
    execNoInstall: "bun run",
  },
} as const satisfies Readonly<Record<string, PackageManager>>

type PackageManagerValue = keyof typeof PACKAGE_MANAGERS

function detectPackageManager(
  workingDirectory = ".",
): PackageManagerValue | null {
  if (existsSync(path.join(workingDirectory, "package-lock.json"))) {
    return "npm"
  }
  if (existsSync(path.join(workingDirectory, "yarn.lock"))) {
    return "yarn"
  }
  if (existsSync(path.join(workingDirectory, "pnpm-lock.yaml"))) {
    return "pnpm"
  }
  if (existsSync(path.join(workingDirectory, "bun.lockb"))) {
    return "bun"
  }
  return null
}

export function getPackageManager({
  workingDirectory = ".",
}: { workingDirectory?: string } = {}) {
  return PACKAGE_MANAGERS[detectPackageManager(workingDirectory) || "npm"]
}
