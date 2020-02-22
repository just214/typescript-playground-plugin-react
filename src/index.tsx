import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "./plugin";

// Used internally
const ID = "react";

// Sidebar tab label text
const DISPLAY_NAME = "React";

const customPlugin: import("./plugin/vendor/playground").PlaygroundPlugin = {
  id: ID,
  displayName: DISPLAY_NAME,
  didMount(sandbox, container) {
    // Mount the react app and pass the sandbox and container to the Provider wrapper to set up context.
    ReactDOM.render(
      <Provider sandbox={sandbox} container={container}>
        <App />
      </Provider>,
      container
    );
  },
  // Dispatch custom events for the modelChanges methods for the plugin context.
  modelChanged(_, model) {
    createCustomEvent("modelChanged", model);
  },
  modelChangedDebounce(_, model) {
    createCustomEvent("modelChangedDebounce", model);
  },
  willUnmount(_, container) {
    ReactDOM.unmountComponentAtNode(container);
  }
};

function createCustomEvent(
  name: string,
  model: import("monaco-editor").editor.ITextModel
) {
  const event = new CustomEvent(name, {
    detail: {
      model
    }
  });
  window.dispatchEvent(event);
}

export default customPlugin;
