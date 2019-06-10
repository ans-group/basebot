## basebot-storage-firestore

DynamoDB storage module for Basebot

### Usage

Requires the following env vars:

`AWS_REGION`
`AWS_SECRET_ACCESS_KEY`
`AWS_ACCESS_KEY_ID`

services/../storage
```javascript
  import storage from 'basebot-storage-dynamodb'
  import { logger } from '../'

  export default storage(logger)
```
