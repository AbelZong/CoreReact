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

const stock_init_modify_vis = handleActions({
  STOCK_INIT_MODIFY_VIS_SET: (state, action) => action.payload
}, [])
const stock_init_ware_vis = handleActions({
  STOCK_INIT_WARE_VIS_SET: (state, action) => action.payload
}, -1)
const stock_init_conditions = handleActions({
  STOCK_INIT_CONDITIONS_SET: (state, action) => action.payload,
  STOCK_INIT_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})
const stock_init_item_conditions = handleActions({
  STOCK_INIT_ITEM_CONDITIONS_SET: (state, action) => action.payload,
  STOCK_INIT_ITEM_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})
export default {
  stock_init_modify_vis, stock_init_conditions, stock_init_item_conditions, stock_init_ware_vis
}
