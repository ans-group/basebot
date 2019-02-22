# Basebot Server

This repo is the brains of Basebot and contains the central "monolithic" server-side app. 




Getting Started
---
When you first clone the repo you'll want to run `npm i` to install dependencies. After that, you'll need two files:
* firebase.json
* .env

Both of these files live in the root. 

`firebase.json` can be downloaded from the firebase dashboard. To set up a project, follow the guide [here](https://github.com/ans-group/basebot-server/tree/master/documents/firebase-registration)

`.env` is a standard file that contains local env vars. It should have the following vars at a minimum:

* **BOT_NAME** the user-facing name of your bot (e.g. Basebot, HAL 9000, Johnny 5, KITT)
* **MS_APP_ID** the Bot service app id to use
* **MS_APP_PASSWORD** the corresponding secret to use with the above
* **LUIS_URI** the LUIS instance URI - without this LUIS will not work
* **DB_URL** at the moment this should be an [Azure Table Storage](https://azure.microsoft.com/en-gb/services/storage/tables/) connection string
* **USE_LT_SUBDOMAIN** (local dev only) this will enable localtunnel at the subdomain specified

If you want to use QNA Maker you'll also need the following:

* **QNA_HOST** The URL for QNA Maker
* **QNA_KEY** The secret key for QNA Maker
* **QNA_KBID** The Knowledgebase ID you want to use (we only support a single one at the mo)
* **QNA_THRESHOLD** The confidence threshold out of 100 (80 seems to work quite well)

Once you've done all that, you can run the project :+1:

To run, simply use: `npm run dev` 

To run in production, build using `npm run build` and then run `npm start`

**A note on local development**

In order to get the bot service instance you're using to talk to your local bot you'll have to set the `Messaging Endpoint` configuration value under your app settings to the localtunnel URI generated when you start the app in dev mode (using `USE_LT_SUBDOMAIN`)

Project Structure
---
### Skills
All of the main conversation logic goes here. Files are automatically imported from the `/skills` directory and should export an array of objects with the following schema:

| | | |
| --- | --- | --- |
|**hears**|`String` or `[String]`|*(optional)*  either a LUIS intent (e.g. `Social.Greeting`) *or* a single/array of strings/regexes (e.g. `['My name is (.*)', 'Call me (.*)']`|
| **on** |`String`| *(optional)* similar to hears: the event to trigger the skill on (e.g. `conversationUpdate`). This can be any string and can be triggered with [controller.trigger](https://botkit.ai/docs/core.html#controllertrigger) |
| **response** |`function(bot, message, controller)`| The callback to invoke. The various botkit instances provided should allow you to do virtually anything you need to conversation-wise. See the [botkit docs](https://botkit.ai/docs) for more info
| **bypassLuis** |`bool`| *(optional)* boolean that represents whether to bypass LUIS - if this is set to false then hears will expect an intent, if it is true then hears should be a botkit-style regex/string.

**NB** either `hears` *or* `on` should be specified.

### Middleware
All [Botkit middleware](https://botkit.ai/docs/middleware.html) goes here. Files are automatically imported from the `/middleware` directory and should export a function that takes a single `controller` argument. See [/middleware/auth.js](middleware/auth.js) for a succinct example.

### Services
An "everything else" folder for specialised classes and functions. These can export any format. Examples include, auth and utility functions. 

Testing
---
Tests are written using [Jest](https://jestjs.io/) and stored in the \_\_tests\_\_ directory. To test the entire codebase use `npm test`

Libraries Used
---
Check out the documentation on some of the main libraries (roughly in order of their importance):

* [Botkit](https://botkit.ai/docs)
* [Azure bot service & Directline](https://docs.microsoft.com/en-us/azure/bot-service/?view=azure-bot-service-4.0)
* [Firebase (Auth, Messaging, Firestore)](https://firebase.google.com/docs) (disabled by default)
* [Azure Table Storage](https://docs.microsoft.com/en-us/azure/storage/)
* [LUIS](https://docs.microsoft.com/en-gb/azure/cognitive-services/luis/what-is-luis)
* [QNA Maker](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/)
* [Jest](https://jestjs.io/)
