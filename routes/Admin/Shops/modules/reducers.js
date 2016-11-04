/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: JieChen
* Date  :
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import { handleActions } from 'redux-actions'

const shop_list = handleActions({
  SHOP_LIST: (state, action) => (action.payload)
}, null)
const shop_enable = handleActions({
  SHOP_ENABLE: (state, action) => (action.payload)
}, '')
const shop_modify_visiable = handleActions({
  SHOP_MODIFY_VISIABLE: (state, action) => (action.payload)
}, -1)
const shop_site_set = handleActions({
  SHOP_SITE_SET: (state, action) => (action.payload)
}, [])
const shop_site_edit_disable = handleActions({
  SHOP_SITE_EDIT_DISABLE: (state, action) => (action.payload)
}, 0)
const shop_api_log_id = handleActions({
  SHOP_API_LOG_id: (state, action) => (action.payload)
}, 0)
const shop_token_code = handleActions({
  SHOP_TOKEN_CODE: (state, action) => (action.payload)
}, '')
export default {
  shop_list, shop_enable, shop_modify_visiable, shop_site_set, shop_site_edit_disable, shop_token_code, shop_api_log_id
}
