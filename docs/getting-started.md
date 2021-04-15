# Getting Started Guide

This guide will cover the following steps to get you up and running with the VS Code Webview Toolkit.

1. Create a webview-based extension.
2. Install the toolkit.
3. Set up the toolkit theming utilities.

## Create A Webview-Based Extension

Before installing the toolkit we need to create a webview-based extension to use the toolkit in. The following steps are taken directly from the VS Code [Your First Extension Guide](https://code.visualstudio.com/api/get-started/your-first-extension).

To generate a basic extension we can use [Yeoman](https://yeoman.io/) and the [VS Code Extension Generator](https://www.npmjs.com/package/generator-code). Make sure you have [Node.js](https://nodejs.org/en/) and [Git](https://git-scm.com/) installed first, then install Yeoman and the generator using the following command:

```bash
npm install -g yo generator-code
```

The generator scaffolds a TypeScript or JavaScript project ready for development. Run the generator and fill out a few fields for a TypeScript project:

```bash
yo code

# ? What type of extension do you want to create? New Extension (TypeScript)
# ? What's the name of your extension? helloworld
### Press <Enter> to choose default for all options below ###

# ? What's the identifier of your extension? helloworld
# ? What's the description of your extension? LEAVE BLANK
# ? Initialize a git repository? Yes
# ? Bundle the source code with webpack? No
# ? Which package manager to use? npm

code ./helloworld
```

### Setting Up A Webview

With this basic extension created, we now need to create a webview. The following steps are an adapted version of the steps provided in the [Webview API Guide](https://code.visualstudio.com/api/extension-guides/webview)––for more information about Webviews visit the guide.

Start by navigating to the `extensions.ts` file inside the `src` directory and replacing the contents of the `activate` function with the following:

```typescript
export function activate(context: vscode.ExtensionContext) {
	let panel: vscode.WebviewPanel | undefined;

	const startCommand = vscode.commands.registerCommand("helloworld.helloWorld", () => {
		if (panel) {
			// If the webview panel already exists reveal it
			panel.reveal(vscode.ViewColumn.One);
		} else {
			// If a webview panel does not already exist create and show a new one
			panel = vscode.window.createWebviewPanel("helloworld", "Hello World", vscode.ViewColumn.One, {
				enableScripts: true,
			});

			// Set the HTML content for the new webview panel
			panel.webview.html = getWebviewContent();
		}
	});

	context.subscriptions.push(startCommand);
}
```

At this point you'll probably have noticed that there is an error because `getWebviewContent` is an undefined function, so let's fix that! Scroll to the bottom of the file and include the following:

```typescript
function getWebviewContent() {
	return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hello World!</title>
            </head>
            <body>
                <h1>Hello World!</h1>
            </body>
        </html>
	`;
}
```

### Test It All Works

Congratulations! You have officially created a basic webview extension.

To test that everything is working, inside the editor, press `F5`. This will compile and run the extension in a new Extension Development Host window.

When the host window opens, open the Command Palette (`Cmd + Shift + P`), type "Hello World", and click `enter` to run the command which should display the webview panel.

![Testing That The Webview Extension Works](./assets/webview-test.gif)

## Install The Toolkit

With an extension created, we can now install the toolkit with the following command.

```bash
npm install --save @microsoft/vscode-webview-toolkit
```

### Using The Toolkit Inside A Webview

With the package installed, we need to adjust the project so the toolkit is usable within our webview context. We'll start by updating the `getWebviewContent` content function we defined earlier to accept two new parameters.

```typescript
function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
	// ... Implementation details should be left unchanged for now ...
}

// ❗️ Also update the getWebviewContent function call inside of the activate function. ❗️
export function activate(context: vscode.ExtensionContext) {
	// ... Other code ...

	panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

	// ... Other code ...
}
```

### Create A Toolkit URI

With those changes we can now use some VS Code APIs to create a URI pointing to the toolkit package. These API calls can get a bit verbose however so we'll also create a small helper function to keep our code clean.

```typescript
function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
	const toolkitUri = getUri(webview, extensionUri, ["node_modules", "vscode-webview-toolkit", "dist", "toolkit.js"]);

	// ... Other implementation details should be left unchanged for now ...
}

function getUri(webview: vscode.Webview, extensionUri: vscode.Uri, pathList: string[]) {
	return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}
```

### Pass The URI Into The Webview

With access to the toolkit package URI we can pass it into our webview context via a regular `<script>` tag like so:

```typescript
function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
	const toolkitUri = getUri(webview, extensionUri, ["node_modules", "vscode-webview-toolkit", "dist", "toolkit.js"]);

	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script type="module" src="${toolkitUri}"></script>
                <title>Hello World!</title>
			</head>
			<body>
				<h1>Hello World!</h1>
			</body>
		</html>
	`;
}
```

### Testing It All Works

Let's check that everything works by adding some toolkit components to the webview and then opening the extension in the Extension Development Host window by pressing `F5`.

_Note that all toolkit components must be a child of the `<vscode-design-system-provider>` element with the `use-defaults` attribute set._

```typescript
function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
	const toolkitUri = getUri(webview, extensionUri, ["node_modules", "vscode-webview-toolkit", "dist", "toolkit.js"]);

	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script type="module" src="${toolkitUri}"></script>
                <title>Hello World!</title>
			</head>
			<body>
				<h1>Hello World!</h1>
                <vscode-design-system-provider use-defaults>
					<vscode-button>Howdy!</vscode-button>
				</vscode-design-system-provider>
			</body>
		</html>
	`;
}
```

![Testing That The Toolkit Works](./assets/toolkit-button-test.gif)

## Set Up The Toolkit Theming Utilities

By default the toolkit component library implements the default VS Code dark color theme. As a result, the final big step to getting started is configuring the toolkit theming utilities that will enable components to automatically consume and apply VS Code color theme changes.

_Note that this a very important step to aligning with the [VS Code Webview Guidelines](https://code.visualstudio.com/api/references/extension-guidelines#webviews) which states that "all elements in the view [should be] themeable."_

### Configure The Theme Listener Utility

The first step to this process is to import and declare the `setThemeEventListener` utility inside our extension's start command. This utility will listen for VS Code theme changes and notify the webview panel when a change has occurred.

```typescript
import { setThemeEventListener } from "@microsoft/vscode-webview-toolkit";

export function activate(context: vscode.ExtensionContext) {
	let panel: vscode.WebviewPanel | undefined;

	const startCommand = vscode.commands.registerCommand("helloworld.helloWorld", () => {
		if (panel) {
			// If the webview panel already exists reveal it
			panel.reveal(vscode.ViewColumn.One);
		} else {
			// If a webview panel does not already exist create and show a new one
			panel = vscode.window.createWebviewPanel("helloworld", "Hello World", vscode.ViewColumn.One, {
				enableScripts: true,
			});

			// Set the HTML content for the new webview panel
			panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

			// Sets up an event listener to listen for VSCode theme changes and notifies
			// the webview panel when a change has occurred
			setThemeEventListener(panel);
		}
	});

	context.subscriptions.push(startCommand);
}
```

### Configure The Apply Theme Utility

With the theme listener set we need to configure the utility that will listen for those theme changes inside the webview and then apply them to the toolkit components.

Just like we did with the toolkit package we can achieve this by updating the `getWebviewContent` function to create a URI for the `applyTheme.js` utility file and pass it into our webview context with a `<script>` tag.

```typescript
function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
	const toolkitUri = getUri(webview, extensionUri, ["node_modules", "vscode-webview-toolkit", "dist", "toolkit.js"]);
	const applyThemeUri = getUri(webview, extensionUri, ["node_modules", "vscode-webview-toolkit", "dist", "applyTheme.js"]);

	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script type="module" src="${toolkitUri}"></script>
                <script type="module" src="${applyThemeUri}"></script>
                <title>Hello World!</title>
			</head>
			<body>
				<h1>Hello World!</h1>
				<vscode-design-system-provider use-defaults>
					<vscode-button>Howdy!</vscode-button>
				</vscode-design-system-provider>
			</body>
		</html>
	`;
}
```

### Let's Test Once More

Once again, let's test that everything works by opening the Extension Development Host window (press `F5`).

Once the webview panel is open, open the Command Pallette (`Cmd + Shift + P`), search for "Preferences: Color Theme", and cycle through all the themes to see the components change!

![Testing That The Toolkit Theme Utilities Work](./assets/toolkit-theme-test.gif)

## Next Steps

Congratulations on getting started with the VS Code Webview Toolkit! 🎊

Now that you're set up, checkout the component docs for further documentation on what components are available and how to use them. Further component documentation and some guides on how to work with webviews is also provided too. Happy hacking!

- [Component Docs](./components.md)
- [Storybook – Interactive Component Sandbox](https://mttallac.azurewebsites.net/)
- [Toolkit Extension Samples](../samples)
- [VS Code Webview Guide](https://code.visualstudio.com/api/extension-guides/webview)
- [VS Code Webview Guidelines](https://code.visualstudio.com/api/references/extension-guidelines#webviews)
- [VS Code Extension API Docs](https://code.visualstudio.com/api)