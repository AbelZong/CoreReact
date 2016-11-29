import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'maininv',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Shop = require('./containers/Container').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, Shop)
    }, 'stockMainInv')
  }
})
