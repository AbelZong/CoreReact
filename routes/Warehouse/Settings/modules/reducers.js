/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-15 13:49:20
* Last Updated: 2016-12-08 chenjie
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {handleActions} from 'redux-actions'
// import update from 'react-addons-update'

const ware_pile_vis = handleActions({
  WARE_PILE_VIS_SET: (state, action) => action.payload
}, {})
const ware_pile_new_vis = handleActions({
  WARE_PILE_NEW_VIS_SET: (state, action) => action.payload
}, {})
const ware_pile_sku_vis = handleActions({
  WARE_PILE_SKU_VIS_SET: (state, action) => action.payload
}, -1)
const ware_pile_ser = handleActions({
  WARE_PILE_SER_SET: (state, action) => action.payload
}, {})
export default {
  ware_pile_vis, ware_pile_ser, ware_pile_new_vis, ware_pile_sku_vis
}
