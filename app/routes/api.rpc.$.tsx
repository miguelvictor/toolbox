import { onError } from "@orpc/client"
import { RPCHandler } from "@orpc/server/fetch"
import { ResponseHeadersPlugin, StrictGetMethodPlugin } from "@orpc/server/plugins"

import { router } from "~/lib/orpc/router"

import type { Route } from "./+types/api.rpc.$"

const handler = new RPCHandler(router, {
  plugins: [new StrictGetMethodPlugin(), new ResponseHeadersPlugin()],
  interceptors: [
    onError((error) => {
      console.error(error)
    })
  ]
})

const requestHandler = async ({ context, request }: Route.LoaderArgs & Route.ActionArgs) => {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: {
      headers: request.headers,
      cloudflare: context.cloudflare
    }
  })

  return response ?? new Response("Not found", { status: 404 })
}

export const loader = requestHandler
export const action = requestHandler
