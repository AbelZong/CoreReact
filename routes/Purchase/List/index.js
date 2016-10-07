import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'purchase/list',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const container = require('./containers/Container').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, container)
    }, 'purchaseList')
  }
})
