const { DATA_PROP } = require('../constant')
const db = require('../db')

function getInitialState() {
  const initialState = {}
  initialState[DATA_PROP] = []
  return initialState
}

const getState = async () => {
  return db.getState()
}
const setState = async (state) => {
  return db.setState(state).write()
}
const clearState = async () => {
  return await setState(getInitialState())
}

module.exports = {
  getState,
  setState,
  clearState
}
