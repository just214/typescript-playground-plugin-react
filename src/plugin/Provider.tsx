import React from "react";
import { Sandbox } from "./vendor/playground";
import { PluginUtils } from "./vendor/PluginUtils";
const { useState, useEffect, createContext, useCallback } = React;

type Model = import("monaco-editor").editor.ITextModel;

type ModelMarker = import("monaco-editor").editor.IMarker;

export type FlashInfo = (message: string) => void;

export type ShowModal = {
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
  markers: (ModelMarker & { key: string })[];
  setCode(value: string, options?: { format: "monaco" }): void;
  formatCode(): void;
  setDebounce(debounce: boolean): void;
  utils: PluginUtils;
};

type ProviderProps = Pick<
  PluginContextProps,
  "sandbox" | "container" | "utils"
>;

export const Provider: React.FC<ProviderProps> = ({
  sandbox,
  container,
  utils,
  children
}) => {
  const [model, setModel] = useState<Model>();
  const [code, _setCode] = useState(sandbox.getText());
  const [markers, setMarkers] = useState<ModelMarker[]>([]);
  const [debounce, setDebounce] = useState(false);

  const listenerFn = useCallback(
    (evt): void => {
      setModel({ ...evt.detail.model });
      _setCode(sandbox.getText());
    },
    [sandbox]
  );

  useEffect(() => {
    const disposable = sandbox.editor.onDidChangeModelDecorations(() => {
      const allMarkers = sandbox.monaco.editor
        .getModelMarkers({})
        .map((marker, index) => {
          return {
            ...marker,
            key: index.toString()
          };
        });
      setMarkers(allMarkers);
    });
    return () => disposable.dispose();
  }, [sandbox]);

  useEffect(() => {
    const eventName = debounce ? "modelChangedDebounce" : "modelChanged";
    window.addEventListener(eventName, listenerFn);
    const otherEventName = debounce ? "modelChanged" : "modelChangedDebounce";
    window.removeEventListener(otherEventName, listenerFn, false);
    return () => window.removeEventListener(eventName, listenerFn, false);
  }, [debounce, listenerFn]);

  const setCode = useCallback(
    (value: string, options?: { format: "monaco" }) => {
      if (options && options.format === "monaco") {
        sandbox.setText(value);
        sandbox.editor.getAction("editor.action.formatDocument").run();
      } else {
        sandbox.setText(value);
      }
    },
    [sandbox]
  );

  const formatCode = useCallback(() => {
    return sandbox.editor.getAction("editor.action.formatDocument").run();
  }, [sandbox.editor]);

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
    markers,
    utils
  };
  return (
    <PluginContext.Provider value={value}>{children}</PluginContext.Provider>
  );
};
