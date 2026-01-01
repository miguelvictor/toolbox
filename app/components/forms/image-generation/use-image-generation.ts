import { useMutation } from "@tanstack/react-query"

import { useImagesValue, usePromptValue } from "~/lib/atoms"
import { orpc } from "~/lib/orpc/client"

export function useImageGeneration() {
  const images = useImagesValue()
  const prompt = usePromptValue()
  const {
    data,
    isPending: isGenerating,
    mutate
  } = useMutation({
    mutationFn: async () => {
      const imagePromises = images.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      })
      const base64Images = await Promise.all(imagePromises)
      return await orpc.images.generate({ images: base64Images, prompt })
    }
  })

  return {
    data,
    generate: mutate,
    isGenerating
  }
}
