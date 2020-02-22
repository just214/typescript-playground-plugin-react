import React from "react";
import { Sandbox } from "./vendor/playground";
const { useState, useEffect, createContext, useCallback } = React;

type Model = import("monaco-editor").editor.ITextModel;
type ModelMarker = import("monaco-editor").editor.IMarker;
type FlashInfo = (message: string) => void;
type ShowModal = {
  (code: string, subtitle?: string, links?: string[]): void;
};

export const PluginContext = createContext({});

export type PluginContextProps = {
  code: string;
  container: HTMLDivElement;
  sandbox: Sandbox;
  model: Model;
  flashInfo: FlashInfo;
  showModal: ShowModal;
  markers: ModelMarker[];
  setCode(value: string): void;
  formatCode(): void;
  setDebounce(debounce: boolean): void;
};

type ProviderProps = Pick<PluginContextProps, "sandbox" | "container">;

export const Provider: React.FC<ProviderProps> = ({
  sandbox,
  container,
  children
}) => {
  const [model, setModel] = useState<any>();
  const [code, _setCode] = useState(sandbox.getText());
  const [markers, setMarkers] = useState<ModelMarker[]>([]);
  const [debounce, setDebounce] = useState(false);

  const listenerFn = useCallback((evt: any): void => {
    setModel({ ...evt.detail.model });
    _setCode(sandbox.getText());
  }, []);

  useEffect(() => {
    sandbox.editor.onDidChangeModelDecorations(() => {
      const allMarkers = sandbox.monaco.editor.getModelMarkers({});
      setMarkers(allMarkers);
    });
  }, []);

  useEffect(() => {
    const eventName = debounce ? "modelChangedDebounce" : "modelChanged";
    window.addEventListener(eventName, listenerFn);
    const otherEventName = debounce ? "modelChanged" : "modelChangedDebounce";
    window.removeEventListener(otherEventName, listenerFn, false);
    () => window.removeEventListener(eventName, listenerFn, false);
  }, [debounce]);

  const formatCode = useCallback(() => {
    return sandbox.editor.getAction("editor.action.formatDocument").run();
  }, []);

  const setCode = useCallback((value: string) => {
    sandbox.setText(value);
  }, []);

  // @ts-ignore
  const { showModal, flashInfo } = window.playground.ui;
  const value = {
    model,
    showModal,
    flashInfo,
    sandbox,
    container,
    code,
    setCode,
    formatCode,
    setDebounce,
    markers
  };
  return (
    <PluginContext.Provider value={value}>{children}</PluginContext.Provider>
  );
};
