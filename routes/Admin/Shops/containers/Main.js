import React from 'react'
import {connect} from 'react-redux'
import styles from './Shop.scss'
import ZGrid from 'components/Grid/index'
import {Icon, Popconfirm, Checkbox} from 'antd'
import {ZPost} from 'utils/Xfetch'
import OperatorsRender from './OperatorsRender'
import Wrapper from 'components/MainWrapper'
import {reactCellRendererFactory} from 'ag-grid-react'

class UrlRenderer extends React.Component {
  render() {
    let url = this.props.value
    return <a target='_blank' href={url} >{url}</a>
  }
}

const EnableRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const checked = e.target.checked
    ZPost('Shop/ShopEnable', {
      IDLst: [this.props.data.ID],
      Enable: checked
    }, (s, d, m) => {
      this.props.data.Enable = checked
      const Yyah = this.props.api.gridOptionsWrapper.gridOptions
      Yyah.grid.refreshDataCallback()
      this.props.refreshCell()
    })
  },
  render() {
    return <Checkbox onChange={this.handleClick} checked={this.props.data.Enable} />
  }
})

const SkuRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const checked = e.target.checked
    ZPost('Shop/apienable', {
      sid: this.props.data.ID,
      apiname: 'UpdateSku',
      enable: checked
    }, (s, d, m) => {
      this.props.data.UpdateSku = checked
      this.props.refreshCell()
    })
  },
  render() {
    if (!this.props.data.Enable) {
      return <Checkbox onChange={this.handleClick} checked={this.props.data.UpdateSku} disabled />
    }
    return <Checkbox onChange={this.handleClick} checked={this.props.data.UpdateSku} />
  }
})

const GoodsRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const checked = e.target.checked
    ZPost('Shop/apienable', {
      sid: this.props.data.ID,
      apiname: 'DownGoods',
      enable: checked
    }, (s, d, m) => {
      this.props.data.DownGoods = checked
      this.props.refreshCell()
    })
  },
  render() {
    if (!this.props.data.Enable) {
      return <Checkbox onChange={this.handleClick} checked={this.props.data.DownGoods} disabled />
    }
    return <Checkbox onChange={this.handleClick} checked={this.props.data.DownGoods} />
  }
})

const WaybillRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const checked = e.target.checked
    ZPost('Shop/apienable', {
      sid: this.props.data.ID,
      apiname: 'Updatewaybill',
      enable: checked
    }, (s, d, m) => {
      this.props.data.Updatewaybill = checked
      this.props.refreshCell()
    })
  },
  render() {
    if (!this.props.data.Enable) {
      return <Checkbox onChange={this.handleClick} checked={this.props.data.Updatewaybill} disabled />
    }
    return <Checkbox onChange={this.handleClick} checked={this.props.data.Updatewaybill} />
  }
})

const defColumns = [
  {
    headerName: '#',
    width: 30,
    checkboxSelection: true,
    cellStyle: {textAlign: 'center'},
    pinned: true
  }, {
    headerName: 'ID',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 60
  }, {
    headerName: '店铺名',
    field: 'ShopName',
    cellStyle: {textAlign: 'center'},
    width: 130
  }, {
    headerName: '所属站点',
    cellStyle: {textAlign: 'center'},
    field: 'ShopSite',
    width: 130
  }, {
    headerName: '店铺掌柜',
    cellStyle: {textAlign: 'center'},
    field: 'Shopkeeper',
    width: 100
  }, {
    headerName: '网址',
    field: 'ShopUrl',
    cellStyle: {textAlign: 'center'},
    width: 200,
    cellRendererFramework: UrlRenderer
  }, {
    headerName: '是否启用',
    cellStyle: {textAlign: 'center'},
    field: 'Enable',
    width: 40,
    cellRenderer: reactCellRendererFactory(EnableRender)
  }, {
    headerName: '上传库存',
    field: 'UpdateSku',
    cellStyle: {textAlign: 'center'},
    width: 80,
    cellRenderer: reactCellRendererFactory(SkuRender)
  }, {
    headerName: '下载商品',
    field: 'DownGoods',
    cellStyle: {textAlign: 'center'},
    width: 80,
    cellRenderer: reactCellRendererFactory(GoodsRender)
  }, {
    headerName: '下载快递单',
    field: 'Updatewaybill',
    cellStyle: {textAlign: 'center'},
    width: 80,
    cellRenderer: reactCellRendererFactory(WaybillRender)
  }, {
    headerName: '联系电话',
    field: 'TelPhone',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '发货地址',
    field: 'SendAddress',
    cellStyle: {textAlign: 'center'},
    width: 150
  }, {
    headerName: '退货地址',
    field: 'ReturnAddress',
    cellStyle: {textAlign: 'center'},
    width: 150
  }, {
    headerName: '创店时间',
    field: 'ShopBegin',
    cellStyle: {textAlign: 'center'},
    width: 120
  }, {
    headerName: '操作',
    width: 120,
    cellRendererFramework: OperatorsRender,
    pinned: 'right'
  }]
const gridOptions = {}
const Main = React.createClass({
  componentWillReceiveProps(nextProps) {
    this._firstBlood(nextProps.shopconditions)
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  modifyRowByID(id) {
    this.props.dispatch({type: 'SHOP_MODIFY_VISIABLE', payload: id})
  },
  _firstBlood(_data) {
    const shopconditions = _data || this.props.conditions || {}
    this.grid.showLoading()
    const uri = 'Shop/ShopQueryLst'
    const data = Object.assign({
      PageIndex: 1,
      PageSize: this.grid.getPageSize(),
      SortField: '',
      SortDirection: ''
    }, shopconditions)
    ZPost(uri, data, (s, d, m) => {
      this.props.dispatch({type: 'SHOP_SITE_SET', payload: d.sitemenus})
      this.grid.setDatasource({
        total: d.total,
        rowData: d.list,
        page: d.page,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              PageIndex: params.page,
              PageSize: params.pageSize,
              SortField: '',
              SortDirection: ''
            }, this.props.shopconditions)
            ZPost(uri, qData, (s, d, m) => {
              params.success(d.list)
            }, (m) => {
              params.fail(m)
            })
          }
        }
      })
    })
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  deleteRowByIDs(ids) {
    const data = {IDLst: ids}
    this.grid.showLoading()
    ZPost('Shop/delete', data, (s, d, m) => {
      this.refreshDataCallback()
    }, () => {
      this.grid.hideLoading()
    })
  },
  handleDelete() {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    this.deleteRowByIDs(ids)
  },
  render() {
    return (
      <div className={styles.main}>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady}gridOptions={gridOptions} storeConfig={{ prefix: 'shop_list' }} columnDefs={defColumns} paged grid={this}>
          批量：
          <Popconfirm title='确定要删除 我 吗？' onConfirm={this.handleDelete}>
            <Icon type='delete' className='cur' />
          </Popconfirm>
        </ZGrid>
      </div>
    )
  }
})

export default connect(state => ({
  shopconditions: state.shop_list
}))(Wrapper(Main))
