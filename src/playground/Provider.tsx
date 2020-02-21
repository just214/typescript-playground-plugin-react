import React from "react";
import { Sandbox } from "../types/playground";
const { useState, useEffect, createContext, useCallback } = React;

type Model = import("monaco-editor").editor.ITextModel;
type FlashInfo = (message: string) => void;
type ShowModal = {
  (code: string, subtitle?: string, links?: string[]): void;
};

export const PlaygroundContext = createContext({});

export type PlaygroundContextProps = {
  code: string;
  container: HTMLDivElement;
  sandbox: Sandbox;
  model: Model;
  flashInfo: FlashInfo;
  showModal: ShowModal;
  // Internal only
  setDebounce(debounce: boolean): void;
};

type ProviderProps = Pick<PlaygroundContextProps, "sandbox" | "container">;

export const Provider: React.FC<ProviderProps> = ({
  sandbox,
  container,
  children
}) => {
  const [model, setModel] = useState<any>();
  const [code, setCode] = useState(sandbox.getText());
  const [debounce, setDebounce] = useState(false);

  const listenerFn = useCallback((evt: any): void => {
    setModel({ ...evt.detail.model });
    setCode(sandbox.getText());
  }, []);

  useEffect(() => {
    const eventName = debounce ? "modelChangedDebounce" : "modelChanged";
    window.addEventListener(eventName, listenerFn);
    const otherEventName = debounce ? "modelChanged" : "modelChangedDebounce";
    window.removeEventListener(otherEventName, listenerFn, false);
    () => window.removeEventListener(eventName, listenerFn, false);
  }, [debounce]);

  // @ts-ignore
  const { showModal, flashInfo } = window.playground.ui;
  const value = {
    model,
    showModal,
    flashInfo,
    sandbox,
    container,
    code,
    setDebounce
  };
  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
};
