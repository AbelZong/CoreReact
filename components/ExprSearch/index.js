/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-13 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  Modal
} from 'antd'
import {
  connect
} from 'react-redux'
import styles from './index.scss'
export default connect(state => ({
  doge: state.order_list_expr_s_1
}))(React.createClass({
  hideModal() {
    this.props.dispatch({ type: 'ORDER_LIST_EXPR_S_1_SET', payload: null })
  },
  render() {
    const {doge} = this.props
    const visible = doge !== null
    const src = doge ? `http://m.kuaidi100.com/index_all.html?type=${doge.pp}&postid=${doge.ap}#result` : 'about:blank'
    return (
      <Modal className={styles.iframeModal} title='物流状态（快递100）' visible={visible} width={350} onCancel={this.hideModal} footer=''>
        <iframe frameBorder='0' src={src} />
      </Modal>
    )
  }
}))
