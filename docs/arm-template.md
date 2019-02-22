# Deploy Bot Server ARM Template

Follow this guide to deploy the Bot Server ARM Template into your Azure subscription.

## Deploy ARM Template

1. Click on the **Deploy to Azure** button, you will be asked to login, use your Azure credentials.

    [![Deploy to Azure](../images/azure_deploy.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fans-group%2Fbasebot-server%2Fmaster%2Ftemplate%2Fazuredeploy.json)

2. On the Custom deployment page, complete the fields using the information you collected during the previous steps.

    **BASICS**

    * **Subscription:** Choose an existing subscription.

    * **Resource group:** Choose the resource group you deployed the Bot Registration to earlier.

    * **Location:** Leave as default, its inherited from the resource group.

    **SETTINGS**

    * **Name:** *Enter a shortname for the bot, must be alphanumeric only with no Hyphens or Underscores and a maximum of 6 characters in length.

    * **ms_app_id:** The ms_app_id, recorded when creating the bot registration.

    * **ms_app_secret:** The ms_app_password, recorded when creating the bot registration.

    * **Luis_uri:** The LUIS.AI endpoint url, that was recorded when registering the LUIS.AI endpoint.

        <img src="../images/template_01.png" alt="Deployment" width="400"/>

3. Check *"I agree to the terms and conditions as stated above"* and click on **Purchase**

4. Open the deployment screen.
    * Click on the Notifications button at the top of the Azure portal screen (The bell icon).

    * Click on Deployment in progress... this will open the Deployment screen

        <img src="../images/template_02.png" alt="Deployment" width="400"/>

5. Retrieve Outputs
    * On the deployment screen wait for the deployment to complete, it should take no more than 5 minutes.

    * Once complete click on **Outputs**

    * Copy the contents of the **MessagingEndpoint** field, we need this information to apply to the Bot Channels Registration we created earlier.

    * Copy the contents of the **WebAppRedirectUrl** field, we need this information to create a Web Platform in the Bot Channels Registration we created earlier.

## Update Bot Channels Registration

Now the Bot Server has been deployed we need to update the Bot Channels registration with the Messaging Endpoint Url and Add a Web Platform.

1. Updating the Bot Channels Registration messaging endpoint.
    * In the Azure portal, Click on Resource Groups from the menu on the left of the Azure portal.

    * Open the resource group you deployed the Bot Channels Registration in.

    * Locate the Bot Channels Registration and click on its name to open it.

    * Click on the **Settings** link.

    * Locate the Messaging Endpoint field and enter the **MessagingEndpoint** url that we collected at step 5 in the previous section.

        <img src="../images/template_03.png" alt="Messaging Endpoint" width="400"/>
    * Click on the **Save** button.

2. Add a Web Platform to the Bot Channels Registration

    * On the Bot registration page, click on the **Settings** link.

    * From the Settings blade, click **Manage**. This is the link appearing by the Microsoft App ID. Under the messaging endpoint you configured in the previous step. This link will open a window where you can add a web platform. Login using your Azure credentials. *Note: You will need to have been assigned at least, the "Application administrator" role in your Azure AD.*

        <img src="../images/template_04.png" alt="Manage" width="400"/>

    * In the new windows scroll down to the Platforms section then click on the **Add Platform** button.

        <img src="../images/template_05.png" alt="Manage" width="400"/>

    * Click on the Web button

        <img src="../images/template_06.png" alt="Manage" width="400"/>

    * Check **Allow Implicit Flow** and then populate the Redirect URLs field with the **WebAppRedirectUrl** url value that we collected at step 5 in the previous section.

        <img src="../images/template_07.png" alt="Manage" width="400"/>

    * Scroll to the bottom of the page and click **Save**.

3. Your infrastructure is now full configured and ready to connect you bot client to.

[Return to main page](../../README.md)