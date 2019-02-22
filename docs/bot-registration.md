
# Create and Configure Bot Channels Registration

Please follow this guide to create and register and configure a Bot Channels registration.

You need a Bot Channels Registration to be able to use Bot Service functionality. A bot registration lets you connect your bot to channels.

## To create a Bot Channels Registration, follow these steps

1. Login to the Azure portal https://portal.azure.com 

2. Click the **Create a resource** link found on the upper left-hand corner of the Azure portal, then select AI + Machine Learning > Bot Channels Registration, you may need to click see all.

3. A new blade will open with information about the Bot Channels Registration. Click the Create button to start the creation process.

4. In the Bot Service blade, provide the requested information about your bot as specified in the table below the image.

    <img src="../images/bot-registration01.png" alt="Create Bot" width="400"/>

    **Recommended Settings**

    | Setting | Suggested value | Description |
    | --- | --- | --- |
    | **Bot name:** | Your bots display name | *The display name for the bot that appears in channels and directories. This should be 6 - 8 characters long. Please make a note of the name as it will be required in later steps* |
    | **Subscription:** | Your subscription | *Select the Azure subscription you want to use.* |
    | **Resource Group** | myResourceGroup | *You can create a new resource group or choose from an existing one.*|
    | **Location**: | UK West | *Choose a location near where your bot is deployed or near other services your bot will access.* |
    | **Pricing tier** | F0 | *Select a pricing tier. You may update the pricing tier at any time. For more information, see Bot Service pricing.*
    | **Messaging endpoint** | Leave empty | *This will be the url of Azure Web App that hosts the bot server*  + /botframework/receive. **Leave empty for now** |
    | **Application Insights** | Off | *Decide if you want to turn Application Insights On or Off. If you select On, you must also specify a regional location.* |
    | **Microsoft App ID and password** | Auto create App ID and password |*Leave this as Auto create, a new Microsoft App ID and password will be created for you in the bot creation process.* |

5. Click Create to create the service and register your bots messaging end point.

6. Confirm that the registration has been created by checking the Notifications. The notifications will change from Deployment in progress... to Deployment succeeded. Click Go to resource button to open the bots resources blade.

## Bot Channels Registration password

The Bot Channels Registration bot service does not have an app service associated with it. Because of that, this bot service only has a MicrosoftAppID. You need to generate the password manually and save it yourself. You will need this password.

To generate a MicrosoftAppPassword, follow these steps

1. On the Bot registration page, click on the **Settings** link

2. From the Settings blade, click **Manage**. This is the link appearing by the Microsoft App ID. This link will open a window where you can generate a new password. Login using your Azure credentials. *Note: You will need to have been assigned at least, the "Application administrator" role in your Azure AD.*

    <img src="../images/bot-registration02.png" alt="Create Bot" width="400"/>

3. On the registration page, copy the **Application Id** and save it to a file, this will be the **ms_app_id** and is required during the bot server deployment.

4. Click **Generate New Password**. This will generate a new password for your bot. Copy the password and save it to a file, this will be the **ms_app_password** and is required during the bot server deployment. *Note: This is the only time you will see this password, if you do not save the password you will need to repeat the process.*

    <img src="../images/bot-registration03.png" alt="Create Bot" width="400"/>

## Add Direct Line Channel connection

The native mobile application requires a Direct Line channel connection key, to create this follow the below steps

1. On the Bot registration page, click on the **Channels** link

2. Click on the Direct Line button, (Globe Icon)

    <img src="../images/bot-registration04.png" alt="Create Bot" width="400"/>

3. Under **Secret keys** click **Show**, copy the key and save to a file, this will be required later.

    <img src="../images/bot-registration05.png" alt="Create Bot" width="400"/>

4. Click **Done**

[Return to main page](../../README.md)
