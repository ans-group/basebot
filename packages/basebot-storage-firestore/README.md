## basebot-storage-firestore

Basebot/botkit storage driver for Firestore

### Usage

Requires the following env vars:

`FIREBASE` Your service account JSON ([docs](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk))
`DB_URL` Your Firestore URL ([docs](https://www.appypie.com/faqs/how-to-obtain-your-firebase-data-url))

services/../storage
```javascript
  import storage from 'basebot-storage-firestore'
  import { logger } from '../'

  export default storage(logger)
```
