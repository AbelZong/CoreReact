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
const order_list_new_egg_vis = handleActions({
  ORDER_LIST_NEW_EGG_VIS_SET: (state, action) => action.payload
}, -1)
const order_list_buyer_select_vis = handleActions({
  ORDER_LIST_BUYER_SELECT_VIS_SET: (state, action) => action.payload
}, -1)

export default {
  order_list_collapse, order_list_conditions, order_list_new_egg_vis, order_list_buyer_select_vis
}
