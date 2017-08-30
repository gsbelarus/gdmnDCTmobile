import { handleActions } from 'redux-actions'
import { addToProgress, removeFromProgress } from '../actions/progressActions'

const defaultState = {
  progresses: [],
  visible: false,
  currentProgress: null
}

export default handleActions({
  [addToProgress]: (state, action) => {
    const newProgresses = state.progresses.slice()
    newProgresses.push(action.payload)
    return {
      ...state,
      visible: Boolean(newProgresses.length),
      progresses: newProgresses,
      currentProgress: newProgresses[newProgresses.length - 1]
    }
  },
  [removeFromProgress]: (state, action) => {
    const newProgresses = state.progresses.slice()
    newProgresses.splice(newProgresses.findIndex(progress => progress === action.payload), 1)
    return {
      ...state,
      visible: Boolean(newProgresses.length),
      progresses: newProgresses,
      currentProgress: newProgresses[newProgresses.length - 1]
    }
  }
}, defaultState)