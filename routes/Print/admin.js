/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-22 10:13:36
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
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
