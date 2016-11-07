/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-05 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {handleActions} from 'redux-actions'
//import update from 'react-addons-update'

const wher_ploys_vis = handleActions({
  WHER_PLOYS_VIS_SET: (state, action) => action.payload
}, -1)

export default {
  wher_ploys_vis
}
