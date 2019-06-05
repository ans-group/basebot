import { logger } from '../services'

const error = logger('skills:debug', 'error')

export default [
  {
    pattern: 'debug:attachments',
    handler(bot, message) {
      bot.reply(message, {
        text: 'here are some attachments',
        attachments: [
          {
            title: 'Gluten free Potato Cheese Sauce',
            thumb: 'https://dummyimage.com/75x75/0074c6/ffffff.png&text=Feb%2006',
            text: 'This is a delicious sauce for any occasion.',
            color: '#ff8817',
            image: 'https://www.edamam.com/web-img/86f/86fe08fb473e457428e529d580036f57',
            buttons: [{
              text: 'View Recipe',
              url: 'http://healthiersteps.com/gluten-free-potato-cheese-sauce/'
            }, {
              text: 'Another Button',
              url: 'http://healthiersteps.com/gluten-free-potato-cheese-sauce/'
            }],
            values: [{ type: 'icon', key: 'timer', value: '20 mins' }, { type: 'icon', key: 'people', value: 'Serves 4' }] }
        ]
      })
    }
  },
  {
    pattern: 'debug:typing',
    handler: async function(bot, message) {
      bot.startConversation(message, (err, convo) => {
        if (err) return error(err)
        convo.say({
          text: 'Hmm lemme just think for a second',
          typing: true
        })
        convo.say({
          text: "Okay, I'm done!",
          delay: 5000
        })
      })
    }
  },
  {
    event: 'debug:triggerFromNotification',
    handler(bot, message) {
      bot.reply(message, "Hey, it's me!")
    }
  },
  {
    pattern: 'debug:suggestions',
    handler(bot, message) {
      bot.reply(message, {
        text: "Here's some suggestions",
        quick_replies: [
          {
            title: 'Hello',
            payload: 'Hello'
          },
          {
            title: 'Test',
            payload: 'Test'
          },
          {
            title: 'Card',
            payload: 'Card'
          },
          {
            title: 'It is time to go now',
            payload: 'Time to go'
          },
          {
            title: 'Goodbye',
            payload: 'Adios'
          }
        ]
      })
    }
  }
]
