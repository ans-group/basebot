# Firebase Cloud Messaging

Firebase Cloud Messaging (FCM) is a cross-platform messaging solution that lets you reliably deliver messages at [no cost](https://firebase.google.com/pricing/).

To enable the Base Bot to send push notifications to mobile devices please configure Firebase Cloud Messaging using the steps below.

1. Open the Firebase website https://console.firebase.google.com/ and login. (You'll need a Google account)

2. On the Welcome to Firebase screen
    * Click on **Add Project**, a pop will open.

        <img src="../images/firebase-01.png" alt="New Project" width="400"/>

3. Complete the **Add a project** form to create your project, and click **Continue**
    * Project name: **Enter a project name**
    * Analytics Location: **United Kingdom**
    * Use the default settings for sharing Google Analytics for Firebase data: **Un-Check**

        <img src="../images/firebase-02.png" alt="New Project" width="400"/>

4. On the **Customise data sharing for your new project** form
    * Leave all items un-checked and click **Create project**

5. Once the project is created, click **Continue**

6. Click on the cog icon next to **Project Overview** on the menu on the left side. Then click on **Project Settings**

    <img src="../images/firebase-03.png" alt="New Project" width="400"/>

7. Under the **General** tab, scroll down and click on the iOS icon
    * Enter com.*CUSTOMERNAME*.bot in the first field and click **Register app**
    * Click the **Download GoogleService-Info.plist** button. A file will be downloaded
    * Click the cross on the top left and then click the blue Add App button on the middle right of the page.

8. Under the **General** tab, scroll down and click on the **Add App** button
    * Choose the **Android** icon
    * Enter com.*CUSTOMERNAME*.bot in the first field and click **Register app**
    * Click the **Download google-services.json** button. A file will be downloaded
    * Click the cross on the top left and then click the blue Add App button on the middle right of the page.

9. Under the **Service accounts** tab, scroll down and click on **Generate new private key** button, then click on the **Generate key** button, a key file will be downloaded.

10. Keep these 3 files safe as they will be required to build the native mobile applications.
    * firebase-adminsdk.json (key file)
    * GoogleService-Info.plist (iOS app file)
    * google-services.json (Android app file)

11. The contents of the firebase-adminsdk.json will also be used to populate the **firebase** field when deploying the bot server template.

[Return to main page](../../README.md)
