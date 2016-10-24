import React from 'react'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import {Icon, Popconfirm, Checkbox, message, Button} from 'antd'
import {Icon as Iconfa} from 'components/Icon'
import {reactCellRendererFactory} from 'ag-grid-react'
const ButtonGroup = Button.Group

const Main = React.createClass({
  componentDidMount() {
    this._firstBlood()
  },
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
  _getIDs() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length) {
      return ids
    }
    message.info('没有选中')
  },
  deleteRowByIDs(ids) {
    this.grid.x0pCall(ZPost('XyComm/Customkind/DeleteSkuKind', {IDLst: ids}, () => {
      this.refreshDataCallback()
    }))
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleDelete() {
    const ids = this._getIDs()
    if (ids) {
      this.deleteRowByIDs(ids)
    }
  },
  handleEnable() {
    const ids = this._getIDs()
    if (ids) {
      this.grid.x0pCall(ZPost('XyComm/Customkind/SkuKindEnable', {IDLst: ids, Enable: 'true'}, () => {
        this.refreshDataCallback()
      }))
    }
  },
  handleDisable() {
    const ids = this._getIDs()
    if (ids) {
      this.grid.x0pCall(ZPost('XyComm/Customkind/SkuKindEnable', {IDLst: ids, Enable: 'false'}, () => {
        this.refreshDataCallback()
      }))
    }
  },
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'XyComm/Customkind/SkuKindLst'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1,
      ParentID: 0
    }, conditions)
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        rowData: d.Children,
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
              params.success(d.Children)
            }, ({m}) => {
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
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'admin_brands' }} columnDefs={columnDefs} grid={this}>
          批量：
          <Popconfirm title='确定要删除选中吗？' onConfirm={this.handleDelete}>
            <Button type='ghost' size='small'>删除</Button>
          </Popconfirm>
          <span className='ml10' />
          <ButtonGroup>
            <Popconfirm title='确定要启用吗？' onConfirm={this.handleEnable}>
              <Button type='primary' size='small'>启用</Button>
            </Popconfirm>
            <Popconfirm title='确定要禁用吗？' onConfirm={this.handleDisable}>
              <Button type='ghost' size='small'>禁用</Button>
            </Popconfirm>
          </ButtonGroup>
        </ZGrid>
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.product_cat_conditions
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
  handleGoto() {
    this.props.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'PRODUCT_CAT_BREADS_UPDATE', update: {
      $push: [{
        id: this.props.data.ID,
        name: this.props.data.KindName
      }]
    }})
    this.props.api.gridOptionsWrapper.gridOptions.grid.props.dispatch({type: 'PRODUCT_CAT_CONDITIONS_SET', payload: {
      ParentID: this.props.data.ID
    }})
  },
  render() {
    return (
      <div className='operators'>
        <Button type='ghost' size='small' className='mr5' onClick={this.handleGoto}>进入子类目</Button>
        <Iconfa type='edit' onClick={this.handleEditClick} title='编辑' />
        <Popconfirm title='确定要删除吗？' onConfirm={this.handleDeleteClick}>
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
    this.props.api.gridOptionsWrapper.gridOptions.grid.grid.x0pCall(ZPost('XyComm/Brand/BrandEnable', {
      IDLst: [this.props.data.ID],
      Enable: checked
    }, () => {
      this.props.data.Enable = checked
      this.props.refreshCell()
    }))
  },
  render() {
    return <Checkbox onChange={this.handleClick} checked={this.props.data.Enable} />
  }
})
const columnDefs = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    pinned: 'left',
    suppressSorting: true,
    enableSorting: true
  }, {
    headerName: 'ID',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 80,
    suppressMenu: true
  }, {
    headerName: '名称',
    field: 'KindName',
    width: 280,
    suppressMenu: true
  }, {
    headerName: '排序',
    field: 'Order',
    width: 70,
    suppressMenu: true
  }, {
    headerName: '状态',
    field: 'Enable',
    width: 70,
    cellStyle: {textAlign: 'center'},
    cellRenderer: reactCellRendererFactory(AbledRender),
    suppressMenu: true
  }, {
    headerName: '操作',
    width: 180,
    cellRendererFramework: OperatorsRender,
    suppressMenu: true
  }]
const gridOptions = {
}
