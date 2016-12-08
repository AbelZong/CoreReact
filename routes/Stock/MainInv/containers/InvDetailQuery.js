/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-12 10:16:04
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  Form,
  Modal,
  Button,
  DatePicker,
  Select} from 'antd'
import {connect} from 'react-redux'
import {ZGet} from 'utils/Xfetch'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
const createForm = Form.create
const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
import WareHouse2Picker from 'components/WareHouse2Picker'
import {startLoading, endLoading} from 'utils'
import {sTypes} from 'constants/StockType'
import Wrapper from 'components/MainWrapper'
const DEFAULT_TITLE = '主仓明细账'
const gridOptions = {}
const columnDefs2 = [{
  headerName: '#',
  width: 30,
  checkboxSelection: true,
  cellStyle: {textAlign: 'center'},
  pinned: 'left',
  suppressSorting: true,
  enableSorting: true
}, {
  headerName: '业务类型',
  field: 'CusType',
  cellStyle: {textAlign: 'center'},
  width: 90
}, {
  headerName: '日期',
  field: 'CreateDate',
  cellStyle: {textAlign: 'center'},
  width: 150
}, {
  headerName: '库存增减数',
  field: 'Qty',
  cellStyle: {textAlign: 'center'},
  width: 120
}, {
  headerName: '内部订单号',
  field: 'OID',
  width: 120
}, {
  headerName: '仓储方',
  field: 'WhName',
  width: 90
}, {
  headerName: '操作人',
  field: 'Creator',
  width: 90
}]
const InvDetailQuery = React.createClass({
  getInitialState() {
    return {
      visible: false,
      title: DEFAULT_TITLE
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.doge > 0) {
      this.setState({
        visible: true,
        title: DEFAULT_TITLE,
        SkuautoID: nextProps.doge
      }, () => {
        this._firstBlood(nextProps.conditions)
      })
    } else {
      this.setState({
        visible: false,
        title: DEFAULT_TITLE
      })
    }
  },
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'XyCore/Inventory/InvDetailQuery'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1,
      SkuautoID: this.state.SkuautoID
    }, conditions)
    startLoading()
    this.grid.x0pCall(ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.DataCount,
        rowData: d.InvitemLst,
        page: 1,
        SkuautoID: this.state.SkuautoID,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              PageSize: params.pageSize,
              PageIndex: params.page,
              SkuautoID: this.state.SkuautoID
            }, conditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.InvItemLst)
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
    })).then(endLoading)
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  hideModal() {
    this.props.dispatch({ type: 'STOCK_INV_DETAIL_VIS_SET', payload: -1 })
  },
  render() {
    const {visible, title} = this.state
    return (
      <Modal title={title} visible={visible} onCancel={this.hideModal} footer='' width={900}>
        <Toolbars3 />
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_inv_detail' }} columnDefs={columnDefs2} grid={this} height={400} paged />
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.stock_inv_detail_vis,
  conditions: state.stock_inv_detail_conditions
}))(InvDetailQuery)
const Toolbars3 = connect()(createForm()(Wrapper(React.createClass({
  componentDidMount() {
    //this.refreshDataCallback()
  },
  handleSearch(e) {
    e.preventDefault()
    this.runSearching()
  },
  refreshDataCallback() {
    this.runSearching()
  },
  runSearching(x) {
    setTimeout(() => {
      this.props.form.validateFieldsAndScroll((errors, v) => {
        if (errors) {
          return
        }
        this.props.dispatch({type: 'STOCK_INV_DETAIL_CONDITIONS_SET', payload: {
          WarehouseID: v.ware && v.ware.id ? v.ware.id : '',
          DocType: v.type ? v.type : '',
          DocDateB: v.time && v.time[0] ? v.time[0].format() : '',
          DocDateE: v.time && v.time[1] ? v.time[1].format() : ''
        }})
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
    this.runSearching()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.toolbars2}>
        <Form inline>
          <FormItem>
            {getFieldDecorator('type')(
              <Select placeholder='业务类型' style={{ width: 130 }} size='small'>
                {Object.keys(sTypes).map(k => <Option key={k} value={k}>{sTypes[k]}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('time')(
              <RangePicker size='small' showTime format='YYYY-MM-DD HH:mm:ss' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('ware')(
              <WareHouse2Picker size='small' />
            )}
          </FormItem>
          <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
      </div>
    )
  }
}))))
