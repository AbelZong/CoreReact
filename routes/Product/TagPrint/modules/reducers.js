/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-06 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import {handleActions} from 'redux-actions'
const product_shop_band = handleActions({
  PRODUCT_SHOP_BAND_SET: (state, action) => action.payload
}, -1)

export default {
  product_shop_band
}
