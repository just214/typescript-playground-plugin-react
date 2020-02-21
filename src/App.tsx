import React from "react";
import { css } from "goober";
import { usePlayground } from "./hooks/usePlayground";
import { Sandbox } from "./types/playground";
import logo from "./assets/logo.svg";
import "./App.css";

const { useEffect } = React;

type Props = {
  sandbox: Sandbox;
  container: HTMLDivElement;
};

const App: React.FC<Props> = ({ sandbox, container }) => {
  const { model, flashInfo, showModal } = usePlayground({ debounce: true });

  useEffect(() => {
    sandbox.setText('const greet = (): string => "Hi👋";');
  }, []);

  useEffect(() => {
    console.log("The editor code changed to: ", sandbox.getText());
  }, [model]);

  function handleClear() {
    sandbox.setText("");
    flashInfo("Cleared!");
  }

  function handleOpenModal() {
    showModal(sandbox.getText(), "Here is your code.");
  }

  return (
    <div className={wrapperClass}>
      <header>
        <h1>TypeScript Playground Plugin</h1>
        <h3>with React</h3>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <button className={buttonClass} onClick={handleOpenModal}>
        Open the Modal
      </button>
      <button className={buttonClass} onClick={handleClear}>
        Clear the Editor
      </button>
    </div>
  );
};

const colors = {
  darkgray: "hsla(0, 0%, 7%, 1)",
  gray: "hsla(0, 0%, 21%, 1)",
  blue: "hsla(193, 95%, 68%, 1)"
};

const wrapperClass = css`
  background: ${colors.darkgray};
  text-align: center;
  min-height: 100vh;
  padding: 10px;
  color: white;

  h1,
  h3 {
    font-weight: 300;
  }
`;

const buttonClass = css`
  display: inline-block;
  margin: 5px;
  border: none;
  background: transparent;
  color: ${colors.blue};
  cursor: pointer;
  font-size: 0.9rem;
  border-radius: 20px;
  transition: background-color 0.3s;
  &:hover {
    background: ${colors.gray};
  }
`;

export default App;
