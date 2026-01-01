import { Field, FieldLabel } from "~/components/ui/field"
import { Textarea } from "~/components/ui/textarea"

export function FieldPrompt() {
  return (
    <Field>
      <FieldLabel htmlFor="prompt">Prompt</FieldLabel>
      <Textarea id="prompt" placeholder="Write something here" />
    </Field>
  )
}
