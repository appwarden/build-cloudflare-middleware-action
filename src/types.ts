import { z } from "zod"
import { ConfigSchema, ContentSecurityPolicySchema } from "./schema"

type AnyRecord = Record<string, unknown>

export type APIResponseContent = AnyRecord[] | AnyRecord | null
export type APIResponseContext = any
export type APIResponseError = {
  message: string
  status?: number
}

export type APIResponse<T extends APIResponseContent = AnyRecord> = {
  content: T | undefined
  context: APIResponseContext | undefined
  error: APIResponseError | undefined
}

export interface AppwardenConfig {
  middleware?: Middleware[]
}

export interface Middleware {
  hostname: string
  options?: {
    debug: boolean | string
    "lock-page-slug": string
    "csp-enforced": boolean | string
    "csp-directives": Record<string, string> | string
  }
}

export type Config = z.infer<typeof ConfigSchema>
export type ContentSecurityPolicyType = z.infer<
  typeof ContentSecurityPolicySchema
>
