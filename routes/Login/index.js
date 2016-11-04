/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-08 15:52:13
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {
  injectReducers
} from 'store/reducers'
const Container = require('./containers/LoginContainer').default
const reducers = require('./modules/reducers').default

export default (store) => ({
  path: 'login',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducers(store, reducers)
      cb(null, Container)
    }, 'login')
  }
})
