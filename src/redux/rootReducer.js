import { combineReducers } from 'redux'
import { routeReducer as router } from 'redux-simple-router'
import counter from './modules/counter'
import verse from './modules/verse'

export default combineReducers({
  counter,
  verse,
  router
})
