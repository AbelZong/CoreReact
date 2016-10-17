import React from 'react'
//import { IndexLink, Link } from 'react-router'
import {Row, Col, Icon} from 'antd'
import {connect} from 'react-redux'
import styles from './Header.scss'
import {toggleCollapse} from 'containers/modules/actions'
import ModalProset from './ModalProset'
import SF from './SF'
import NoticeBtn from './NoticeBtn'
import {ZPost} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'
import Notification from './Notification'
import MenuDown from './MenuDown'
import PermissionsDisplay from './PermissionsDisplay'
import {SOFTNAME} from 'constants/config'

const Header = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
    //location: React.PropTypes.object
  },

//fuck this
  // childContextTypes: {
  //   location: React.PropTypes.object
  // },
  // getChildContext() {
  //   return { location: this.context.location }
  // },
//fuck end
  toggleCollapse() {
    this.props.dispatch(toggleCollapse())
  },
  handleMenuClick(e) {
    switch (e.key) {
      case '0': {
        this.props.dispatch({ type: 'PROSET_VISIBEL_SET', payload: true })
        break
      }
      case '1': {
        startLoading()
        ZPost('profile/lock', {silence: 1}, () => {
          this.props.dispatch({ type: 'LOCKED_SET', payload: true })
        }).then(endLoading)
        break
      }
      case '-1': {
        ZPost('sign/out', () => {
          this.context.router.push('/go/login')
        })
        break
      }
      default:break
    }
  },
  render() {
    const {user} = this.props
    const {name} = user
    return (
      <div className={styles.wraper}>
        <Notification />
        <div id='ZH-menus' className={styles.menus}>
          <Row>
            <Col span={10}>
              <div className={styles.menuL}>
                <a className={styles.brand}>{SOFTNAME}</a>
                <a href='/' className={styles.menuA}>管理控制台</a>
                <MenuDown name='快捷菜单'>
                  <PermissionsDisplay />
                </MenuDown>
              </div>
            </Col>
            <Col span={14}>
              <div className={styles.menuR}>
                <a className={styles.menuA}>客服</a>
                <MenuDown name={name} className={styles.bbq}>
                  <ul className={styles.ms}>
                    <li onClick={() => this.handleMenuClick({key: '0'})}><Icon type='setting' />&nbsp;&nbsp;密码修改</li>
                    <li onClick={() => this.handleMenuClick({key: '1'})}><Icon type='lock' />&nbsp;&nbsp;锁屏</li>
                    <li className={styles.divider} />
                    <li onClick={() => this.handleMenuClick({key: '-1'})}><Icon type='logout' />&nbsp;&nbsp;安全登出</li>
                  </ul>
                  <ModalProset />
                </MenuDown>
                <NoticeBtn />
                <SF />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
})

//export default Header
export default connect(state => ({
  user: state.user
}))(Header)
