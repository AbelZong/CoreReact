import React from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'
import styles from './Aside.scss'
import { Icon } from 'antd'
import {Icon as Iconfa} from 'components/Icon'
import Scrollbar from 'components/Scrollbars/index'

const Menus = React.createClass({
  handleClick(id) {
    this.props.dispatch({type: 'MENUACTIVEID_SET', payload: id})
    this.props.dispatch({type: 'ASIDEMENUCOLLAPSE2_SET', payload: false})
  },
  parseMenu(menu, i) {
    const {menuActiveID} = this.props
    let icon = null
    if (menu.icon) {
      switch (typeof menu.icon) {
        case 'string': {
          icon = <Icon type={menu.icon} />
          break
        }
        case 'object': {
          switch (menu.icon[1]) {
            case 'fa': {
              icon = <Iconfa type={menu.icon[0]} />
              break
            }
            default: {
              icon = <Icon type={menu.icon[0]} />
              break
            }
          }
          break
        }
        default: {
          icon = null
          break
        }
      }
    }
    const CN = classNames({
      [`${styles.active}`]: menuActiveID === menu.id
    })
    return (
      <li key={menu.id} className={CN} onClick={() => this.handleClick(menu.id)} data-tt={menu.name}>
        <span className={styles.isee}>{icon}</span><span className={styles.name}>{menu.name}</span>
      </li>
    )
  },
  renderMenus() {
    const {permissionMenus} = this.props
    return permissionMenus.length ? permissionMenus.map((menu, i) => this.parseMenu(menu, i)) : (
      <li className={styles.noMenu}>
        没有权限菜单
      </li>
    )
  },
  handleCollapse() {
    this.props.dispatch({type: 'ASIDEMENUCOLLAPSE1_REVER'})
  },
  render() {
    return (
      <div className={styles.menus2}>
        <div className={styles.chun} onClick={this.handleCollapse}>
          <div className={styles['zzz']} />
        </div>
        <div className={styles.hua}>
          <Scrollbar autoHide className={styles['s--wrapper']}>
            <ul className={styles.menuUL}>
              {this.renderMenus()}
            </ul>
          </Scrollbar>
        </div>
      </div>
    )
  }
})
export default connect(state => ({
  menuActiveID: state.menuActiveID,
  permissionMenus: state.permissionMenus
}))(Menus)
