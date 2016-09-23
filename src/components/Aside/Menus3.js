import React from 'react'
import {connect} from 'react-redux'
import styles from './Aside.scss'
import { Menu, Icon } from 'antd'
import {Icon as Iconfa} from 'components/Icon'
import store from 'utils/store'
import {changeBookmark} from 'containers/modules/actions'
import Scrollbar from 'components/Scrollbars/index'
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

const KEY_OPENKEYS = 'A.menu.OKs'
//const KEY_SELECTED = 'A.menu.sel'
const menuCache = {
  openKeys: store.get(KEY_OPENKEYS, [])
  //selected: store.get(KEY_SELECTED, null)
}
const parseMenu = (menu) => {
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
  switch (menu.type) {
    case 1: {
      return (
        <MenuItemGroup key={menu.id} title={<span>{icon}&nbsp;&nbsp;<span>{menu.name}</span></span>}>
          {
            menu.data.map((_menu, i) => parseMenu(_menu))
          }
        </MenuItemGroup>
      )
    }
    case 2: {
      return (
        <SubMenu key={menu.id} title={<span>{icon}<span>{menu.name}</span></span>}>
          {
            menu.data.map((_menu, i) => parseMenu(_menu))
          }
        </SubMenu>
      )
    }
    default: {
      const key = menu.id + '_' + menu.path
      return (
        <Menu.Item key={key} path={menu}>
          {icon}{menu.name}
        </Menu.Item>
      )
    }
  }
}

const Menus = React.createClass({
  _menuClick(e) {
    this.props.dispatch(changeBookmark(e.item.props.path, true))
  },
  handleClick() {
    this.props.dispatch({type: 'ASIDEMENUCOLLAPSE2_REVER'})
  },
  render() {
    const mode = 'inline'
    const {openKeys} = menuCache
    const {permissionMenus, menuActiveID} = this.props
    const activePM = permissionMenus.filter((x) => x.id === menuActiveID)[0]
    if (typeof activePM !== 'undefined' && Object.prototype.toString.call(activePM.data) === '[object Array]' && activePM.data.length) {
      return (
        <div className={styles.sMenu}>
          <div className={styles.title}>
            {activePM.name}
          </div>
          <Scrollbar autoHide className={styles['s--wrapper']}>
            <Menu
              onClick={this._menuClick}
              className={styles.menus}
              defaultOpenKeys={openKeys}
              mode={mode}
            >
              {activePM.data.map((menu, i) => parseMenu(menu, i))}
            </Menu>
          </Scrollbar>
          <div className={styles.operater} onClick={this.handleClick}>
            <div className={styles.bg} />
            <div className={styles.tag}>
              <Icon type='menu-fold' />
              <Icon type='menu-unfold' />
            </div>
          </div>
        </div>
      )
    }
    return null
  }
})
export default connect(state => ({
  permissionMenus: state.permissionMenus,
  menuActiveID: state.menuActiveID
  //permissionMenuFilterName: state.permissionMenuFilterName
}))(Menus)
