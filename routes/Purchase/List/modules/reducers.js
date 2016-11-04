/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-12 11:35:32
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
const pur_conditions1 = handleActions({
  PUR_CONDITIONS1_SET: (state, action) => action.payload,
  PUR_CONDITIONS1_UPDATE: (state, action) => update(state, action.update)
}, {})
const pur_conditions2 = handleActions({
  PUR_CONDITIONS2_SET: (state, action) => action.payload,
  PUR_CONDITIONS2_UPDATE: (state, action) => update(state, action.update)
}, {})
const pur_new_vis = handleActions({
  PUR_NEW_VIS_SET: (state, action) => action.payload
}, -1)
const pur_ci_vis = handleActions({
  PUR_CI_VIS_SET: (state, action) => action.payload
}, -1)
export default {
  pur_conditions1, pur_conditions2, pur_new_vis, pur_ci_vis
}
