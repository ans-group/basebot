# How to contribute

Thanks for taking an interest in contributing to the BaseBot framework. 

If you haven't already, check out the [readme](https://github.com/ans-group/basebot/blob/master/readme.md) which should give you a good overview over project structure, conventions etc.

Here are some other useful links:

* [Botkit](https://botkit.ai/docs)
* [Azure bot service & Directline](https://docs.microsoft.com/en-us/azure/bot-service/?view=azure-bot-service-4.0)
* [Firebase (Auth, Messaging, Firestore)](https://firebase.google.com/docs)
* [LUIS](https://docs.microsoft.com/en-gb/azure/cognitive-services/luis/what-is-luis)
* [QNA Maker](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/)

## Testing

Test coverage isn't very good currently. Writing a couple of tests would be a great contribution for someone looking to help.

Tests are stored in the \_\_tests\_\_ directory. Use `npm test` to run tests

## Submitting changes

Please create a [Pull Request](https://github.com/ans-group/basebot/pull/new/master) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

    $ git commit -m "A brief summary of the commit
    > 
    > A paragraph describing what changed and its impact."

## Coding conventions

We utilize the [Standard](https://standardjs.com/) JS style conventions. Some highlights of the style are:

* **2 spaces** – for indentation
* **Single quotes for strings** – except to avoid escaping
* **No unused variables** – this one catches tons of bugs!
* **No semicolons**
* **Space after keywords** if (condition) { ... }
* **Space after function name** function name (arg) { ... }
* Always use === instead of == – but obj == null is allowed to check null || undefined.
* Always handle the node.js err function parameter
* Declare browser globals with /* global */ comment at top of file
  * Prevents accidental use of vaguely-named browser globals like open, length, event, and name.
  * Example: /* global alert, prompt */
  * Exceptions are: window, document, and navigator

Thanks,
Calvin, Nathan and the rest of ANS
