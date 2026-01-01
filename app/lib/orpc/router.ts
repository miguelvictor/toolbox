import { createGoogleGenerativeAI, type GoogleGenerativeAIProviderOptions } from "@ai-sdk/google"
import { generateText, Output } from "ai"
import * as z from "zod"

import { orpcBase } from "./base"

const rewritePrompt = orpcBase
  .input(
    z.object({
      prompt: z.string()
    })
  )
  .handler(async ({ context, input }) => {
    const google = createGoogleGenerativeAI({
      apiKey: context.cloudflare.env.GOOGLE_GENERATIVE_AI_API_KEY
    })
    const result = await generateText({
      model: google("gemini-3-flash-preview"),
      system: `
      You are an expert prompt engineer for Gemini 3 Pro Image.

Task: rewrite the user's image-generation/editing prompt to maximize controllability and fidelity.

Follow these rules:
- Be specific and add concrete, visual details that are implied by the user's intent (subject, setting, composition, camera/lens, lighting, textures/materials, color palette, mood, style).
- Provide context and intent (what the image is for).
- Use positive phrasing; avoid “no / don't”. Convert exclusions into positive descriptions (e.g., “an empty street” instead of “no cars”).
- Explicitly request an image by starting the prompt with: “Generate an image of …”

- IDENTITY LOCK (people in reference images):
  If the task is image-editing and the reference image contains a person, you MUST NOT change the person's facial features or identity. Preserve exactly: face shape, eyes, eyebrows, nose, mouth/lips, jawline, skin tone, freckles/moles, and apparent age. Only describe edits that keep the face identical (e.g., change background, lighting, clothing, color grade, hairstyle only if requested, etc.).

- If the user wants to edit an image, treat them as the base and write the prompt as an edit instruction. State what must stay the same and what must change.
- If the prompt requires text to appear inside the image: extract the exact text into a separate field and include typography/layout guidance. If the text is long, recommend a two-step workflow: finalize the text first, then generate the image with that exact text.
`.trim(),
      prompt: input.prompt,
      output: Output.object({
        schema: z.object({ prompt: z.string().describe("The improved prompt") })
      }),
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingLevel: "minimal",
            includeThoughts: false
          }
        } satisfies GoogleGenerativeAIProviderOptions
      }
    })

    return result.output
  })

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
          model: google(
            context.cloudflare.env.APP_ENV === "production"
              ? "gemini-3-pro-image-preview"
              : "gemini-2.5-flash-image-preview"
          ),
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

    context.resHeaders?.append("x-app-env", context.cloudflare.env.APP_ENV ?? "<none>")

    return { results }
  })

export const router = {
  images: {
    generate: generateImage,
    rewrite: rewritePrompt
  }
}
