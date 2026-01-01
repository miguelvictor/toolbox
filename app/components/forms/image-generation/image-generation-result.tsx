import { IconDownload } from "@tabler/icons-react"
import { useState } from "react"

import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog"
import { Field, FieldLabel } from "~/components/ui/field"

interface Props {
  results: { id: string; text: string; result: string | null }[]
}

export function ImageGenerationResult({ results }: Props) {
  const [active, setActive] = useState(-1)

  if (results.length === 0) return null

  return (
    <>
      <Field className="pb-4">
        <FieldLabel>Generated Images</FieldLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {results.map(({ id, result }, index) => (
            <img
              key={id}
              src={`data:image/png;base64,${result}`}
              alt="Generated result"
              className="size-20 object-cover rounded shadow hover:opacity-80 cursor-pointer"
              onClick={() => setActive(index)}
            />
          ))}
        </div>
        <p className="text-muted-foreground">
          Select one to preview and optionally download the image.
        </p>
      </Field>
      <Dialog open={active !== -1} onOpenChange={() => setActive(-1)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Preview image</DialogTitle>
            <DialogDescription>{results[active]?.text}</DialogDescription>
          </DialogHeader>

          {results[active]?.result && (
            <div className="w-full aspect-square bg-muted relative overflow-y-auto">
              <img
                className="absolute inset-0 object-cover object-center"
                src={`data:image/png;base64,${results[active].result}`}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => handleDownload(results[active].result!)}
              disabled={!results[active]?.result}
            >
              <IconDownload />
              Download Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

async function handleDownload(result: string) {
  // Convert base64 to blob
  const base64Response = await fetch(`data:image/png;base64,${result}`)
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
