import { z } from "zod"
import { ContentSecurityPolicyType } from "./types"

const stringySchema = z.union([z.array(z.string()), z.string(), z.boolean()])

export const ContentSecurityPolicySchema = z.object({
  "default-src": stringySchema.optional(),
  "script-src": stringySchema.optional(),
  "style-src": stringySchema.optional(),
  "img-src": stringySchema.optional(),
  "connect-src": stringySchema.optional(),
  "font-src": stringySchema.optional(),
  "object-src": stringySchema.optional(),
  "media-src": stringySchema.optional(),
  "frame-src": stringySchema.optional(),
  sandbox: stringySchema.optional(),
  "report-uri": stringySchema.optional(),
  "child-src": stringySchema.optional(),
  "form-action": stringySchema.optional(),
  "frame-ancestors": stringySchema.optional(),
  "plugin-types": stringySchema.optional(),
  "base-uri": stringySchema.optional(),
  "report-to": stringySchema.optional(),
  "worker-src": stringySchema.optional(),
  "manifest-src": stringySchema.optional(),
  "prefetch-src": stringySchema.optional(),
  "navigate-to": stringySchema.optional(),
  "require-sri-for": stringySchema.optional(),
  "block-all-mixed-content": stringySchema.optional(),
  "upgrade-insecure-requests": stringySchema.optional(),
  "trusted-types": stringySchema.optional(),
  "require-trusted-types-for": stringySchema.optional(),
})

const OptionalBooleanSchema = z
  .union([z.string(), z.boolean(), z.undefined()])
  .transform((val) => {
    if (val === undefined) {
      return val
    }

    if (val === "true" || val === true) {
      return true
    } else if (val === "false" || val === false) {
      return false
    }

    throw new Error("Invalid value")
  })

export const ConfigSchema = z
  .object({
    hostname: z.string(),
    lockPageSlug: z.string(),
    cloudflareAccountId: z.string(),
    debug: OptionalBooleanSchema.default(false),
    cspEnforced: OptionalBooleanSchema,
    cspDirectives: z
      .union([z.string(), ContentSecurityPolicySchema, z.undefined()])
      .transform((val) => {
        console.log(`cspDirectives transform`, typeof val, val)

        if (typeof val === "object" && val !== null) {
          return val as ContentSecurityPolicyType
        }

        try {
          // @ts-expect-error its ok if this fails
          const json = JSON.parse(val)
          // will return object
          return json as ContentSecurityPolicyType
        } catch {
          // will return either string or undefined
          return val as string
        }
      }),
  })
  .refine(
    (schema) => {
      if (schema.cspEnforced !== undefined) {
        return !!schema.cspDirectives
      }

      return true
    },
    {
      message:
        "Please provide a map of directives for your Content Security Policy",
      path: ["cspEnforced"],
    },
  )
