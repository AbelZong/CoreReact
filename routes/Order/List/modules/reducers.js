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
const order_list_detail_1 = handleActions({
  ORDER_LIST_DETAIL_1_SET: (state, action) => action.payload
}, null)
const order_list_sellerNote_1 = handleActions({
  ORDER_LIST_SELLERNOTE_1_SET: (state, action) => action.payload
}, null)
// const order_list_buyerNote_1 = handleActions({
//   ORDER_LIST_BUYERNOTE_1_SET: (state, action) => action.payload
// }, null)
const order_list_expr_1 = handleActions({
  ORDER_LIST_EXPR_1_SET: (state, action) => action.payload
}, null)
const order_list_expr_2 = handleActions({
  ORDER_LIST_EXPR_2_SET: (state, action) => action.payload
}, null)
const order_list_buyerAddress_1 = handleActions({
  ORDER_LIST_BUYERADDRESS_1_SET: (state, action) => action.payload
}, null)
const order_list_to_cancel_1 = handleActions({
  ORDER_LIST_TO_CANCEL_1_SET: (state, action) => action.payload
}, null)
const order_list_to_exception_1 = handleActions({
  ORDER_LIST_TO_EXCEPTION_1_SET: (state, action) => action.payload
}, null)
const order_list_whouse_1 = handleActions({
  ORDER_LIST_WHOUSE_1_SET: (state, action) => action.payload
}, null)
const order_list_do_pay_1 = handleActions({
  ORDER_LIST_DO_PAY_1_SET: (state, action) => action.payload
}, null)

export default {
  order_list_collapse, order_list_conditions, order_list_new_egg_vis, order_list_buyer_select_vis,
  order_list_detail_1, order_list_sellerNote_1, order_list_buyerAddress_1, order_list_expr_1, order_list_expr_2,
  order_list_to_exception_1, order_list_to_cancel_1, order_list_whouse_1, order_list_do_pay_1
}
