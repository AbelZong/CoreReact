/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-28 09:29:06
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {
  Button,
  Icon
} from 'antd'
import ExprSearchModal from 'components/ExprSearch'
import appStyles from 'components/App.scss'
import styles from './index.scss'
import Iconfa from 'components/Icon'
import Table from './Table'
import Tq1st from './Test2'

export default connect()(React.createClass({
  getInitialState() {
    return {
      styles: {
        display: 'none'
      },
      height: 360
    }
  },
  // componentDidMount() {
  //   setTimeout(() => {
  //     this.props.dispatch({type: 'ORDER_AFTER_BIND_ORDER_VIS_1_SET', payload: 1})
  //   }, 1000)
  // },
  runRunRun(e) {
    const mdzz = this.refs.MFucker.getBoundingClientRect().top
    const oriTop = e.clientY - mdzz
    this.setState({
      styles: {
        top: oriTop,
        display: 'block'
      }
    })
    const mme = (e) => {
      let top = e.clientY - mdzz - 2
      if (top >= 180 && top <= 660) {
        this.setState({
          styles: {
            top
          }
        })
      }
    }
    const nne = (e) => {
      window.removeEventListener('mousemove', mme, false)
      window.removeEventListener('mouseup', nne, false)
      let top = e.clientY - mdzz
      if (oriTop === top) {
        this.setState({
          styles: {
            display: 'none'
          }
        })
        return
      }
      top = Math.max(180, top)
      top = Math.min(660, top)
      this.setState({
        styles: {
          display: 'none'
        },
        height: top - 16
      })
    }
    window.addEventListener('mousemove', mme, false)
    window.addEventListener('mouseup', nne, false)
  },
  handleLetUsGo(e) {
    e.preventDefault()
    this.runRunRun(e)
  },
  handleCreate() {
    this.props.dispatch({type: 'ORDER_AFTER_CREATE_VIS_1_SET', payload: 1})
  },
  render() {
    return (
      <div className={`${styles.content} flex-column`}>
        <div className={styles.toolbars}>
          <div className='flex-row'>
            <CollapseBtn />
            <div className={appStyles.tools}>
              <Button type='ghost' size='small' onClick={this.handleCreate}>
                <Iconfa type='plus' style={{color: 'red'}} />&nbsp;创建新的售后单
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.main} ref='MFucker'>
          <div className={styles.listMain} style={{height: this.state.height}}><Table /></div>
          <div className={styles.detailMain}>
            <div className={styles.toolbars2}>
              <div className={styles.drager} onMouseDown={this.handleLetUsGo} />
              <span className={styles.detailName}>售后商品信息</span>
            </div><Tq1st />
          </div>
          <div className={styles.liner} style={this.state.styles} />
        </div>
        <ExprSearchModal />
      </div>
    )
  }
}))
const CollapseBtn = connect(state => ({
  collapse: state.order_list_collapse
}))(React.createClass({
  handleCollapseChange() {
    this.props.dispatch({type: 'ORDER_AFTER_COLLAPSE_REVER'})
  },
  render() {
    const {collapse} = this.props
    const type = collapse ? 'double-right' : 'double-left'
    return (
      <div className={appStyles.collapseBtn}>
        <Icon type={type} className='cur' onClick={this.handleCollapseChange} />
      </div>
    )
  }
}))
