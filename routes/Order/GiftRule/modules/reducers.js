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

const order_giftrule_conditions = handleActions({
  ORDER_GIFTRULE_CONDITIONS_SET: (state, action) => (action.payload)
}, null)
const order_giftrule_modal_1_vis = handleActions({
  ORDER_GIFTRULE_MODAL_1_VIS_SET: (state, action) => (action.payload)
}, null)
const order_giftrule_modal_2_vis = handleActions({
  ORDER_GIFTRULE_MODAL_2_VIS_SET: (state, action) => (action.payload)
}, null)
const order_giftrule_collapse = handleActions({
  ORDER_GIFTRULE_COLLAPSE_SET: (state, action) => (action.payload),
  ORDER_GIFTRULE_COLLAPSE_REVER: (state, action) => !state
}, false)

export default {
  order_giftrule_conditions, order_giftrule_modal_1_vis, order_giftrule_collapse, order_giftrule_modal_2_vis
}
