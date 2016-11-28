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

const logistics_freight_expr_1_vis = handleActions({
  LOGISTICS_FREIGHT_EXPR_1_VIS: (state, action) => (action.payload)
}, null)
const logistics_freight_area_1_vis = handleActions({
  LOGISTICS_FREIGHT_AREA_1_VIS: (state, action) => (action.payload)
}, null)

export default {
  logistics_freight_expr_1_vis, logistics_freight_area_1_vis
}
