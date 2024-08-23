import jsesc from "jsesc"
import { Config } from "../types"

export const hydrateWranglerTemplate = (template: string, data: Config) =>
  template
    .replaceAll("{{DOMAIN_HOSTNAME}}", data.hostname)
    .replaceAll("{{ACCOUNT_ID}}", data.cloudflareAccountId)
    .replaceAll("{{LOCK_PAGE_SLUG}}", data.lockPageSlug)
    .replaceAll("{{PATTERN}}", `*${data.hostname}/*`)
    .replaceAll("{{ZONE_NAME}}", data.hostname)
    .replaceAll("{{CSP_ENFORCE}}", data.cspEnforced!.toString())
    .replaceAll(
      "{{CSP_DIRECTIVES}}",
      jsesc(JSON.stringify(data.cspDirectives), { quotes: "double" }),
    )

export const wranglerFileTemplate = `
#:schema ../../node_modules/wrangler/config-schema.json
name = "appwarden"
account_id = "{{ACCOUNT_ID}}"
compatibility_date = "2024-08-18"

workers_dev = false
send_metrics = false

main = "app.mjs"

[env.staging.route]
pattern = "{{PATTERN}}"
zone_name = "{{ZONE_NAME}}"

[env.staging.vars]
CSP_ENFORCE = {{CSP_ENFORCE}}
LOCK_PAGE_SLUG = "{{LOCK_PAGE_SLUG}}"
CSP_DIRECTIVES = "{{CSP_DIRECTIVES}}"

[env.production.route]
pattern = "{{PATTERN}}"
zone_name = "{{ZONE_NAME}}"

[env.production.vars]
CSP_ENFORCE = {{CSP_ENFORCE}}
LOCK_PAGE_SLUG = "{{LOCK_PAGE_SLUG}}"
CSP_DIRECTIVES = "{{CSP_DIRECTIVES}}"
`
