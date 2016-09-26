import { handleActions } from 'redux-actions'
import update from 'react-addons-update'
//import store from 'utils/store' //吃相不太好看

const print_admin_collapse = handleActions({
  PRINT_ADMIN_COLLAPSE_SET: (state, action) => action.payload,
  PRINT_ADMIN_COLLAPSE_REVER: (state, action) => !state
}, false)
const print_systypes = handleActions({
  SYSTYPES_SET: (state, action) => action.payload,
  SYSTYPES_UPDATE: (state, action) => {
    return update(state, action.update)
  }
}, [])
const print_admin_sysmodify = handleActions({ //从此节操碎一地
  PRINT_ADMIN_SYSMODIFY_SET: (state, action) => action.payload
}, 0)
const print_admin_type_active = handleActions({
  PRINT_ADMIN_TYPE_ACTIVE_SET: (state, action) => action.payload
}, -1)
const print_type_doge = handleActions({ //节操早就掉光光
  PRINT_TYPE_DOGE_SET: (state, action) => action.payload,
  PRINT_TYPE_DOGE_CREATE: (state, action) => 0,
  PRINT_TYPE_DOGE_HIDE: (state, action) => -1
}, -1)

export default {
  print_admin_collapse, print_systypes, print_admin_sysmodify, print_admin_type_active, print_type_doge
}
