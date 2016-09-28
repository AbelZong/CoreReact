import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'preset',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Container = require('./containers/PresetContainer').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, Container)
    }, 'printPreset')
  }
})
