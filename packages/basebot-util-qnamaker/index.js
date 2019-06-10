import request from 'request-promise-native'

export default logger => async function(bot, message) {
  const info = logger('qnaMaker', 'info')
  const error = logger('qnaMaker', 'error')
  if (!process.env.QNA_HOST || !process.env.QNA_KBID || !process.env.QNA_KEY) {
    info('not using QNA Maker as no key provided')
    return bot.reply(message, `Didn't catch that, sorry`)
  }
  const url = `${process.env.QNA_HOST}/knowledgebases/${process.env.QNA_KBID}/generateAnswer`
  try {
    const res = await request.post(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `EndpointKey ${process.env.QNA_KEY}`
      },
      json: { question: message.text }
    })
    if (res.answers && res.answers.length && res.answers[0].score > process.env.QNA_THRESHOLD) {
      return bot.reply(message, res.answers[0].answer)
    }
  } catch (err) {
    bot.reply(message, `Didn't catch that, sorry`)
    error('Could not check QNA Maker', err)
  }
}
