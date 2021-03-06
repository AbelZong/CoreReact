/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-20 15:09:54
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
const admin_company_vis = handleActions({
  ADMIN_COMPANY_VIS_SET: (state, action) => action.payload
}, -1)
const admin_company_filter_conditions = handleActions({
  ADMIN_COMPANY_FILTER_CONDITIONS_SET: (state, action) => (action.payload),
  ADMIN_COMPANY_FILTER_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, null)
const admin_company_loading = handleActions({
  ADMIN_COMPANY_LOADING_SET: (state, action) => action.payload
}, false)

export default {
  admin_company_vis, admin_company_filter_conditions, admin_company_loading
}
