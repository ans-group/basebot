var responses = []

export default ({ storage }) => {
  // fetch emergency responses
  fetchEmergencyResponses()
  setInterval(fetchEmergencyResponses, 1000 * 60 * 2)
  return (bot, message, next) => {
    let found = false
    responses.forEach(item => {
      item.phrases.forEach(phrase => {
        if (message.text.includes(phrase) && !found) {
          found = true
          bot.reply(message, item.response)
        }
      })
    })
    if (!found) {
      return next()
    }
  }
  function fetchEmergencyResponses() {
    storage.responses.all({ key: 'priority', value: '1', attributes: ['intentName', 'response', 'phrases', 'voiceEnabled'] })
      .then(emergencyResponses => {
        responses = emergencyResponses
      })
  }
}
