import {handleActions} from 'redux-actions'
const admin_menus_modal_vis = handleActions({
  ADMIN_MENUS_MODAL_VIS_SET: (state, action) => (action.payload)
}, -1)
const admin_menus = handleActions({
  ADMIN_MENUS_SET: (state, action) => (action.payload)
}, [])

export default {
  admin_menus_modal_vis, admin_menus
}
