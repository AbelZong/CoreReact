import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'Company',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Company = require('./containers/Container').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, Company)
    }, 'adminCompany')
  }
})
