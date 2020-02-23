import React from "react";
import { Sandbox } from "./vendor/playground";
import prettierLib from "prettier/standalone";
import parserBabel from "prettier/parser-babylon";
import parserTypescript from "prettier/parser-typescript";
import { Options } from "prettier";
const { useState, useEffect, createContext, useCallback } = React;

const defaultPrettierConfig: Options = {
  semi: true,
  parser: "babel",
  plugins: [parserBabel, parserTypescript],
  tabWidth: 2
};

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
  markers: (ModelMarker & { key: string })[];
  setCode(value: string, options?: { format: "prettier" | "monaco" }): void;
  formatCode(): void;
  prettier(config?: Options): void;
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

  const listenerFn = useCallback(
    (evt: any): void => {
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
    (value: string, options?: { format: "prettier" | "monaco" }) => {
      if (options && options.format === "prettier") {
        const prettyCode = prettierLib.format(value, defaultPrettierConfig);
        sandbox.setText(prettyCode);
      } else if (options && options.format === "monaco") {
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

  const prettier = useCallback(
    (config?: Options) => {
      const prettyCode = prettierLib.format(
        code,
        { ...config, ...defaultPrettierConfig } || defaultPrettierConfig
      );

      sandbox.setText(prettyCode);
    },
    [code, sandbox]
  );

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
    markers,
    prettier
  };
  return (
    <PluginContext.Provider value={value}>{children}</PluginContext.Provider>
  );
};
