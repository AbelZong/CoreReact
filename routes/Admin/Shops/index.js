/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: JieChen
* Date  :
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {
  injectReducers
} from 'store/reducers'

export default (store) => ({
  path: 'admin/shops',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Shop = require('./containers/Container').default
      const reducers = require('./modules/reducers').default
      injectReducers(store, reducers)
      cb(null, Shop)
    }, 'adminShops')
  }
})
