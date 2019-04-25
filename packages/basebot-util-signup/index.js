import uuid from 'uuid/v1'

export default storage => {
  return (req, res) => {
    try {
      const id = uuid()
      controller.storage.users.save({ id })
      // return without waiting - should be fine
      res.set('Content-Type', 'application/json')
      res.json({ success: true, id })
    } catch (err) {
      res.set('Content-Type', 'application/json')
      res.status(500).json({ success: false, message: err })
    }
  }
}
