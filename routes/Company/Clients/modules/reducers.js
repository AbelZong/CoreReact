import {handleActions} from 'redux-actions'
import update from 'react-addons-update'
const company_client_vis = handleActions({
  COMPANY_CLIENT_VIS_SET: (state, action) => action.payload
}, -1)
const company_clients_filter_conditions = handleActions({
  COMPANY_CLIENTS_FILTER_CONDITIONS_SET: (state, action) => (action.payload),
  COMPANY_CLIENTS_FILTER_CONDITIONS_UPDATE: (state, action) => update(state, action.update)
}, null)
const company_client_loading = handleActions({
  COMPANY_CLIENT_LOADING_SET: (state, action) => action.payload
}, false)
export default {
  company_client_vis, company_clients_filter_conditions, company_client_loading
}
