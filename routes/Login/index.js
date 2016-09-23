import {
  injectReducers
} from 'store/reducers'
const Container = require('./containers/LoginContainer').default
const reducers = require('./modules/reducers').default

export default (store) => ({
  path: 'login',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducers(store, reducers)
      cb(null, Container)
    }, 'login')
  }
})
