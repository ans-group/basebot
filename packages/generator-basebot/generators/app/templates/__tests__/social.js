import channels from '../'
const { controller } = channels.test
const { bot } = controller

jest.setTimeout(10000)

test('User can tell bot their name', done => {
  bot.usersInput(
    [
      {
        user: 'user123',
        channel: 'socket',
        type: 'message_received',
        messages: [
          {
            waitAfter: 3000,
            isAssertion: true,
            text: 'my name is Testman'
          }
        ]
      }
    ]
  ).then((message) => {
    expect(message).toEqual(expect.objectContaining({
      text: expect.stringMatching(`Great, I'll call you Testman from now on 😊`)
    }))
    done()
  })
})

test('Bot remembers users name', done => {
  bot.usersInput(
    [
      {
        user: 'user123',
        channel: 'socket',
        type: 'message_received',
        messages: [
          {
            waitAfter: 3000,
            isAssertion: true,
            text: 'who am i?'
          }
        ]
      }
    ]
  ).then((message) => {
    expect(message).toEqual(expect.objectContaining({
      text: expect.stringMatching(`You're Testman! I'd never forget you 😁`)
    }))
    done()
  })
})
