import React from 'react'
import { TreeSelect } from 'antd'
import {connect} from 'react-redux'
const TreeNode = TreeSelect.TreeNode

const Trr = React.createClass({
  handleChange(value) {
    this.props.onChange(value)
  },
  renderMenus(menu) {
    const idString = menu.id + ''
    if (menu.children) {
      return (
        <TreeNode value={idString} title={menu.name} key={idString}>
          {menu.children.map((menu) => this.renderMenus(menu))}
        </TreeNode>
      )
    }
    return <TreeNode value={idString} title={menu.name} key={idString} />
  },
  render() {
    const {menus, value} = this.props
    return (
      <TreeSelect style={{ width: 300 }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder='请选择上级菜单'
        allowClear
        treeDefaultExpandAll
        onChange={this.handleChange}>
        {menus.length && menus.map((x) => this.renderMenus(x))}
      </TreeSelect>
    )
  }
})

export default connect(state => ({
  menus: state.admin_menus
}))(Trr)
