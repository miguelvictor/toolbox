import { useMutation } from "@tanstack/react-query"

import { useImagesValue, usePromptAtom } from "~/lib/atoms"
import { orpc } from "~/lib/orpc/client"

export function useImageGeneration() {
  const images = useImagesValue()
  const [prompt, setPrompt] = usePromptAtom()
  const {
    data: generateData,
    isPending: isGenerating,
    mutate: generate
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
  const { isPending: isImprovingPrompt, mutate: improve } = useMutation({
    mutationFn: () => orpc.images.rewrite({ prompt }),
    onSuccess: (result) => setPrompt(result.prompt)
  })

  return {
    data: generateData,
    isLoading: isGenerating || isImprovingPrompt,
    generate,
    improve
  }
}
