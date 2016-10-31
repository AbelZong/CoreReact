import React from 'react'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import {Icon, Popconfirm, Checkbox, message, Button} from 'antd'

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
  handleGridReady(grid) {
    this.grid = grid
  },
  handleDelete() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    this.deleteRowByIDs(ids)
  },
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'Warehouse/Lst'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, conditions)
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        rowData: d.Lst
      })
      this.props.dispatch({type: 'WAREHOUSE_SSNO_VIS_SET', payload: d.code})
    }))
  },
  render() {
    return (
      <div className={styles.main}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'goodgods.wx1' }} columnDefs={columnDefs} columnsFited />
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.warehouse_filter_conditions
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
        <Button onClick={this.handlePartyStop}>终止合作</Button>
      </div>
    )
  }
})
const NoteRender = React.createClass({
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
    return <Icon type='edit' onClick={this.handleClick} />
  }
})
const columnDefs = [
  {
    headerName: 'ID',
    field: 'id',
    cellStyle: {textAlign: 'center'},
    enableSorting: true,
    width: 60
  }, {
    headerName: '仓储关系',
    field: 'warename',
    width: 150
  }, {
    headerName: '对方商家名',
    field: 'itname',
    width: 150,
    suppressSorting: true
  }, {
  //   headerName: '状态',
  //   field: 'enable',
  //   width: 60,
  //   cellStyle: {textAlign: 'center'},
  //   cellRenderer: reactCellRendererFactory(AbledRender),
  //   suppressSorting: true
  // }, {
    headerName: '我方备注',
    field: 'myremark',
    width: 180,
    suppressSorting: true,
    cellRendererFramework: NoteRender
  }, {
    headerName: '对方备注',
    field: 'itremark',
    width: 180,
    suppressSorting: true
  }, {
    headerName: '变更时间',
    field: 'mdate',
    width: 130
  }, {
    headerName: '操作',
    width: 120,
    cellRendererFramework: OperatorsRender,
    suppressSorting: true
  }]
const gridOptions = {
}
