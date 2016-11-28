/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-11-24 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

const stock_take_conditions = handleActions({
  STOCK_TAKE_CONDITIONS_SET: (state, action) => action.payload,
  STOCK_TAKE_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})
const stock_take_item_conditions = handleActions({
  STOCK_TAKE_ITEM_CONDITIONS_SET: (state, action) => action.payload,
  STOCK_TAKE_ITEM_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})

export default {
  stock_take_conditions, stock_take_item_conditions
}
