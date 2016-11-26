import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'stock/init',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Shop = require('./containers/TestContainer').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, Shop)
    }, 'stockInit')
  }
})
