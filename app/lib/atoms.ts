import { atom, useAtom, useAtomValue } from "jotai"

const imagesAtom = atom<File[]>([])
export const useImagesAtom = () => useAtom(imagesAtom)
export const useImagesValue = () => useAtomValue(imagesAtom)

const promptAtom = atom<string>("")
export const usePromptAtom = () => useAtom(promptAtom)
export const usePromptValue = () => useAtomValue(promptAtom)
