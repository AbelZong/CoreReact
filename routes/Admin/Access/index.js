import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'Access',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Access = require('./containers/Container').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, Access)
    }, 'adminAccess')
  }
})
