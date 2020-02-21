import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const customPlugin: import("./types/playground").PlaygroundPlugin = {
  id: "react",
  displayName: "React",
  didMount(sandbox, container) {
    ReactDOM.render(<App sandbox={sandbox} container={container} />, container);
  },
  modelChanged(_, model) {
    var event = new CustomEvent("modelChanged", {
      detail: {
        // sandbox,
        model
      }
    });
    window.dispatchEvent(event);
  },
  modelChangedDebounce(_, model) {
    var event = new CustomEvent("modelChangedDebounce", {
      detail: {
        // sandbox,
        model
      }
    });
    window.dispatchEvent(event);
  }
  // willUnmount(sandbox, container) {}
  // didUnmount(sandbox, container) {}
};

export default customPlugin;
