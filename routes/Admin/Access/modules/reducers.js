/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-15 16:50:02
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import { handleActions } from 'redux-actions'

const access_list = handleActions({
  ACCESS_LIST: (state, action) => (action.payload)
}, null)
const access_modify_visiable = handleActions({
  ACCESS_MODIFY_VISIABLE: (state, action) => (action.payload)
}, -1)

export default {
  access_list, access_modify_visiable
}
