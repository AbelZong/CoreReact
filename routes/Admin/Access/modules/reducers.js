import { handleActions } from 'redux-actions'

const access_list = handleActions({
  ACCESS_LIST: (state, action) => (action.payload)
}, null)
const access_modify_visiable = handleActions({
  ACCESS_MODIFY_VISIABLE: (state, action) => (action.payload)
}, -1)

export default {
  access_list, access_modify_visiable
}
