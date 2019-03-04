const teamsRef = {}
const usersRef = {}
const channelsRef = {}

const driver = {
  teams: {
    get: get(teamsRef),
    save: save(teamsRef),
    all: all(teamsRef)
  },
  channels: {
    get: get(channelsRef),
    save: save(channelsRef),
    all: all(channelsRef)
  },
  users: {
    get: get(usersRef),
    save: save(usersRef),
    all: all(usersRef)
  }
}
export default driver

function get(storageRef) {
  return id => new Promise((resolve, reject) => {
    resolve(storageRef[id] || {})
  })
}

function save(storageRef) {
  return data => new Promise((resolve, reject) => {
    storageRef[data.id] = data
    resolve(data)
  })
}

function all(storageRef) {
  return () => new Promise((resolve, reject) => {
    resolve(storageRef)
  })
}
