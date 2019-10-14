## basebot-middleware-ratings

Ratings for Basebot.


### Usage

Register the middleware in /services/middleware/production.js

```javascript
   import ratings from 'basebot-middleware-ratings'
   import logger from '../logger'
   import storage from '../storage'
   /* ... */
   export default [
      /* ... */
      {
        type: 'receive',
        handler: ratings({ logger, storage })
      }
      /* ... */
   ]
```

Register the models required (if not done already) in /services/storage/production.js

```javascript
  import { models: ratingsModels } from 'basebot-middleware-ratings'
  const myOtherModels = { /* ... * /}
  const models = Object.assign(myOtherModels, ratingsModels)
```
