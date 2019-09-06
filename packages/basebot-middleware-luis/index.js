import request from 'request'

export default (logger) => {
  const error = logger('middleware:luis', 'error')
  if (!process.env.LUIS_URI) {
    error('LUIS_URI must be set')
  }

  return { receive, hearIntent }

  function receive() {
    var serviceUri = process.env.LUIS_URI.trim()
    if (serviceUri.lastIndexOf('&q=') != serviceUri.length - 3) {
      serviceUri += '&q='
    }
    const minThreshold = process.env.LUIS_MIN_THRESHOLD || 0.1
    const captureThreshold = process.env.LUIS_CAPTURE_THRESHOLD || 0.7
    return (bot, message, next) => {
      // We will only process the text and either there's no topIntent
      // or the score for the topIntent is below the captureThreshold.
      if (message.text &&
        (!message.topIntent || message.topIntent.score < captureThreshold)) {
        const uri = serviceUri + encodeURIComponent(message.text)
        request.get(uri, (err, res, body) => {
          try {
            if (!err) {
              const result = JSON.parse(body)

              if (result.topScoringIntent && result.topScoringIntent.intent !== 'None') {
                // API v2.0
                message.topIntent = result.topScoringIntent
                message.entities = result.entities || []
                message.action = result.topScoringIntent.actions && result.topScoringIntent.actions[0].triggered ? result.topScoringIntent.actions[0] : null
              } else if (!result.topScoringIntent) {
                // API v1.0

                // Intents for the builtin Cortana app don't return a score.
                if (result.intents.length == 1 && !result.intents[0].hasOwnProperty('score')) {
                  result.intents[0].score = 1.0
                }

                // Find top intent
                // - Only return entities for the model with the top intent.
                for (let i = 0; i < result.intents.length; i++) {
                  const intent = result.intents[i]
                  if (intent.score > minThreshold &&
                    (!message.topIntent || intent.score > message.topIntent.score)) {
                    message.topIntent = intent
                    message.entities = result.entities || []
                    message.action = intent.actions && intent.actions[0].triggered ? intent.actions[0] : null
                  }
                }
              }
            } else {
              console.error(err.toString())
            }
          } catch (e) {
            console.error(e.toString())
          }
          next()
        })
      } else {
        next()
      }
    }
  }

  function hearIntent(tests, { topIntent }) {
    if (topIntent) {
      const intent = topIntent.intent.toLowerCase()
      for (let i = 0; i < tests.length; i++) {
        if (tests[i].trim().toLowerCase() == intent) {
          return true
        }
      }
    }
    return false
  }
}
