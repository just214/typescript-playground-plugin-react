import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "./plugin";
import { PluginUtils } from "./plugin/vendor/pluginUtils";
import { PlaygroundPlugin } from "./plugin/vendor/playground";

// Used internally
const ID = "react";

// Sidebar tab label text
const DISPLAY_NAME = "React";

function makePlugin(utils: PluginUtils) {
  const customPlugin: PlaygroundPlugin = {
    id: ID,
    displayName: DISPLAY_NAME,
    didMount(sandbox, container) {
      // Mount the react app and pass the sandbox and container to the Provider wrapper to set up context.
      ReactDOM.render(
        <Provider sandbox={sandbox} container={container} utils={utils}>
          <App />
        </Provider>,
        container
      );
    },
    // Dispatch custom events for the modelChanges methods for the plugin context.
    modelChanged(_, model) {
      createCustomEvent("modelChanged", model);
    },
    // Per the Plugin source:
    // This is called occasionally as text changes in monaco,
    // it does not directly map 1 keyup to once run of the function
    // because it is intentionally called at most once every 0.3 seconds
    // and then will always run at the end.
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
  return customPlugin;
}

export default makePlugin;
