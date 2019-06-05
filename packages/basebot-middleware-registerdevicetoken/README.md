## basebot-middleware-registerdevicetoken

Parses and saves the `message.pushToken` field for sending push notifications.

### Usage

services/../middleware.js
```javascript
  import { logger, storage } from '../'
  import registerPushToken from 'basebot-middleware-registerdevicetoken'

  export default [
    //..
    {
      type: 'receive',
      handler: registerPushToken(logger, storage)
    }
    //..
  ]
```
