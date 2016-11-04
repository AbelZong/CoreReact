/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-31 14:40:51
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
const warehouse_create_vis = handleActions({
  WAREHOUSE_CREATE_VIS_SET: (state, action) => action.payload
}, -1)
const warehouse_ssNO_vis = handleActions({
  WAREHOUSE_SSNO_VIS_SET: (state, action) => action.payload
}, -1)
const warehouse_filter_conditions = handleActions({
  WAREHOUSE_FILTER_CONDITIONS_SET: (state, action) => (action.payload),
  WAREHOUSE_FILTER_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, null)
const warehouse_apply_vis = handleActions({
  WAREHOUSE_APPLY_VIS_SET: (state, action) => action.payload
}, -1)

export default {
  warehouse_create_vis, warehouse_filter_conditions, warehouse_ssNO_vis, warehouse_apply_vis
}
