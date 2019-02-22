# Configure QnA Maker and Bot Server

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

[Return to main page](../../README.md)