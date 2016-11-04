/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-29 14:55:24
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
const admin_brand_vis = handleActions({
  ADMIN_BRAND_VIS_SET: (state, action) => action.payload
}, -1)
const admin_brands_filter_conditions = handleActions({
  ADMIN_BRANDS_FILTER_CONDITIONS_SET: (state, action) => (action.payload),
  ADMIN_BRANDS_FILTER_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, null)
const admin_brands_loading = handleActions({
  ADMIN_BRANDS_LOADING_SET: (state, action) => action.payload
}, false)

export default {
  admin_brand_vis, admin_brands_filter_conditions, admin_brands_loading
}
