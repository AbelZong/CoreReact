import {
  injectReducers
} from 'store/reducers'
export default (store) => ({
  path: 'warehouse/3rd',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const container = require('./containers/Container').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, container)
    }, 'warehouse3rd')
  }
})
