import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'print/modify',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Container = require('./containers/ModifyContainer').default
      const reducers = require('./modules/reducersModify').default
      injectReducers(store, reducers)
      cb(null, Container)
    }, 'printModify')
  }
})
