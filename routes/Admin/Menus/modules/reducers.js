/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-30 16:12:12
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {handleActions} from 'redux-actions'
const admin_menus_modal_vis = handleActions({
  ADMIN_MENUS_MODAL_VIS_SET: (state, action) => (action.payload)
}, -1)
const admin_menus = handleActions({
  ADMIN_MENUS_SET: (state, action) => (action.payload)
}, [])

export default {
  admin_menus_modal_vis, admin_menus
}
