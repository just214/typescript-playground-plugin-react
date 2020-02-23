import React from "react";
import { css } from "goober";
import { usePlugin } from "./plugin";
import "./App.css";
// @ts-ignore TODO: Fix this
import logo from "./assets/logo.svg";

const { useEffect } = React;

const greetingComment = "// Welcome to your TypeScript Playground Plugin!\n\n";
const exampleCode = {
  start: greetingComment + "function echo(arg) { return arg};",
  end: greetingComment + "function echo<T>(arg:T): T {return arg;}"
};

const App: React.FC = () => {
  const {
    code,
    setCode,
    formatCode,
    markers,
    setDebounce,
    showModal,
    flashInfo,
    prettier
    // sandbox
    // model
    // container,
  } = usePlugin();

  setDebounce(true);

  useEffect(() => {
    setCode(exampleCode.start);
  }, [setCode]);

  useEffect(() => {
    console.log(`The editor code changed:`);
    console.log(code);
  }, [code]);

  function handleClear() {
    setCode("");
    flashInfo("Cleared!");
  }

  function handleFixCode() {
    setCode(exampleCode.end, { format: "prettier" });
  }

  function handleMonacoFormat() {
    formatCode();
  }

  function handlePrettierFormat() {
    prettier();
  }

  function handleShowModal() {
    showModal(code, `Here is your code!`);
  }

  function handleShowFlash() {
    flashInfo("Flash!");
  }

  const renderMarkers = markers
    .sort((a, b) => (a.startLineNumber >= b.startLineNumber ? 1 : -1))
    .map(marker => {
      return (
        <div
          key={marker.key}
          className={css`
            margin-top: 20px;
          `}
        >
          <p className={markerClass}>
            Line {marker.startLineNumber}:&nbsp;
            {marker.message}
          </p>
        </div>
      );
    });

  return (
    <div className={wrapperClass}>
      <header>
        <h1>TypeScript Playground Plugin</h1>
        <h3>with React</h3>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <button className={buttonClass} onClick={handleFixCode}>
        Fix the Code
      </button>
      <button className={buttonClass} onClick={handleMonacoFormat}>
        Format with Monaco
      </button>
      <button className={buttonClass} onClick={handlePrettierFormat}>
        Format with Prettier
      </button>

      <button className={buttonClass} onClick={handleShowModal}>
        Show Modal
      </button>

      <button className={buttonClass} onClick={handleShowFlash}>
        Show Flash
      </button>

      <button className={buttonClass} onClick={handleClear}>
        Clear the Editor
      </button>

      {!!markers.length && renderMarkers}
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
  padding: 5px;
  min-width: 150px;
  color: ${colors.blue};
  background: transparent;
  font-size: 0.9rem;
  border: 1px solid ${colors.blue};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background: ${colors.gray};
  }
`;

const markerClass = css`
  margin: 5px;
  padding: 0px;
  font-size: 0.9rem;
`;

export default App;
