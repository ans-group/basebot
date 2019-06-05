## basebot-storage-azuretables

Basebot/botkit storage driver for Azure Table Storage

### Usage

Requires the following env vars:

`DB_URL` Azure Table Storage connection string ([docs](https://docs.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string))

services/../storage
```javascript
  import storage from 'basebot-storage-firestore'
  import { logger } from '../'

  export default storage(logger)
```
