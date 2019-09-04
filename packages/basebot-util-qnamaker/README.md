## basebot-util-qnamaker

Replaces the default response function.

When an intent can't be matched to a skill, this module will first search QNA maker for a matching response, before returning the default response if nothing is matched. 

### Usage

Requires the following env vars:

`QNA_HOST` The host URL for QNA Maker

`QNA_KBID` The knowledgebase ID you wish to reference

`QNA_KEY` Your QNA Maker key

`QNA_THRESHOLD` the confidence rating to accept (default is 70/100)

services/middleware/production.js
```javascript
  import qnaMaker from 'basebot-util-qnamaker'
  import { logger } from './services'
  //...
  {
    type: 'heard',
    handler: qnaMaker(logger)
  }
```
