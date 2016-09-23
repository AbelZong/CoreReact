import { handleActions } from 'redux-actions'
//import update from 'react-addons-update'
//import store from 'utils/store' //吃相不太好看

const print_admin_collapse = handleActions({
  PRINT_ADMIN_COLLAPSE_SET: (state, action) => action.payload,
  PRINT_ADMIN_COLLAPSE_REVER: (state, action) => !state
}, false)

export default {
  print_admin_collapse
}
