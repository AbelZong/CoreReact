import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
const admin_users_modal_vis = handleActions({
  ADMIN_USERS_MODAL_VIS_SET: (state, action) => action.payload
}, -1)
const admin_users_pwdmod_vis = handleActions({
  ADMIN_USERS_PWDMOD_VIS_SET: (state, action) => action.payload
}, -1)
const admin_users_filter_conditions = handleActions({
  ADMIN_USERS_FILTER_CONDITIONS_SET: (state, action) => (action.payload),
  ADMIN_USERS_FILTER_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, null)
const admin_users_loading = handleActions({
  ADMIN_USERS_LOADING_SET: (state, action) => action.payload
}, false)

export default {
  admin_users_modal_vis, admin_users_filter_conditions, admin_users_loading, admin_users_pwdmod_vis
}
