/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-10 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import { handleActions } from 'redux-actions'

const sale_refund_conditions = handleActions({
  SALE_REFUND_CONDITIONS_SET: (state, action) => (action.payload)
}, {})

const order_after_detail_vis = handleActions({
  ORDER_AFTER_DETAIL_VIS_SET: (state, action) => action.payload
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

export default {
  sale_refund_conditions, order_list_do_pay_1, order_list_detail_1, order_list_to_3, order_list_to_2, order_list_to_1, order_after_detail_vis
}
