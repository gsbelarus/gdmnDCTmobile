import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import appReducer from './reducers/appReducer'
import progressReducer from './reducers/progressReducer'
import scannerReducer from './reducers/scannerReducer'

export default function configureStore () {
  return createStore(
    combineReducers({
      appState: appReducer,
      progressState: progressReducer,
      scannerState: scannerReducer
    }),
    applyMiddleware(thunk)
  )
}