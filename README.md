# typescript-playground-plugin-react

Easily create TypeScript [Playground Plugins](https://www.typescriptlang.org/v2/dev/playground-plugins/) with [React](https://reactjs.org/).

> 🚧 This project is experimental. Please use with caution.

## Table Of Contents

1. [Motivation](#motivation)
2. [Getting Started](#getting-started)
3. [Props](#props)
4. [usePlayground Hook](#useplayground-hook)
5. [Styling Your Plugin](#styling-your-plugin)
6. [More about TypeScript Playground Plugins](#more-about-typescript-playground-plugins)

## Motivation

The TypeScript Playground V2 comes packed with lots of new features, including the ability to create plugins. Per the TypeScript docs:

> The new TypeScript Playground allows people to hook into the Playground and extend it in ways in which the TypeScript team don't expect.
>
> The sidebar of the Playground uses the same plugin infrastructure as external plugins, so you have the same level of access as the playground to build interesting projects.
>
> Playground plugins have no fancy frameworks, you're free to inject them at runtime and use them if you need to - but the current plugins are built with the DOM APIs and TypeScript.

This package allows you to use React as a replacement (or addition to) the DOM APIs to create a rich, interactive UI for your plugin.

> **How does it work?**  
> The TypeScript Playground Plugin API provides lifecycle methods that are used to interact with the playground. This library works by mounting a React app inside of the `didMount` method that the API exposes. The `modelChanged` and `modelChangedDebounce` API methods are called any time the code in the editor changes. Custom events are used to broadcast the changes to a custom React hook.

## Getting Started

#### Step 1. Clone this repo and navigate to the directory

```sh
git clone git@github.com:gojutin/typescript-playground-plugin-react.git
```

```sh
cd typescript-playground-plugin-react
```

#### Step 2. Download dependencies

```sh
yarn
```

#### Step 3. Start the development server

```sh
yarn start
```

This will start a development server in watch mode. As you edit any files in the `src` directory, the app will recompile and update `dist/index.js`, which is the file that is served to the TypeScript Playground.

> _Note: This does not reload the browser when your files change. In order to see your changes, the browser will need to be manually reloaded each time you make changes to the plugin._

#### Step 4. Configure and use your plugin

Visit [https://www.typescriptlang.org/v2/en/play](https://www.typescriptlang.org/v2/en/play).

Select the **Options** tab and tick the box for **Connect to localhost:5000/index.js**.

<img src="./screenshots/screenshot1.png" style="max-width: 80%;"/>

Now, **refresh the browser**. When the playground reloads, a new tab with your plugin should appear! 🎉

<img src="./screenshots/screenshot2.png" style="max-width: 80%;"/>

You can make customizations to your plugin by modifying the `customPlugin` object in `src/index.tsx`. For instance, you can change the `displayName` property to change the tab label text for your plugin. See the `PlaygroundPlugin` interface in `src/types/playground.d.ts` for all of the available options.

## Props

Two props are provided to the `App` component:

- #### `container`

  This is the container `div` element that wraps the entire sidebar. The React app is mounted to this element. Any style changes to this element will affect the entire sidebar.

- #### `sandbox`

  A DOM library for interacting with TypeScript and JavaScript code, which powers the heart of the TypeScript playground.

  This object provides several properties and methods to interact with the playground. See all of the available types in `src/types/sandbox.d.ts` and read more about the sandbox at [http://www.typescriptlang.org/v2/dev/sandbox/](http://www.typescriptlang.org/v2/dev/sandbox/).

## `usePlayground` Hook

This hook accepts a optional config object and returns an object with three properties:

- #### `model`

  The model is an object which monaco uses to keep track of text in the editor. A new copy is returned on any change to the code in the editor. You can optionally debounce the event by passing in `{debounce: true}`.

  You can find the full type definition at `node_modules/monaco-editor/esm/vs/editor/editor.api.d.ts`. This library also includes the types so you can also use intellisense.

  ```tsx
  const { model } = usePlayground({ debounce: true });

  // Use a useEffect to listen for changes.
  useEffect(() => {
    const newCode = sandbox.getText();
    console.log(`The new code is: ${newCode}`);
  }, [model]);
  ```

- #### `showModal`

  ```typescript
  (code: string, subtitle?: string, links?: string[]) => void
  ```

  From `window.playground.ui` - This function accepts 3 arguments (code, subtitle, and links) and opens a model with the values you provide.

  ```tsx
  const { showModal } = usePlayground({ debounce: true });

  useEffect(() => {
    const newCode = sandbox.getText();
    showModal(newCode, "Here is your code");
  }, [model]);
  ```

* #### `flashInfo`

  ```typescript
  (message: string) => void
  ```

  From `window.playground.ui` - This function accepts 1 argument (message) and and flashes a quick message in the center of the screen.

  ```tsx
  const { flashInfo } = usePlayground({ debounce: true });

  useEffect(() => {
    const newCode = sandbox.getText();
    flashInfo("Your code changed!");
  }, [model]);
  ```

## Styling your plugin

This library works with normal CSS stylesheets out of the box by inlining them using PostCSS. It also includes [Goober](https://github.com/cristianbote/goober), a super light-weight (<1KB) CSS-in-JS library. There are examples of both styling approaches in `src/App.tsx`. Any other styling solutions may require additional rollup configuration.

The `container` prop provided to the `App` component contains the `div` that wraps the entire sidebar, which you can apply styles to. Be careful as this will affect all tabs in the sidebar.

## More about TypeScript Playground Plugins

[Official Playground Plugin Documentation](https://www.typescriptlang.org/v2/dev/playground-plugins/)

You can create a plugin (without React) from the official plugin template:

```sh
npm init typescript-playground-plugin playground-my-plugin
```

For convenience, this repo contains the `CONTRIBUTING.md` file included in the official plugin template. This document contains useful information about how to work with the plugins.

The `src/types` directory contains all of the TypeScript type definitions for the TypeScript Playground Plugin API. This is the best place to find the various config options, properties, and methods that are available.

### Need inspiration?

[Orta](https://github.com/orta) created a really cool plugin that lets you create presentations in the TypeScript playground using Reveal.js. You can check it out here:

[https://github.com/orta/playground-slides](https://github.com/orta/playground-slides)

He also offered these plugin ideas in [this](https://www.reddit.com/r/typescript/comments/eywcn8/learn_how_to_make_a_typescript_playground_plugin/fglyuon/) reddit thread.

- Explain the parts of a complex TS type
- Show TS -> Flow interfaces
- Run tutorials in the playground against live code
- AST Viewer
- ts-query runner
- codemod runner
- Highlight TS vs JS code
- Show all used types
- Show dts files