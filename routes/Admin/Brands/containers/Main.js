import React from 'react'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import {Icon, Popconfirm, Checkbox, message} from 'antd'
import {Icon as Iconfa} from 'components/Icon'
import {reactCellRendererFactory} from 'ag-grid-react'

const Main = React.createClass({
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.conditions)
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  modifyRowByID(id) {
    this.props.dispatch({type: 'ADMIN_BRAND_VIS_SET', payload: id})
  },
  deleteRowByIDs(ids) {
    if (!ids || !ids.length) {
      return message.info('没有选中')
    }
    this.grid.x0pCall(ZPost('XyComm/Brand/DeleteBrand', {IDLst: ids}, () => {
      this.refreshDataCallback()
    }))
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleDelete() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    this.deleteRowByIDs(ids)
  },
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'XyComm/Brand/BrandLst'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.DataCount,
        rowData: d.BrandLst,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              PageSize: params.pageSize,
              PageIndex: params.page
            }, conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.BrandLst)
            }, (m) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
    }))
  },
  render() {
    return (
      <div className={styles.main}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'admin_brands' }} columnDefs={columnDefs} paged grid={this}>
          批量：
          <Popconfirm title='确定要删除选中吗？' onConfirm={this.handleDelete}>
            <Icon type='delete' className='cur' title='删除' />
          </Popconfirm>
        </ZGrid>
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.admin_brands_filter_conditions
}))(Wrapper(Main))
const OperatorsRender = React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.modifyRowByID(this.props.data.ID)
  },
  handleDeleteClick() {
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.deleteRowByIDs([this.props.data.ID])
  },
  render() {
    return (
      <div className='operators'>
        <Iconfa type='edit' onClick={this.handleEditClick} title='编辑品牌' />
        <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDeleteClick}>
          <Iconfa type='remove' title='删除' />
        </Popconfirm>
      </div>
    )
  }
})
const AbledRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const checked = e.target.checked
    ZPost('XyComm/Brand/BrandEnable', {
      IDLst: [this.props.data.ID],
      Enable: checked
    }, () => {
      this.props.data.Enable = checked
      this.props.refreshCell()
    })
  },
  render() {
    return <Checkbox onChange={this.handleClick} checked={this.props.data.Enable} />
  }
})
const LinkRender = function(params) {
  return params.value ? '<a href="' + params.value + '" target="_blank" title="跳转到 ' + params.value + '">' + params.value + '</a>' : ''
}
const columnDefs = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    pinned: 'left',
    suppressSorting: true
  }, {
    headerName: 'ID',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    enableSorting: true,
    width: 60
  }, {
    headerName: '名称',
    field: 'Name',
    width: 150
  }, {
    headerName: '简介',
    field: 'Intro',
    width: 280,
    suppressSorting: true
  }, {
    headerName: '启用',
    field: 'Enable',
    width: 50,
    cellStyle: {textAlign: 'center'},
    cellRenderer: reactCellRendererFactory(AbledRender)
  }, {
    headerName: '品牌官网',
    field: 'Link',
    width: 180,
    suppressSorting: true,
    cellRenderer: LinkRender
  }, {
    headerName: '创建时间',
    field: 'CreateDate',
    width: 130
  }, {
    headerName: '操作',
    width: 120,
    cellRendererFramework: OperatorsRender,
    suppressSorting: true
  }]
const gridOptions = {
  enableSorting: true,
  enableServerSideSorting: true,
  onBeforeSortChanged: function(params) {
    const sorter = this.api.getSortModel()[0]
    const conditions = sorter ? {
      SortField: sorter.colId,
      SortDirection: sorter.sort.toUpperCase()
    } : {
      SortField: null,
      SortDirection: null
    }
    this.grid.props.dispatch({type: 'ADMIN_BRANDS_FILTER_CONDITIONS_UPDATE', update: {
      $merge: conditions
    }})
  }
}
