import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import * as z from "zod"

import { orpcBase } from "./base"

const generateImage = orpcBase
  .input(
    z.object({
      images: z.string().array(),
      prompt: z.string()
    })
  )
  .handler(async ({ context, input }) => {
    const google = createGoogleGenerativeAI({
      apiKey: context.cloudflare.env.GOOGLE_GENERATIVE_AI_API_KEY
    })
    const results = await Promise.all(
      Array.from({ length: 3 }).map(() =>
        generateText({
          model: google("gemini-2.5-flash-image-preview"),
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: input.prompt },
                ...input.images.map((image) => ({ type: "image" as const, image }))
              ]
            }
          ]
        }).then((result) => ({
          id: crypto.randomUUID(),
          text: result.text,
          result: result.files.length > 0 ? result.files[0].base64 : null,
          needsMoreInformation: result.files.length === 0
        }))
      )
    )

    return { results }
  })

export const router = {
  images: {
    generate: generateImage
  }
}
