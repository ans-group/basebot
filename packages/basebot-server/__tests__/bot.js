import Botmock from 'botkit-mock'
import startBot from '../bot'
import storage from '../mocks/storage'

let controller, bot

jest.setTimeout(10000)

beforeAll(done => {
  controller = Botmock({ storage: storage })
  bot = controller.spawn()
  startBot(controller, bot)
  done()
})

test('Bot responds to hello', done => {
  bot.usersInput(
    [
      {
        user: 'directline:123',
        channel: 'directline:789',
        type: 'message_received',
        messages: [
          {
            deep: 1,
            waitAfter: 3000,
            isAssertion: true,
            text: 'hello there'
          }
        ]
      }
    ]
  ).then((message) => {
    expect(message).toEqual(expect.objectContaining({
      text: expect.stringMatching(`Hey there! 👋 \n\nI'm ${process.env.BOT_NAME || 'Basebot'}.`)
    }))
    done()
  })
})

test('User can tell bot their name', done => {
  bot.usersInput(
    [
      {
        user: 'directline:123',
        channel: 'directline:789',
        type: 'message_received',
        messages: [
          {
            waitAfter: 3000,
            isAssertion: true,
            text: 'Testman'
          }
        ]
      }
    ]
  ).then((message) => {
    expect(message).toEqual(expect.objectContaining({
      text: expect.stringMatching(`Nice to meet you Testman!`)
    }))
    done()
  })
})

test('Bot remembers users name', done => {
  bot.usersInput(
    [
      {
        user: 'directline:123',
        channel: 'directline:789',
        type: 'message_received',
        messages: [
          {
            waitAfter: 3000,
            isAssertion: true,
            text: 'Hey'
          }
        ]
      }
    ]
  ).then((message) => {
    expect(message).toEqual(expect.objectContaining({
      text: expect.stringMatching(`Hey Testman 👋`)
    }))
    done()
  })
})
