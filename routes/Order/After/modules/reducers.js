/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-28 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import { handleActions } from 'redux-actions'

const order_after_collapse = handleActions({
  ORDER_AFTER_COLLAPSE_SET: (state, action) => action.payload,
  ORDER_AFTER_COLLAPSE_REVER: (state, action) => !state
}, false)
const order_after_conditions = handleActions({
  ORDER_AFTER_CONDITIONS_SET: (state, action) => action.payload
}, {})
const order_after_detail_vis = handleActions({
  ORDER_AFTER_DETAIL_VIS_SET: (state, action) => action.payload
}, null)
const order_after_create_vis_1 = handleActions({
  ORDER_AFTER_CREATE_VIS_1_SET: (state, action) => action.payload
}, 0)
const order_after_bind_order_vis_1 = handleActions({
  ORDER_AFTER_BIND_ORDER_VIS_1_SET: (state, action) => action.payload
}, null)
const order_after_order_detail_vis_1 = handleActions({
  ORDER_AFTER_ORDER_DETAIL_VIS_1_SET: (state, action) => action.payload
}, 0)
const order_after_order_detail_vis_2 = handleActions({
  ORDER_AFTER_ORDER_DETAIL_VIS_2_SET: (state, action) => action.payload
}, 0)
const order_after_distributor_vis_1 = handleActions({
  ORDER_AFTER_DISTRIBUTOR_VIS_1_SET: (state, action) => action.payload
}, null)

const order_list_do_pay_1 = handleActions({
  ORDER_LIST_DO_PAY_1_SET: (state, action) => action.payload
}, null)
const order_list_detail_1 = handleActions({
  ORDER_LIST_DETAIL_1_SET: (state, action) => action.payload
}, null)
const order_list_to_3 = handleActions({
  ORDER_LIST_TO_3_SET: (state, action) => action.payload
}, null)
const order_list_to_2 = handleActions({
  ORDER_LIST_TO_2_SET: (state, action) => action.payload
}, null)
const order_list_to_1 = handleActions({
  ORDER_LIST_TO_1_SET: (state, action) => action.payload
}, null)
const order_list_expr_s_1 = handleActions({
  ORDER_LIST_EXPR_S_1_SET: (state, action) => action.payload
}, null)
export default {
  order_after_collapse, order_after_conditions, order_after_detail_vis, order_after_create_vis_1, order_after_bind_order_vis_1, order_after_order_detail_vis_1, order_after_order_detail_vis_2, order_after_distributor_vis_1,
  order_list_do_pay_1, order_list_detail_1, order_list_to_3, order_list_to_2, order_list_to_1, order_list_expr_s_1
}
