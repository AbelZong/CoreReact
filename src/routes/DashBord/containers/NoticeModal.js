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
