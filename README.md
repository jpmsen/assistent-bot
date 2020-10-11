<!--suppress HtmlDeprecatedAttribute -->
<h1 align="center">Assistent Bot</h1>
A Discord bot that includes Quality of Life updates created for a specific Discord server.

<h3>Contributing</h3>
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