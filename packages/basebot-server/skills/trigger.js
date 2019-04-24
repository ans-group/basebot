export default [
  {
    on: 'event',
    response (bot, message, controller) {
      if (message.trigger) {
        controller.trigger(message.trigger, [bot, message, controller])
      }
    }
  }
]
