/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-18 09:38:32
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { Modal } from 'antd'
import {connect} from 'react-redux'

const NoticeModalZhang = React.createClass({
  getInitialState() {
    return {
      loading: false
    }
  },
  render() {
    return (
      <Modal title={this.props.title} visible={this.props.visible} onOk={this.hideModal} onCancel={this.hideModal} confirmLoading={this.props.confirmLoading}>
        //
      </Modal>
    )
  }
})

export default connect(state => ({
  visible: state.dashed_visible1
}))(NoticeModalZhang)
