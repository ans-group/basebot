## basebot-util-qnamaker

Replaces the default response function.

When an intent can't be matched to a skill, this module will first search QNA maker for a matching response, before returning the default response if nothing is matched. 

### Usage

Requires the following env vars:

`QNA_HOST` The host URL for QNA Maker
`QNA_KBID` The knowledgebase ID you wish to reference
`QNA_KEY` Your QNA Maker key

index.js
```javascript
  import qnaMaker from 'basebot-util-qnamaker'
  import { logger } from './services'
  //...
  // right at the bottom of your file (replace the existing)
  controller.hears('.*', 'message_received', qnaMaker(logger))
```
