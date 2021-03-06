/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-28 15:17:33
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
const product_cat_conditions = handleActions({
  PRODUCT_CAT_CONDITIONS_SET: (state, action) => action.payload
}, {
  ParentID: 0
})
const product_cat_breads = handleActions({
  PRODUCT_CAT_BREADS_SET: (state, action) => action.payload,
  PRODUCT_CAT_BREADS_UPDATE: (state, action) => update(state, action.update)
}, [{
  id: 0,
  name: '根类目'
}])
const product_cat_vis = handleActions({
  PRODUCT_CAT_VIS_SET: (state, action) => action.payload
}, 0)
const product_cat_prop_vis = handleActions({
  PRODUCT_CAT_PROP_VIS_SET: (state, action) => action.payload
}, -1)
const product_cat_prop_copy_vis = handleActions({
  PRODUCT_CAT_PROP_COPY_VIS_SET: (state, action) => action.payload
}, null)

export default {
  product_cat_breads, product_cat_conditions, product_cat_vis, product_cat_prop_vis, product_cat_prop_copy_vis
}
