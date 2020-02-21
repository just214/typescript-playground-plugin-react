import React from "react";
const { useState, useEffect } = React;

type Model = import("monaco-editor").editor.ITextModel;
type FlashInfo = (message: string) => void;
type ShowModal = {
  (code: string, subTitle?: string, links?: string[]): void;
};

export const usePlayground = ({ debounce }: { debounce: boolean }) => {
  const [model, setModel] = useState<Model>();

  useEffect(() => {
    // TODO: Figure out how to type this out.
    const listenerFn = (evt: any): void => {
      setModel({ ...evt.detail.model });
    };
    const eventName = debounce ? "modelChangedDebounce" : "modelChanged";
    window.addEventListener(eventName, listenerFn);
    () => window.removeEventListener(eventName, listenerFn);
  }, []);

  // @ts-ignore
  const { showModal, flashInfo } = window.playground.ui;
  return { model, showModal, flashInfo } as {
    model: Model;
    showModal: ShowModal;
    flashInfo: FlashInfo;
  };
};
