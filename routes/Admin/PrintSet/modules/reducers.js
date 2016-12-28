import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

const printer_conditions = handleActions({
  PRINTER_CONDITIONS_SET: (state, action) => (action.payload)
}, true)
const printer_edit_vis = handleActions({
  PRINTER_EDIT_VIS_SET: (state, action) => (action.payload)
}, -1)
const printer_base_vis = handleActions({
  PRINTER_BASE_VIS_SET: (state, action) => (action.payload)
}, [])


export default {
  printer_conditions, printer_base_vis, printer_edit_vis
}
