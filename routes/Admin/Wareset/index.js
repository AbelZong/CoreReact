import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'admin/wareset',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Wareset = require('./containers/Container').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, Wareset)
    }, 'adminWareset')
  }
})
