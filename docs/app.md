# Building the native Bot client apps

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

- Create and link Firebase project? *(Yes, you will be asked to sign in with a Google Account - If you select no you will will need to manually create a firebase project with IOS and Android apps, see [Firebase Registration](./documents/firebase-registration/README.md).)*

- Paste your Direct Line secret *(This was created earlier during the [Azure Bot Channels Registration](./documents/bot-registration/README.md) process.)*

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