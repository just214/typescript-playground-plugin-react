import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "./playground";

const customPlugin: import("./types/playground").PlaygroundPlugin = {
  id: "react",
  displayName: "React",
  didMount(sandbox, container) {
    ReactDOM.render(
      <Provider sandbox={sandbox} container={container}>
        <App />
      </Provider>,
      container
    );
  },
  modelChanged(_, model) {
    const modelChangedEvent = createCustomEvent("modelChanged", model);
    window.dispatchEvent(modelChangedEvent);
  },
  modelChangedDebounce(_, model) {
    const modelChangedDebounceEvent = createCustomEvent(
      "modelChangedDebounce",
      model
    );
    window.dispatchEvent(modelChangedDebounceEvent);
  }
  // Don't need these
  // willUnmount(sandbox, container) {}
  // didUnmount(sandbox, container) {}
};

function createCustomEvent(
  name: string,
  model: import("monaco-editor").editor.ITextModel
) {
  return new CustomEvent(name, {
    detail: {
      model
    }
  });
}

export default customPlugin;
