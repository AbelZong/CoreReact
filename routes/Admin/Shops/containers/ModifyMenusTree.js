/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: JieChen
* Date  :
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { TreeSelect } from 'antd'
import {connect} from 'react-redux'
const TreeNode = TreeSelect.TreeNode

const Trr = React.createClass({
  handleChange(value) {
    this.props.dispatch({type: 'SHOP_SITE_EDIT_DISABLE', payload: value})
    this.props.onChange(value)
  },
  renderMenus(menu) {
    const idString = menu.id + ''
    return <TreeNode value={idString} title={menu.title} key={idString} />
  },
  render() {
    const {menus, value, disable, doge} = this.props
    const defval = value !== undefined ? menus[value].title : undefined
    return (
      <TreeSelect
        value={defval}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder='请选择站点'
        allowClear
        disabled={disable > 0 && doge !== 0}
        treeDefaultExpandAll
        onChange={this.handleChange}>
        {menus.length && menus.map((x) => this.renderMenus(x))}
      </TreeSelect>
    )
  }
})

export default connect(state => ({
  menus: state.shop_site_set,
  doge: state.shop_modify_visiable,
  disable: state.shop_site_edit_disable
}))(Trr)
