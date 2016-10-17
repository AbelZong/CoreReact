import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
const pur_conditions1 = handleActions({
  PUR_CONDITIONS1_SET: (state, action) => action.payload,
  PUR_CONDITIONS1_UPDATE: (state, action) => update(state, action.update)
}, {})
const pur_conditions2 = handleActions({
  PUR_CONDITIONS2_SET: (state, action) => action.payload,
  PUR_CONDITIONS2_UPDATE: (state, action) => update(state, action.update)
}, {})
const pur_new_vis = handleActions({
  PUR_NEW_VIS_SET: (state, action) => action.payload
}, -1)
const pur_ci_vis = handleActions({
  PUR_CI_VIS_SET: (state, action) => action.payload
}, -1)
export default {
  pur_conditions1, pur_conditions2, pur_new_vis, pur_ci_vis
}
