import React from 'react'
import {connect} from 'react-redux'
import {ZGet} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './Menus.scss'
import Wrapper from 'components/MainWrapper'
import {Icon} from 'antd'
import {Icon as Iconfa} from 'components/Icon'
import {reactCellRendererFactory} from 'ag-grid-react' //bad kid

const Main = React.createClass({
  refreshDataCallback() {
    this.grid.api.showLoadingOverlay()
    ZGet('admin/menus', (s, d, m) => {
      this.grid.setRowData(d)
      this.grid.api.hideOverlay()
    }, (m) => {
      this.grid.api.showNoRowsOverlay()
    })
  },
  handleGridReady(grid) {
    this.grid = grid
    this.refreshDataCallback()
  },
  render() {
    return (
      <div className={styles.main}>
        <ZGrid setPleaseTip='请先选择左侧【模板类型】' className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'print_user' }} columnDefs={columnDefs} grid={this} />
      </div>
    )
  }
})

export default connect()(Wrapper(Main))

const parseIcon = (icon) => {
  if (icon) {
    switch (typeof icon) {
      case 'string': {
        return <Icon type={icon} />
      }
      case 'object': {
        switch (icon[1]) {
          case 'fa': {
            return <Iconfa type={icon[0]} />
          }
          default: {
            return <Icon type={icon[0]} />
          }
        }
      }
      default: {
        return null
      }
    }
  }
  return null
}
const BadName = React.createClass({
  render() {
    const {data} = this.props
    return (
      <span>
        {parseIcon(data.icon)}
        {data.name}
      </span>
    )
  }
})

const columnDefs = [{
  headerName: '菜单名',
  field: 'name',
  width: 300,
  cellRenderer: 'group',
  cellRendererParams: {
    innerRenderer: reactCellRendererFactory(BadName)
  }
}, {
  headerName: '路由',
  field: 'router',
  width: 200,
  cellStyle: {textAlign: 'left'}
}, {
  headerName: '访问权限',
  field: 'access',
  width: 150
}, {
  headerName: '备注',
  field: 'remark',
  width: 150
}, {
  headerName: '排序',
  field: 'order',
  cellStyle: {textAlign: 'center'},
  width: 50
}, {
  headerName: '操作',
  width: 150
}]
const gridOptions = {
  enableColResize: true,
  enableSorting: true,
  getNodeChildDetails: (item) => {
    if (item.children) {
      return {
        group: true,
        children: item.children,
        expanded: true
        //field: 'name',
        //key: item.name
      }
    }
    return null
  },
  icons: {
    groupExpanded: '<i class="anticon anticon-minus-square-o"/>',
    groupContracted: '<i class="anticon anticon-plus-square-o"/>'
  }
}
// const rowData = [{
//   id: 1,
//   name: '菜单管理',
//   router: 'admin/menus',
//   access: '访问权限',
//   order: '1',
//   remark: '菜单',
//   children: [{
//     id: 2,
//     name: '菜单管理2',
//     router: 'admin/menus',
//     access: '访问权限',
//     order: '1',
//     remark: '菜单'
//   }, {
//     id: 3,
//     name: '菜单管理2',
//     router: 'admin/menus',
//     access: '访问权限',
//     order: '1',
//     remark: '菜单',
//     children: [{
//       id: 4,
//       name: '菜单管理21',
//       router: 'admin/menus',
//       access: '访问权限',
//       order: '1',
//       remark: '菜单'
//     }, {
//       id: 5,
//       name: '菜单管理211',
//       router: 'admin/menus',
//       access: '访问权限',
//       order: '1',
//       remark: '菜单'
//     }]
//   }]
// }, {
//   id: 6,
//   name: '菜单管理2',
//   router: 'admin/menus',
//   access: '访问权限',
//   order: '1',
//   remark: '菜单',
//   children: [{
//     id: 7,
//     name: '菜单管理21',
//     router: 'admin/menus',
//     access: '访问权限',
//     order: '1',
//     remark: '菜单'
//   }]
// }]
