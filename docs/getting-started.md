---
layout: page
title: Getting Started Guide
---


This guide is used to deploy and configure the infrastructure required to run the Base Bot.

The guide may look complicated at times but please stick with it, it's actually much simpler than it looks, and we expect it to only take around 75 minutes to complete. However if you are an ANS customer and would like help with the deployment, please reach out to your ANS account manager who can arrange for technical assistance.

# Pre-Requisites

Please ensure you meet the below pre-requisites.

* An active Azure Subscription
* Admin Permissions to Azure Subscription
* Admin Permissions to Azure AD to create application registrations
* Git client installed

# Bot Channels Registration

Please follow this guide to create and register and configure a Bot Channels registration.

You need a Bot Channels Registration to be able to use Bot Service functionality. A bot registration lets you connect your bot to channels.

## To create a Bot Channels Registration, follow these steps

1. Login to the Azure portal https://portal.azure.com 

2. Click the **Create a resource** link found on the upper left-hand corner of the Azure portal, then select AI + Machine Learning > Bot Channels Registration, you may need to click see all.

3. A new blade will open with information about the Bot Channels Registration. Click the Create button to start the creation process.

4. In the Bot Service blade, provide the requested information about your bot as specified in the table below the image.

    <img src="{{ "/images/bot-registration01.png" | relative_url }}" alt="Create Bot" width="400"/>

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

    <img src="{{ "/images/bot-registration02.png" | relative_url }}" alt="Create Bot" width="400"/>

3. On the registration page, copy the **Application Id** and save it to a file, this will be the **ms_app_id** and is required during the bot server deployment.

4. Click **Generate New Password**. This will generate a new password for your bot. Copy the password and save it to a file, this will be the **ms_app_password** and is required during the bot server deployment. *Note: This is the only time you will see this password, if you do not save the password you will need to repeat the process.*

    <img src="{{ "/images/bot-registration03.png" | relative_url }}" alt="Create Bot" width="400"/>

## Add Direct Line Channel connection

The native mobile application requires a Direct Line channel connection key, to create this follow the below steps

1. On the Bot registration page, click on the **Channels** link

2. Click on the Direct Line button, (Globe Icon)

    <img src="{{ "/images/bot-registration04.png" | relative_url }}" alt="Create Bot" width="400"/>

3. Under **Secret keys** click **Show**, copy the key and save to a file, this will be required later.

    <img src="{{ "/images/bot-registration05.png" | relative_url }}" alt="Create Bot" width="400"/>

4. Click **Done**



# LUIS.AI Configuration

Please follow this guide to register and configure LUIS.AI endpoint.

1. Download the LUIS configuration file **[here](../../../../basebot/base-bot.json)**, make sure the saved file's extension is .json not .json.txt

2. Open the Microsoft LUIS.AI website https://luis.ai/# and login using your normal Azure credentials.

3. If this is you first time logging into LUIS.AI you will be presented with the following screens.

    3.1. On the Permissions Request page
    * Click **Accept** to continue

        <img src="{{ "/images/luis-ai-01.png" | relative_url }}" alt="Permissions" width="400"/>

    3.2 On the Welcome page
    * Select **United Kingdom** from the dropdown list

    * Check "*I agree that this service is subject to the same terms under which I subscribe to Cognitive Services through Azure*"

    * Click **Continue**

        <img src="{{ "/images/luis-ai-02.png" | relative_url }}" alt="Welcome" width="400"/>

    3.3 On the next Welcome page
    * Click **Create a LUIS app now** button to continue and you will be directed to the My Apps page.

        <img src="{{ "/images/luis-ai-03.png" | relative_url }}" alt="I Agree" width="400"/>

4. On the My Apps page

    * Click on **Import new app**

        <img src="{{ "/images/luis-ai-04.png" | relative_url }}" alt="Import" width="400"/>
    * Click on **Choose app file** and select the **base-bot.json** file you downloaded in step 1
    * Optionally enter a name
    * Click on **Done**

        <img src="{{ "/images/luis-ai-05.png" | relative_url }}" alt="Import" width="400"/>

5. Train and Publish the model

    * Click on the **Train** button, wait a few seconds for the model to complete training.

        <img src="{{ "/images/luis-ai-06.png" | relative_url }}" alt="Train" width="400"/>
    * Click on the **Publish** button

        <img src="{{ "/images/luis-ai-07.png" | relative_url }}" alt="Publish" width="400"/>

    * A popup will appear, leave the Environment set to Production and click on the **Publish** button

        <img src="{{ "/images/luis-ai-08.png" | relative_url }}" alt="Publish" width="400"/>

6. Endpoint Url

    * From the menu bar click on **MANAGE**

        <img src="{{ "/images/luis-ai-09.png" | relative_url }}" alt="Publish" width="400"/>
    * From the side menu on the left, click on **Keys and Endpoints**
    * Copy the **Endpoint** url, located at the bottom right of the screen, and save the url, it will be required during the bot server deployment.

        <img src="{{ "/images/luis-ai-10.png" | relative_url }}" alt="Publish" width="400"/>
    * The endpoint url will be used to populate the **luis_url** field when deploying the bot server template later.



# Azure Bot Server Deployment

Follow this guide to deploy the Bot Server ARM Template into your Azure subscription.

## Deploy ARM Template

1. Click on the **Deploy to Azure** button, you will be asked to login, use your Azure credentials.

    [![Deploy to Azure]({{ "/images/azure_deploy.png" | relative_url }})](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fans-group%2Fbasebot%2Fmaster%2Ftemplate%2Fazuredeploy.json)

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

        <img src="{{ "/images/template_01.png" | relative_url }}" alt="Deployment" width="400"/>

3. Check *"I agree to the terms and conditions as stated above"* and click on **Purchase**

4. Open the deployment screen.
    * Click on the Notifications button at the top of the Azure portal screen (The bell icon).

    * Click on Deployment in progress... this will open the Deployment screen

        <img src="{{ "/images/template_02.png" | relative_url }}" alt="Deployment" width="400"/>

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

        <img src="{{ "/images/template_03.png" | relative_url }}" alt="Messaging Endpoint" width="400"/>
    * Click on the **Save** button.

2. Add a Web Platform to the Bot Channels Registration

    * On the Bot registration page, click on the **Settings** link.

    * From the Settings blade, click **Manage**. This is the link appearing by the Microsoft App ID. Under the messaging endpoint you configured in the previous step. This link will open a window where you can add a web platform. Login using your Azure credentials. *Note: You will need to have been assigned at least, the "Application administrator" role in your Azure AD.*

        <img src="{{ "/images/template_04.png" | relative_url }}" alt="Manage" width="400"/>

    * In the new windows scroll down to the Platforms section then click on the **Add Platform** button.

        <img src="{{ "/images/template_05.png" | relative_url }}" alt="Manage" width="400"/>

    * Click on the Web button

        <img src="{{ "/images/template_06.png" | relative_url }}" alt="Manage" width="400"/>

    * Check **Allow Implicit Flow** and then populate the Redirect URLs field with the **WebAppRedirectUrl** url value that we collected at step 5 in the previous section.

        <img src="{{ "/images/template_07.png" | relative_url }}" alt="Manage" width="400"/>

    * Scroll to the bottom of the page and click **Save**.

3. Your infrastructure is now full configured and ready to connect you bot client to.


# QNA Maker Configuration

Please follow this guide to configure and register QnA Maker.

### Configure QnA Maker

1. Open the Microsoft QNAMAKER.AI website https://www.qnamaker.ai and login using your normal Azure credentials.

2. From the navigation click on **Create a knowledge base**

3. On the **Create a knowledge base** page, go straight to STEP 2, and from the dropdowns select.

    * Microsoft Azure Directory ID *(Azure Directory where you deployed the server template)*
    * Azure subscription name *(Azure Subscription where you deployed the server template)*
    * Azure QnA service *(The new QnA service that was deployed by the template)*

4. At STEP 3, enter a name for you Knowledge Base

5. At STEP 4, scroll down to **Chit-chat** section and select **The Professional**, this will create some sample QnA's for you to get started with.

6. At STEP 5, click on **Create your KB**

7. Once your bot has saved click on **Save and train** in the navigation bar.

8. Now click on the **Publish** tab on the navigation bar, then click the **Publish** button. This will publish the knowledge base to the Azure QnA maker service.

9. Once it has successfully published copy the knowledge base id and authorization key values that are displayed on the screen.

    * Knowledge Base ID, this is found on the first line, copy the GUID. It is represented with x's in the sample below.

            POST /knowledgebases/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/generateAnswer

    * Endpoint Key, this is found on the third line, copy the GUID. It is represented with x's in the sample below.

            Authorization: EndpointKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

### Configure Bot Server

Now we have created a QnA Maker knowledge base, we need to configure our Azure App Service hosting the Bot server to use it.

1. Login to the Azure portal, https://portal.azure.com

2. In the Azure portal, Click on Resource Groups from the menu on the left of the Azure portal.

3. Open the resource group you deployed the Azure Bot Server template into.

4. Locate the Azure App Service hosting the Bot Server and click on its name to open it.

5. On the menu to the left, find Application Settings and click on it to open.

6. Scroll down to the **Application** Settings section, then find the App Setting named **QNA_KBID**.

7. In the value field paste Knowledge Base ID copied in Step 9 of the previous section.

8. Now find the App Setting named **QNA_KEY**.

9. In the value field paste Endpoint Key copied in Step 9 of the previous section.

10. At the top of the page click on the **Save** button.


# Build Native Apps (optional)

Please follow this guide to build the native Bot client apps for Apple IOS and Android devices. 

We have documented and simplified the build process, however this guide expects you to have an good level of knowledge in the building and deployment of native mobile applications, including the process of code signing and submitting apps to the Apple and Google app stores.

If you are an ANS customer and require assistance please contact your ANS account manager.


## Pre-requisites Apple IOS

To build the Apple IOS app you must have an [Apple Developer](https://developer.apple.com) Account and paid subscription.

In the [Apple Developer](https://developer.apple.com) portal you need to have created.

- iOS App Development certificate *(Create the certificate [here](https://developer.apple.com/account/ios/certificate/create))*
- Apple Push Notifications service (APNs) key *(Follow the "Create the authentication key" steps [here](https://firebase.google.com/docs/cloud-messaging/ios/certs) and ensure you have the downloaded key available for later.)*


You will also need with the following software and packages installed.

- X-Code
- usbmuxd
- libimobiledevice
- ideviceinstaller
- ios-deploy
- node.js
- git client

Which can be installed use the brew commands below.

- brew update
- brew install --HEAD usbmuxd
- brew link usbmuxd
- brew install --HEAD libimobiledevice
- brew install ideviceinstaller
- brew install ios-deploy

## Pre-requisites Android

To build the Android app you must have a [Keystore](https://flutter.io/docs/deployment/android#create-a-keystore) for Code Signing the app along following software and plugins installed.


- Android Studio
    - Flutter Plugin
    - Dart Plugin
- node.js
- git client


## Setup
ANS have created a CLI tool, that will help simplify the process, of downloading the source code and creating a project and initial debug build.

1. To get started open a command window and enter the below commands.

        sudo npm i -g @webantic/basebot-cli
        basebot create

2. Follow the on screen instructions of the CLI tool answering the questions below.

- What is the name of your app? *(Enter the same name as entered during the bot registration)*

- What should your app bundle be called? *(Hit enter to accept default)*

- What is the name of the bot? *(Enter the same name as entered during the bot registration)*

- Install Flutter? *(Yes - Unless you already have Flutter installed)*

- Create and link Firebase project? *(Yes, you will be asked to sign in with a Google Account - If you select no you will will need to manually create a firebase project with IOS and Android apps.)*

- Paste your Direct Line secret *(This was created earlier during the [Azure Bot Channels Registration](#bot-channels-registration) process.)*

- Paste your Endpoint Url *(This is the Url of the Azure Webapp hosting the Bot server, it can be found in the template.deployment outputs)*

- What is the bot handle on Direct Line? (Enter the same name as entered during the bot registration)

- Where is your keystore located for signing? *(This is required for signing Android app and is not required for IOS, see Android pre-requisites section above.)*

- What is your key alias? *(This is required for signing Android app and is not required for IOS, see Android pre-requisites section above.)*

- What is your key password? *(This is required for signing Android app and is not required for IOS, see Android pre-requisites section above.)*

4. A new directory containing the Bot app source code will have been created with the same name you entered in Step 1 of the CLI tool, CD into this directory.

### Update Azure Bot Server Firebase config
Now the Firebase project has been configured we need to update the Azure App Service, that is hosting the Bot Server's Firebase environment variable.

1. Download the Firebase configuration.

- Open the Firebase website https://console.firebase.google.com/ and login.
- Click on the Project tile.
- Now click on the cog icon next to Project Overview on the menu on the left side. Then click on Project Setting.
- Under the Service accounts tab, scroll down and click on Generate new private key button, then click on the Generate key button, a JSON key file will be downloaded.

2. Update the Azure App Service settings

- Login to the Azure portal, https://portal.azure.com
- In the Azure portal, Click on Resource Groups from the menu on the left of the Azure portal.
- Open the resource group you deployed the Azure Bot Server template into.
- Locate the Azure App Service hosting the Bot Server and click on its name to open it.
- On the menu to the left, find Application Settings and click on it to open.
- Scroll down to the **Application** Settings section, then find the App Setting named **FIREBASE**.
- In the value field paste the contents of the JSON file downloaded from the Firebase console in step 1.
- At the top of the page click on the **Save** button.

### Apple IOS Build
1. Login to the [Firebase](https://console.firebase.google.com/) console and configure the Apple APN settings on you new IOS App.

- Click on you new Firebase project
- On the left menu click on the **Cog** symbol next to **Project Overview**.
- Click on **Project Settings**
- Click on **Cloud Messaging**
- Scroll down to **iOS app configuration**
- Under **APNs Authentication Key** click on **Upload** to upload the APN Key that was downloaded from the Apple Developer portal.

2. Connect an iPhone to a USB port and run the following command to build and run app

        ~/flutter/bin/flutter run

3. Alternatively To open the project in X-Code run the following command, then open the X-Code workspace file located  *{botname}/ios/Runner.xcworkspace*

        ~/flutter/bin/flutter build ios --debug --no-codesign

### Android Build
1. Connect an Android phone to a USB port and run the following command to build and run app

        ~/flutter/bin/flutter run

2. Alternatively To create a debug build to open in Android Studio run the following command, then open the apk file located  *{botname}/build/outputs/apk/debug/app-debug.apk.*

        ~/flutter/bin/flutter build apk --debug
