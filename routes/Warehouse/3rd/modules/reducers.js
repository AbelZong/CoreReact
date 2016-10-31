import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
const warehouse_create_vis = handleActions({
  WAREHOUSE_CREATE_VIS_SET: (state, action) => action.payload
}, -1)
const warehouse_ssNO_vis = handleActions({
  WAREHOUSE_SSNO_VIS_SET: (state, action) => action.payload
}, -1)
const warehouse_filter_conditions = handleActions({
  WAREHOUSE_FILTER_CONDITIONS_SET: (state, action) => (action.payload),
  WAREHOUSE_FILTER_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, null)

export default {
  warehouse_create_vis, warehouse_filter_conditions, warehouse_ssNO_vis
}
