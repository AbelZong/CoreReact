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
  name: '根目录'
}])
const product_cat_vis = handleActions({
  PRODUCT_CAT_VIS_SET: (state, action) => action.payload
}, 0)
const product_cat_prop_vis = handleActions({
  PRODUCT_CAT_PROP_VIS_SET: (state, action) => action.payload
}, -1)

export default {
  product_cat_breads, product_cat_conditions, product_cat_vis, product_cat_prop_vis
}
