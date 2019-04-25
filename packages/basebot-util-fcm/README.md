## basebot-util-fcm

Send notifications using FCM

### Usage

Requires the following env vars:

`FIREBASE` Your service account JSON ([docs](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk))

#### Example

```javascript
  import { notify, schedule } from 'basebot-util-fcm'
  import { storage } from '../services'

  const notification = {
    userId: 'some-user-id',
    storage,
    payload: {
      text: 'Your report is ready',
      trigger: 'reportReady',
      click_action: 'NOTIFICATION_CLICK'
    }
  }

  // sending a notification immediately
  notify(notification)

  // scheduling a notification
  schedule(new Date(2020, 11, 21, 5, 30, 0), notification) // any date object
```
