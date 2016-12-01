import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

const stock_feninv_conditions = handleActions({
  STOCK_FENINV_CONDITIONS_SET: (state, action) => action.payload,
  STOCK_FENINV_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})
const stock_feninv_mod_vis = handleActions({
  STOCK_FENINV_MOD_VIS_SET: (state, action) => action.payload
}, -1)
const stock_inv_detail_vis = handleActions({
  STOCK_INV_DETAIL_VIS_SET: (state, action) => action.payload
}, -1)
const stock_inv_detail_conditions = handleActions({
  STOCK_INV_DETAIL_CONDITIONS_SET: (state, action) => action.payload,
  STOCK_INV_LDETAIL_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})

export default {
  stock_feninv_conditions, stock_inv_detail_vis, stock_inv_detail_conditions, stock_feninv_mod_vis
}
