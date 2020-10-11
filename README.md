<!--suppress HtmlDeprecatedAttribute -->
<h1 align="center">Assistent Bot</h1>
A Discord bot that includes Quality of Life updates created for a specific Discord server.

<h2>Features</h2>
------

This bot is still in development. You can find the current live version on the master branch.
- This bot can remove or add roles to a user.
- This bot can clear channel messages in a given parameter
- This bot has a dynamic help command.
- This bot has an info command for admins to check certain information of the bot.
- This bot gives additional log messages to admins. These log message will inform the admins about how specific commands are being used in the Discord server.

Please check out the [command documentation](/docs/COMMANDS.md) for a comprohensive documentation about all the commands available.

<h2>Contributing</h2>
------

When adding new features, please make sure to make your pull requests off the `development` branch. Thank you!

### Requirements
- Nodejs
    - Windows: https://nodejs.org/en/
    - MacOS: https://nodejs.org/en/ or `brew install node` when using a packagemanager like Homebrew.
    - Linux: Consult https://nodejs.org/en/download/package-manager/ for more information.
- A Discord Bot Application: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot

### Getting started
1. Clone the repository
2. Setup the development environment
    ```shell script
    npm install
    ```
3. Create a new `config.json` file using the example
    ```shell script
    cp config.json.example config.json
    ```
4. Edit `config.json` to your preferences.

### Running the bot
1. Run the mod
    ```shell script
    npm run dev
    ```
**Note:** This command runs `nodemon index.js`.