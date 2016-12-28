import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

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
const pb_limit_vis = handleActions({
  PB_LIMIT_VIS_SET: (state, action) => action.payload
}, null)  // 1： 限定条件（单件） 2：限定条件（多件）
const pb_limit_policy_vis = handleActions({
  PB_LIMIT_POLICY_VIS_SET: (state, action) => action.payload
}, [])
const pb_list_condition = handleActions({
  PB_LIAT_CONSITION_SET: (state, action) => action.payload,
  PB_LIAT_CONSITION_UPDATE: (state, action) => update(state, action.update)
}, {})
const pb_limit_set_vis = handleActions({
  PB_LIMIT_SET_VIS_SET: (state, action) => action.payload
}, -1)
const pb_pickor_set_vis = handleActions({
  PB_PICKOR_SET_VIS_SET: (state, action) => action.payload
}, {})
const pb_batch_log_vis = handleActions({
  PB_BATCH_LOG_VIS_SET: (state, action) => action.payload
}, -1)
const pb_batch_detail_vis = handleActions({
  PB_BATCH_DETAIL_VIS_SET: (state, action) => action.payload
}, -1)
const pb_batch_unique_vis = handleActions({
  PB_BATCH_UNIQUE_VIS_SET: (state, action) => action.payload
}, -1)
const pb_limit_ploys_vis = handleActions({
  PB_LIMIT_PLOYS_VIS_SET: (state, action) => action.payload
}, [])


export default {
  order_after_detail_vis, order_list_do_pay_1, order_list_detail_1, order_list_to_3, order_list_to_2, order_list_to_1, pb_limit_vis, pb_limit_policy_vis, pb_list_condition, pb_pickor_set_vis, pb_limit_set_vis, pb_batch_log_vis, pb_batch_detail_vis, pb_batch_unique_vis, pb_limit_ploys_vis
}
