import { createHistory, useBasename } from 'history'
import { syncReduxAndRouter } from 'redux-simple-router'
import routes from './routes'
import Root from './containers/Root'
import configureStore from './redux/configureStore'

const history = useBasename(createHistory)({
  basename: __BASENAME__
})
const store = configureStore(window.__INITIAL_STATE__)
window.apiUrl = 'http://alkitab.gbippl.id/alkitab'

syncReduxAndRouter(history, store, (state) => state.router)

// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
)
