/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-09 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
const product_list2_modify_vis = handleActions({
  PRODUCT_LIST2_MODIFY_VIS_SET: (state, action) => action.payload
}, -1)
const product_list2_conditions = handleActions({
  PRODUCT_LIST2_CONDITIONS_SET: (state, action) => action.payload,
  PRODUCT_LIST2_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})

export default {
  product_list2_modify_vis, product_list2_conditions
}
