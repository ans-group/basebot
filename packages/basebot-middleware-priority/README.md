## basebot-middleware-priority

Priority responses for Basebot

This module is designed to work directly with ANS bot manager

### Usage

Register the middleware in /services/middleware/production.js

```javascript
   import priorityResponses from 'basebot-middleware-ratings'
   /* ... */
   export default [
      /* ... */
      {
        type: 'receive',
        handler: priorityResponses({ storage })
      }
      /* ... */
   ]
```

