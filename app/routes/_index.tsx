import { IconImageInPicture, IconSparkles2, IconWand } from "@tabler/icons-react"
import { useRef } from "react"

import { FieldImages } from "~/components/forms/image-generation/field-images"
import { FieldPrompt } from "~/components/forms/image-generation/field-prompt"
import { ImageGenerationResult } from "~/components/forms/image-generation/image-generation-result"
import { useImageGeneration } from "~/components/forms/image-generation/use-image-generation"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Field, FieldGroup } from "~/components/ui/field"

export default function HomePage() {
  const refInputImage = useRef<HTMLInputElement>(null)
  const { data, isGenerating, generate } = useImageGeneration()

  return (
    <main className="min-h-svh flex items-center justify-center p-5">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Image Generation</CardTitle>
          <CardDescription>Please fill in your details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              generate()
            }}
          >
            <FieldGroup>
              <FieldImages refInputImage={refInputImage} />
              <FieldPrompt />
              <ImageGenerationResult results={data?.results ?? []} />
              <Field orientation="horizontal">
                <Button type="submit" disabled={isGenerating} size="lg">
                  <IconSparkles2 />
                  {isGenerating ? "Generating" : "Generate"}
                </Button>
                <div className="flex-1"></div>
                <Button variant="outline" type="button" disabled={isGenerating} size="lg">
                  <IconWand />
                  Rewrite
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => refInputImage.current?.click()}
                  disabled={isGenerating}
                  size="lg"
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
