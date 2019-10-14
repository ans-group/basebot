## basebot-middleware-analytics

Analytics for Basebot.


### Usage

Register the middleware in /services/middleware/production.js

```javascript
   import analytics from 'basebot-middleware-analytics'
   import logger from '../logger'
   import storage from '../storage'
   /* ... */
   export default [
      /* ... */
      {
        type: 'receive',
        handler: analytics({ logger, storage })
      }
      /* ... */
   ]
```

Register the models required (if not done already) in /services/storage/production.js

```javascript
  import { analyticsModels } from 'basebot-middleware-analytics'
  const myOtherModels = { /* ... * /}
  const models = Object.assign(myOtherModels, analyticsModels)
```
