import { IconDownload, IconImageInPicture, IconSparkles2, IconWand } from "@tabler/icons-react"
import { useMutation } from "@tanstack/react-query"
import { useRef, useState } from "react"

import { Alert, AlertDescription } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field"
import { Markdown } from "~/components/ui/markdown"
import { Textarea } from "~/components/ui/textarea"
import { orpc } from "~/lib/orpc/client"

export default function HomePage() {
  const refInputImage = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<File[]>([])
  const [prompt, setPrompt] = useState("")
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

  const handleDownload = async () => {
    if (!data?.result) return

    // Convert base64 to blob
    const base64Response = await fetch(`data:image/png;base64,${data.result}`)
    const blob = await base64Response.blob()
    const file = new File([blob], `generated-image-${Date.now()}.png`, { type: "image/png" })

    // Try Web Share API first (works better on mobile/iOS)
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Generated Image",
          text: "Check out this generated image"
        })
        return
      } catch (err) {
        // User cancelled or share failed, fall through to download
        if ((err as Error).name === "AbortError") return
      }
    }

    // Fallback to traditional download for desktop
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  return (
    <main className="h-svh flex items-center justify-center p-5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Image Generation</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              mutate()
            }}
          >
            <FieldGroup>
              <input
                ref={refInputImage}
                type="file"
                id="images"
                className="hidden"
                accept="image/jpg,image/jpeg,image/png"
                onChange={(e) => {
                  if (e.target.files) {
                    const files: File[] = []
                    for (const f of e.target.files) files.push(f)
                    setImages((prev) => [...prev, ...files])
                  }
                }}
                multiple
              />
              {images.length > 0 && (
                <Field>
                  <FieldLabel htmlFor="images">Images</FieldLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((i, index) => (
                      <img
                        key={i.name}
                        className="size-20 object-cover rounded hover:opacity-80 cursor-pointer"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                        src={URL.createObjectURL(i)}
                        alt={i.name}
                      />
                    ))}
                  </div>
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="prompt">Prompt</FieldLabel>
                <Textarea
                  id="prompt"
                  placeholder="Write something here"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </Field>

              {data?.needsMoreInformation && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <Markdown content={data.text} />
                  </AlertDescription>
                </Alert>
              )}

              {data?.result && (
                <Field>
                  <FieldLabel>Generated Image</FieldLabel>
                  <div className="relative overflow-hidden border">
                    <img
                      src={`data:image/png;base64,${data.result}`}
                      alt="Generated result"
                      className="w-full h-auto"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownload}
                    className="w-full mt-2"
                  >
                    <IconDownload />
                    Download Image
                  </Button>
                </Field>
              )}

              <Field orientation="horizontal">
                <Button type="submit" disabled={isGenerating}>
                  <IconSparkles2 />
                  {isGenerating ? "Generating" : "Generate"}
                </Button>
                <div className="flex-1"></div>
                <Button variant="outline" type="button" disabled={isGenerating}>
                  <IconWand />
                  Rewrite
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => refInputImage.current?.click()}
                >
                  <IconImageInPicture />
                  Add Images
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
