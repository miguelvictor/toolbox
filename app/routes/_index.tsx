import { IconImageInPicture, IconSparkles2, IconWand } from "@tabler/icons-react"
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
    mutationFn: () => orpc.images.generate({ images, prompt })
  })

  return (
    <main className="h-svh flex items-center justify-center p-10">
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
