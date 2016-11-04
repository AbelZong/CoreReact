/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-01 08:46:10
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  Modal,
  Icon
} from 'antd'
import {
  connect
} from 'react-redux'
import styles from './Modal.scss'
import {
  ZGet
} from 'utils/Xfetch'

const FFTuan = React.createClass({
  getInitialState() {
    return { title: '', content: '', date: '', loading: false }
  },
  componentWillReceiveProps(nextProps) {
    const {mod, query, visible} = nextProps.zhModUnq
    this.ignoreCase = false
    if (visible) {
      this.setState({loading: true})
      ZGet(mod, query, ({d}) => {
        if (this.ignoreCase) { return }
        this.setState({ ...d, loading: false })
      })
    } else {
      this.setState({ title: '', content: nextProps.zhModUnq.visible ? 'loading' : '', loading: false })
    }
  },
  hideModal() {
    this.ignoreCase = true
    this.props.dispatch({ type: 'ZHMODUNQ_RESET' })
  },

  render() {
    const {title, content, date, loading} = this.state
    const {visible} = this.props.zhModUnq
    return (
      <Modal wrapClassName={styles.modalFFtuan} title={title} visible={visible} footer='' onCancel={this.hideModal}>
        {loading ? (
          <div className={styles.loading}>
            <Icon type='loading' />
          </div>
        ) : (
          <div>
            <div className={styles.hua}>
              <Icon type='clock-circle-o' />&nbsp;<time>{date}</time>
            </div>
            <div className={styles.content} dangerouslySetInnerHTML={{__html: content}} />
          </div>
        )}
      </Modal>
    )
  }
})

export default connect(state => ({
  zhModUnq: state.zhModUnq
}))(FFTuan)
