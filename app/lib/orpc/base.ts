import type { ResponseHeadersPluginContext } from "@orpc/server/plugins"
import type { AppLoadContext } from "react-router"

import { os } from "@orpc/server"

export interface ORPCContext extends ResponseHeadersPluginContext {
  headers: Headers
  cloudflare: AppLoadContext["cloudflare"]
}

export const orpcBase = os.$context<ORPCContext>()
