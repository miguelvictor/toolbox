import { Field, FieldLabel } from "~/components/ui/field"
import { Textarea } from "~/components/ui/textarea"
import { usePromptAtom } from "~/lib/atoms"

interface Props {
  isLoading: boolean
}

export function FieldPrompt({ isLoading }: Props) {
  const [prompt, setPrompt] = usePromptAtom()

  return (
    <Field>
      <FieldLabel htmlFor="prompt">Prompt</FieldLabel>
      <Textarea
        id="prompt"
        placeholder="Write something here"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isLoading}
      />
    </Field>
  )
}
