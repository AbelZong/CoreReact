/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-11 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import { handleActions } from 'redux-actions'
import update from 'react-addons-update'
const order_list_collapse = handleActions({
  ORDER_LIST_COLLAPSE_SET: (state, action) => action.payload,
  ORDER_LIST_COLLAPSE_REVER: (state, action) => !state
}, false)
const order_list_conditions = handleActions({
  ORDER_LIST_CONDITIONS_SET: (state, action) => action.payload,
  ORDER_LIST_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})

export default {
  order_list_collapse, order_list_conditions
}
