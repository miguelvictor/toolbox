import type { Ref } from "react"

import { Field, FieldLabel } from "~/components/ui/field"
import { useImagesAtom } from "~/lib/atoms"

interface Props {
  refInputImage: Ref<HTMLInputElement>
}

export function FieldImages({ refInputImage }: Props) {
  const [images, setImages] = useImagesAtom()

  return (
    <>
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
                className="size-20 object-cover rounded hover:opacity-80 cursor-pointer shadow"
                onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                src={URL.createObjectURL(i)}
                alt={i.name}
              />
            ))}
          </div>
        </Field>
      )}
    </>
  )
}
