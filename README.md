# RLBotJavaScriptExample
An example bot implemented in JavaScript

[Documentation](https://github.com/SuperVK/RLBotJS)

If you are looking for the java example bot please go [here](https://github.com/RLBot/RLBotJavaExample)

## Running guide

Install node version 12 from https://nodejs.org/. Clone this repo and add it to RLBotGUI and run it (the cfg file is in config).

## Installation guide

1. Clone this repo (or download the zip)

1. Change the port in port.cfg

1. Install yarn if you haven't already (`npm install -g yarn`) **It doesn't work without yarn!**

1. Open cmd/powershell in the example folder, and type `yarn`

1. Type `yarn dev` to start the bot

1. Load the bot (the /config/JSExample.cfg file) in the RLBotGUI and start a match

## Publishing your bot

Commit all the files in .yarn!

You can safely zip the all folders (except .git), and send them to the runner. Commiting to the rlbotpack isn't currently possible.

## Typescript

Run `yarn add typescript` and then follow this tutorial to fix the editor issue: https://yarnpkg.com/advanced/editor-sdks#vscode

And use `yarn ts-watch` and `yarn ts` for watching and compiling respectively