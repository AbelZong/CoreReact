import React from 'react'
import {connect} from 'react-redux'
import { Icon, Button, Popconfirm, message } from 'antd'
import appStyles from 'components/App.scss'
import styles from './Print.scss'
import classNames from 'classnames'
import {ZGet, ZPost} from 'utils/Xfetch'

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
      ZGet({
        uri: 'print/tpl/sysesbytype',
        data: {
          type
        },
        success: (s, d, m) => {
          this.props.dispatch({type: 'PRINT_ADMIN_TDATA_SET', payload: {
            list: d.list || [],
            page: d.page || 0,
            pageSize: d.pageSize || 20,
            pageTotal: d.pageTotal || 0,
            total: d.Total || 0,
            type
          }})
        }
      })
    })
  },
  handleOpEdit(e, id) {
    e.stopPropagation()
    console.log('handleOpEdit', id)
  },
  handleOpDelete(id) {
    const {systypes} = this.props
    // ZPost({
    //   uri: 'print/tpl/sysesbytype',
    //   data
    // })
    const item = systypes.filter((x) => x.id === id)[0]
    if (item) {
      const index = systypes.indexOf(item)
      this.props.dispatch({type: 'SYSTYPES_UPDATE', update: {
        $splice: [[index, 1]]
      }})
    }
  },
  _handleHold(e) {
    e.stopPropagation()
  },
  render() {
    const {activeID} = this.state
    const {systypes} = this.props
    return (
      <aside className={appStyles.aside}>
        <div className={appStyles.box}>
          <div className={appStyles.header}>
            <span className={appStyles.name}>模板类型</span>
          </div>
          <div className={appStyles.toolbar}>
            <div className={appStyles.r}>
              <Button type='ghost' size='small' icon='plus'>新增类型</Button>
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
      </aside>
    )
  }
})

export default connect(state => ({
  systypes: state.print_systypes
}))(AdminSide)
