import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import * as z from "zod"

import { orpcBase } from "./base"

const generateImage = orpcBase
  .input(
    z.object({
      images: z.any(),
      prompt: z.string()
    })
  )
  .handler(async ({ context, input }) => {
    const google = createGoogleGenerativeAI({
      apiKey: context.cloudflare.env.GOOGLE_GENERATIVE_AI_API_KEY
    })
    const result = await generateText({
      model: google("gemini-2.5-flash-image-preview"),
      prompt: input.prompt
    })

    console.dir(result, { depth: null })

    return {
      text: result.text,
      needsMoreInformation: result.files.length === 0
    }
  })

export const router = {
  images: {
    generate: generateImage
  }
}
