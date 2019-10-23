export default ({ channels, storage, logger, server, app }) => {
  const controllers = channels.map(channel => {
    const {start, controller, name} = channel({ storage, logger })
    start({ server, app })
    return { controller, name }
  })
  return controllers
}
