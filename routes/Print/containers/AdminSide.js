import React from 'react'
import {connect} from 'react-redux'
import { Icon, Button, Popconfirm } from 'antd'
import appStyles from 'components/App.scss'
//import styles from './Print.scss'
import classNames from 'classnames'
import {ZPost} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'
import AdminModalType from './AdminModalType'
import Scrollbar from 'components/Scrollbars/index'
const AdminSide = React.createClass({
  getInitialState: function() {
    return {
      activeID: -1
    }
  },
  handleOpCp(e, {type, id}) {
    this.setState({
      activeID: id * 1
    }, () => {
      this.props.dispatch({type: 'PRINT_ADMIN_TYPE_ACTIVE_SET', payload: type})
    })
  },
  handleOpEdit(e, id) {
    e.stopPropagation()
    this.props.dispatch({type: 'PRINT_TYPE_DOGE_SET', payload: id})
  },
  handleOpDelete(id) {
    const {systypes} = this.props
    startLoading()
    ZPost({
      uri: 'print/tpl/deleteSysesType',
      data: {
        id
      },
      success: (s, d, m) => {
        const item = systypes.filter((x) => x.id === id)[0]
        if (item) {
          const index = systypes.indexOf(item)
          this.props.dispatch({type: 'SYSTYPES_UPDATE', update: {
            $splice: [[index, 1]]
          }})
        }
      }
    }).then(endLoading)
  },
  _handleHold(e) {
    e.stopPropagation()
  },
  handleCreateNew() {
    this.props.dispatch({type: 'PRINT_TYPE_DOGE_CREATE'})
  },
  render() {
    const {activeID} = this.state
    const {systypes} = this.props
    return (
      <aside className={appStyles.aside}>
        <div className={appStyles.asideScrollbar}>
          <Scrollbar autoHide>
            <div className={appStyles.box}>
              <div className={appStyles.header}>
                <span className={appStyles.name}>模板类型</span>
              </div>
              <div className={appStyles.toolbar}>
                <div className={appStyles.r}>
                  <Button type='ghost' size='small' icon='plus' onClick={this.handleCreateNew}>新增类型</Button>
                </div>
              </div>
              <div className={appStyles.inner}>
                <ul className={appStyles.items}>
                  {systypes.length ? systypes.map((x) => {
                    const CN = classNames({
                      [`${appStyles.active}`]: activeID === x.id
                    })
                    return (
                      <li className={CN} key={x.id} onClick={(e) => this.handleOpCp(e, x)}><span className={`${appStyles.name} cur`}>{x.name}</span>
                        <div className={appStyles.operators}>
                          <Icon type='edit' onClick={(e) => this.handleOpEdit(e, x.id)} />
                          <Popconfirm title={`确定要删除 ${x.name} 吗？`} onConfirm={() => this.handleOpDelete(x.id)}>
                            <Icon type='delete' onClick={this._handleHold} />
                          </Popconfirm>
                        </div>
                      </li>
                    )
                  }) : null}
                </ul>
              </div>
            </div>
            <AdminModalType />
          </Scrollbar>
        </div>
      </aside>
    )
  }
})

export default connect(state => ({
  systypes: state.print_systypes
}))(AdminSide)
