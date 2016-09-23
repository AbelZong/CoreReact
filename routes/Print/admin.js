import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'admin',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Container = require('./containers/AdminContainer').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, Container)
    }, 'printAdmin')
  }
})
