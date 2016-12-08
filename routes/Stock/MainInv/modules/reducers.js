import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

const stock_maininv_conditions = handleActions({
  STOCK_MAININV_CONDITIONS_SET: (state, action) => action.payload,
  STOCK_MAININV_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})
const stock_virtual_vis = handleActions({
  STOCK_VIRTUAL_VIS_SET: (state, action) => action.payload
}, -1)
const stock_safeinv_vis = handleActions({
  STOCK_SAFEINV_VIS_SET: (state, action) => action.payload
}, [])
const stock_invlock_vis = handleActions({
  STOCK_INVLOCK_VIS_SET: (state, action) => action.payload
}, -1)
const stock_invlock_mod_vis = handleActions({
  STOCK_INVLOCK_VIS_MOD_SET: (state, action) => action.payload
}, -1)
const stock_invlock_conditions = handleActions({
  STOCK_INVLOCK_CONDITIONS_SET: (state, action) => action.payload,
  STOCK_INVLOCK_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})
const stock_inv_detail_vis = handleActions({
  STOCK_INV_DETAIL_VIS_SET: (state, action) => action.payload
}, -1)
const stock_inv_detail_conditions = handleActions({
  STOCK_INV_DETAIL_CONDITIONS_SET: (state, action) => action.payload,
  STOCK_INV_LDETAIL_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, {})

export default {
  stock_maininv_conditions, stock_virtual_vis, stock_invlock_vis, stock_invlock_conditions, stock_invlock_mod_vis, stock_inv_detail_vis, stock_inv_detail_conditions, stock_safeinv_vis
}
