import request from 'request-promise-native'
import Debug from 'debug'

const log = Debug('basebot:middleware:qnamaker:log')
const error = Debug('basebot:middleware:qnamaker:error')

export default controller => {
    controller.middleware.receive.use(async function(bot, message, next) {
        if (!process.env.QNA_HOST || !process.env.QNA_KBID || !process.env.QNA_KEY) {
            log('not using QNA Maker as no key provided')
            return next()
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
                return bot.reply(message, { text: res.answers[0].answer, pushToken: message.raw_message.pushToken })
            }
        } catch (err) {
            error('Could not check QNA Maker', err)
        }
        next()
    })
}
