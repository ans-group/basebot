import request from 'request-promise-native'
import logger from '../services/logger'

const info = logger('middleware:qnamaker', 'info')
const error = logger('middleware:qnamaker', 'error')

export default controller => {
    controller.middleware.receive.use(async function(bot, message, next) {
        if (!process.env.QNA_HOST || !process.env.QNA_KBID || !process.env.QNA_KEY) {
            info('not using QNA Maker as no key provided')
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
