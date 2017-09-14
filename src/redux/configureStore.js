import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import appReducer from './reducers/appReducer'
import progressReducer from './reducers/progressReducer'

export default function configureStore () {
  return createStore(
    combineReducers({
      appState: appReducer,
      progressState: progressReducer
    }),
    applyMiddleware(thunk)
  )
}