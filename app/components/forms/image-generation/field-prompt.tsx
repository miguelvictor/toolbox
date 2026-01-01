import { Field, FieldLabel } from "~/components/ui/field"
import { Textarea } from "~/components/ui/textarea"
import { usePromptAtom } from "~/lib/atoms"

export function FieldPrompt() {
  const [prompt, setPrompt] = usePromptAtom()

  return (
    <Field>
      <FieldLabel htmlFor="prompt">Prompt</FieldLabel>
      <Textarea
        id="prompt"
        placeholder="Write something here"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
    </Field>
  )
}
