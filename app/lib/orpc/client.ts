import type { RouterClient } from "@orpc/server"

import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"

import type { router } from "./router"

const link = new RPCLink({
  url: new URL(
    "/api/rpc",
    typeof window !== "undefined" ? window.location.origin : "http://localhost:5173"
  ),
  method: (_, path) => {
    if (path.at(-1)?.match(/^(?:get|find|list|search|resolve)(?:[A-Z].*)?$/)) return "GET"
    return "POST"
  }
})

export const orpc: RouterClient<typeof router> = createORPCClient(link)
