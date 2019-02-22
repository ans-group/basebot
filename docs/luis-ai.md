# Register and Configure LUIS.AI endpoint

Please follow this guide to register and configure LUIS.AI endpoint.

1. Download the LUIS configuration file **[here](../../../../raw/master/documents/luis-ai/base-bot.json)**, make sure the saved file's extension is .json not .json.txt

2. Open the Microsoft LUIS.AI website https://luis.ai/# and login using your normal Azure credentials.

3. If this is you first time logging into LUIS.AI you will be presented with the following screens.

    3.1. On the Permissions Request page
    * Click **Accept** to continue

        <img src="../images/luis-ai-01.png" alt="Permissions" width="400"/>

    3.2 On the Welcome page
    * Select **United Kingdom** from the dropdown list

    * Check "*I agree that this service is subject to the same terms under which I subscribe to Cognitive Services through Azure*"

    * Click **Continue**

        <img src="../images/luis-ai-02.png" alt="Welcome" width="400"/>

    3.3 On the next Welcome page
    * Click **Create a LUIS app now** button to continue and you will be directed to the My Apps page.

        <img src="../images/luis-ai-03.png" alt="I Agree" width="400"/>

4. On the My Apps page

    * Click on **Import new app**

        <img src="../images/luis-ai-04.png" alt="Import" width="400"/>
    * Click on **Choose app file** and select the **base-bot.json** file you downloaded in step 1
    * Optionally enter a name
    * Click on **Done**

        <img src="../images/luis-ai-05.png" alt="Import" width="400"/>

5. Train and Publish the model

    * Click on the **Train** button, wait a few seconds for the model to complete training.

        <img src="../images/luis-ai-06.png" alt="Train" width="400"/>
    * Click on the **Publish** button

        <img src="../images/luis-ai-07.png" alt="Publish" width="400"/>

    * A popup will appear, leave the Environment set to Production and click on the **Publish** button

        <img src="../images/luis-ai-08.png" alt="Publish" width="400"/>

6. Endpoint Url

    * From the menu bar click on **MANAGE**

        <img src="../images/luis-ai-09.png" alt="Publish" width="400"/>
    * From the side menu on the left, click on **Keys and Endpoints**
    * Copy the **Endpoint** url, located at the bottom right of the screen, and save the url, it will be required during the bot server deployment.

        <img src="../images/luis-ai-10.png" alt="Publish" width="400"/>
    * The endpoint url will be used to populate the **luis_url** field when deploying the bot server template later.

[Return to main page](../../README.md)