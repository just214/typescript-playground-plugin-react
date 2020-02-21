import React from "react";
import { PlaygroundContext, PlaygroundContextProps } from "./Provider";
const { useContext } = React;

type Model = import("monaco-editor").editor.ITextModel;
type FlashInfo = (message: string) => void;
type ShowModal = {
  (code: string, subtitle?: string, links?: string[]): void;
};

export const usePlayground = ({ debounce }: { debounce: boolean }) => {
  const values = useContext(PlaygroundContext) as PlaygroundContextProps;
  values.setDebounce(debounce);
  return values;
};
