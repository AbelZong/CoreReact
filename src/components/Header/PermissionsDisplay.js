import React from 'react'
import {connect} from 'react-redux'
import {Icon} from 'antd'
import {Icon as Iconfa} from 'components/Icon'
import styles from './Header.scss'
import {changeBookmark} from 'containers/modules/actions'

const parseIcon = (menuIcon) => {
  let icon = null
  if (menuIcon) {
    switch (typeof menuIcon) {
      case 'string': {
        icon = <Icon type={menuIcon} />
        break
      }
      case 'object': {
        switch (menuIcon[1]) {
          case 'fa': {
            icon = <Iconfa type={menuIcon[0]} />
            break
          }
          default: {
            icon = <Icon type={menuIcon[0]} />
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
  return icon
}
const Menu = React.createClass({

  parseMenus(menu) {
    const icon = parseIcon(menu.icon)
    switch (menu.type) {
      case 1: {
        return (
          <div className={styles.group} key={menu.id}>
            <div className={styles.groupName}>{icon}&nbsp;&nbsp;<span>{menu.name}</span></div>
            {
              menu.data.map((_menu, i) => this.parseMenus(_menu))
            }
          </div>
        )
      }
      case 2: {
        return (
          <div className={styles.subs} key={menu.id}>
            <div className={styles.subsName}>{icon}&nbsp;&nbsp;<span>{menu.name}</span></div>
            {
              menu.data.map((_menu, i) => this.parseMenus(_menu))
            }
          </div>
        )
      }
      default: {
        const key = menu.id + '_' + menu.path
        return (
          <div className={styles.item} key={key} onClick={() => this.handleMenuClick(menu)}>
            <span className={styles.icon}>{icon}</span>{menu.name}
          </div>
        )
      }
    }
  },
  handleMenuClick(menu) {
    this.props.dispatch(changeBookmark(menu, true))
  },
  render() {
    const {permissionMenus} = this.props
    if (!permissionMenus || !permissionMenus.length) {
      return (
        <div className={styles.menuBars}>
          Ooops!没有菜单
        </div>
      )
    }
    return (
      <div className={styles.menuBars}>
        {permissionMenus.map((menu) => {
          return (
            <div className={styles.col}>
              <div className={styles.name}>{menu.name}</div>
              {menu.data && menu.data.map((_menu) => this.parseMenus(_menu))}
            </div>
          )
        })}
      </div>
    )
  }
})

export default connect(state => ({
  permissionMenus: state.permissionMenus
}))(Menu)
