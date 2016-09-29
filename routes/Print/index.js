import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'user',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Container = require('./containers/UserContainer').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, Container)
    }, 'printUser')
  }
})
