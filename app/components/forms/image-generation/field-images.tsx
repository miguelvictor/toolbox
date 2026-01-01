import { Field, FieldLabel } from "~/components/ui/field"
import { Input } from "~/components/ui/input"

export function FieldImages() {
  return (
    <Field>
      <FieldLabel htmlFor="images">Images</FieldLabel>
      <Input type="file" id="images" placeholder="Enter your name" multiple />
    </Field>
  )
}
