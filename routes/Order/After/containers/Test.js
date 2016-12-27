/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-03 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import {
  Input,
  Form,
  Select,
  Button,
  Radio,
  Modal
} from 'antd'
import {
  Icon
} from 'components/Icon'
import ZGrid from 'components/Grid/index'
import ShopPicker from 'components/ShopPicker'
import DistributorPicker from 'components/DistributorPicker'
import WareHousePicker from 'components/WareHouse2Picker'
import styles from './index.scss'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import ExpressPicker from 'components/ExpressPicker'
import DateRange from 'components/DateStartEnd'
const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
const RadioGroup = Radio.Group

const Test = React.createClass({
  getInitialState: function() {
    return {
      visible: '0',
      value: null,
      name: '',
      type: '1'
    }
  },
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.value === 'undefined') {
      if (nextProps.hasOwnProperty('value')) {
        if (this.state.value !== nextProps.value) {
          this.setState({
            value: null,
            name: ''
          })
        }
      }
    } else {
      if (this.state.value !== nextProps.value.id) {
        this.setState({
          value: nextProps.value.id,
          name: nextProps.value.name
        })
      }
    }
  },
  handleSelect() {
    this.setState({
      visible: this.state.type
    })
  },
  handleModalCancel() {
    this.setState({
      visible: '0'
    })
  },
  handleModalOk(data) {
    if (data) {
      //sbc
      const name = this.props.nameField ? data[this.props.nameField] : data.ID
      const value = this.props.valueField ? data[this.props.valueField] : data.ID
      this._setValue(value, name, '0', data)
    } else {
      this._setValue(null, '', '0', data)
    }
  },
  _setValue(value, name, visible, data) {
    const states = { value, name }
    if (typeof visible !== 'undefined') {
      states.visible = visible
    }
    this.setState(states, () => {
      this.props.onChange && this.props.onChange({id: value, name, data})
    })
  },
  handleRemove(e) {
    e.stopPropagation()
    this._setValue(null, '')
  },
  handleSelect1(type) {
    this.setState({
      type
    })
  },
  render() {
    const {style, className, size} = this.props
    let CN = className ? `${styles.zhang} ${className}` : styles.zhang
    switch (size) {
      case 'small': {
        CN = `${CN} ${styles.zhangs}`
        break
      }
      default: {}
    }
    const w = 126 //200
    const styler = style ? {width: this.props.width || w, ...style} : {width: this.props.width || w}
    return (
      <div className={CN} style={styler}>
        <div className={styles.inputArea}>
          <Input onClick={this.handleSelect} value={this.state.name} placeholder={this.props.placeholder || '选择订单'} size={this.props.size || 'default'} className={styles.input} title={this.state.name || '点击选择订单'} />
          <span className={styles.operator}>
            {this.state.name !== '' ? <Icon type='minus' onClick={this.handleRemove} title='点击移除' /> : <Icon type='ellipsis-h' title='点击选择' />}
          </span>
        </div>
        <InnerModal doge={this.state.visible} onOk={this.handleModalOk} onCancel={this.handleModalCancel} value={this.state.value} />
      </div>
    )
  }
})
const Toolbars = createForm()(React.createClass({
  componentWillMount() {
    this._conditions = {
      _ck1_: '1',
      _ck2_: '1'
    }
  },
  componentDidMount() {
    this.runSearching()
  },
  handleSearch(e) {
    e.preventDefault()
    this.runSearching()
  },
  runSearching(x) {
    setTimeout(() => {
      this.props.form.validateFieldsAndScroll((errors, values) => {
        //console.log(values)
        if (errors) {
          return
        }
        const cds = this._conditions || {}
        const data = Object.assign({}, values)
        if (values._cv_1_) {
          switch (cds._ck1_) {
            case '2': {
              data.ID = data._cv_1_
              break
            }
            case '3': {
              data.ExCode = data._cv_1_
              break
            }
            case '4': {
              data.PayNbr = data._cv_1_
              break
            }
            default: {
              data.SoID = data._cv_1_
            }
          }
        }
        delete data._cv_1_
        if (values._cv_2_) {
          switch (cds._ck2_) {
            case '2': {
              data.RecName = data._cv_2_
              break
            }
            case '3': {
              data.RecPhone = data._cv_2_
              break
            }
            case '4': {
              data.RecTel = data._cv_2_
              break
            }
            default: {
              data.BuyerShopID = data._cv_2_
            }
          }
        }
        delete data._cv_2_
        if (data._Date_) {
          if (data._Date_.date_start) {
            data.DateStart = data._Date_.date_start.format()
          }
          if (data._Date_.date_end) {
            data.DateEnd = data._Date_.date_end.format()
          }
        }
        delete data._Date_
        data.Distributor = data.Distributor && data.Distributor.id ? data.Distributor.id : ''
        data.ShopID = data.ShopID && data.ShopID.id ? data.ShopID.id : ''
        data.SendWarehouse = data.SendWarehouse && data.SendWarehouse.id ? data.SendWarehouse.id : ''
        data.ExID = data.ExID && data.ExID.id ? data.ExID.id : ''
        console.log(data)
        this.props.onSearch && this.props.onSearch(data)
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
      <div className={styles.toolbars}>
        <Form inline>
          <FormItem style={{ width: 170 }}>
            {getFieldDecorator('_cv_1_')(
              <Input addonBefore={(
                <Select size='small' defaultValue={this._conditions._ck1_} style={{ width: 80 }} onChange={(e) => {
                  this._conditions._ck1_ = e
                }}>
                  <Option value='1'>线上单号</Option>
                  <Option value='2'>内部单号</Option>
                  <Option value='3'>快递单号</Option>
                  <Option value='4'>支付单号</Option>
                </Select>
              )} size='small' onPressEnter={this.runSearching} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('_Date_')(
              <DateRange format='YYYY-MM-DD HH:mm:ss' size='small' onPressEnter={this.runSearching} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('ShopID')(
              <ShopPicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('ExID')(
              <ExpressPicker size='small' />
            )}
          </FormItem>
          <FormItem style={{ width: 170 }}>
            {getFieldDecorator('_cv_2_')(
              <Input addonAfter={(
                <Select size='small' defaultValue={this._conditions._ck2_} style={{ width: 80 }} onChange={(e) => {
                  this._conditions._ck2_ = e
                }}>
                  <Option value='1'>买家账号</Option>
                  <Option value='2'>收货人</Option>
                  <Option value='3'>手机</Option>
                  <Option value='4'>固定电话</Option>
                </Select>
              )} size='small' onPressEnter={this.runSearching} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Distributor')(
              <DistributorPicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('SendWarehouse')(
              <WareHousePicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Status')(
              <RadioGroup size='small'>
                <Radio style={{lineHeight: '22px'}} value={4}>已发货</Radio>
                <Radio style={{lineHeight: '22px'}} value={6}>取消</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <Button type='primary' size='small' style={{marginLeft: 12}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
      </div>
    )
  }
}))

const InnerModal = connect()(React.createClass({
  getInitialState: function() {
    this.searchConditions = {}
    return {
      spinning: false,
      value: null,
      dataList: []
    }
  },
  componentWillUnmount() {
    this.ignore = true
  },
  handleOK() {
    const selecter = this.grid.api.getSelectedRows()[0]
    if (selecter) {
      this.props.onOk(selecter)
    } else {
      this.handleok()
    }
  },
  handleOk() {
    this.setState({
      value: null,
      valueName: ''
    }, () => {
      this.props.onOk(null)
    })
  },
  handleok() {
    this.props.onCancel()
  },
  handleSearch(_conditions) {
    Object.assign(this.searchConditions, _conditions || {})
    this.grid.showLoading()
    const uri = 'AfterSale/GetASOrderList'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, this.searchConditions)
    ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.Ord,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this.handleSearch()
          } else {
            const qData = Object.assign({
              PageSize: params.pageSize,
              PageIndex: params.page
            }, this.searchConditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.Ord)
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
    }, () => {
      this.grid.showNoRows()
    })
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    return (
      <Modal wrapClassName={styles.modal} title='指定售后订单' visible={this.props.doge > 0} maskClosable={false} onCancel={this.handleok} footer='' width={950}>
        <div className={styles.hua}>
          <Toolbars onSearch={this.handleSearch} />
          <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'zhanhua_110' }} columnDefs={columnDefs} paged grid={this} pagesAlign='left'>
            <div className={styles.footerBtns}>
              <Button type='ghost' onClick={this.handleOk}>清除</Button>
              <Button type='primary' onClick={this.handleOK}>确认订单</Button>
              <Button onClick={this.handleok}>关闭</Button>
            </div>
          </ZGrid>
        </div>
        <div className='hr' />
        <Detail />
      </Modal>
    )
  }
}))
const BindModal = connect(state => ({
  doge: state.order_after_bind_order_vis_1
}))(React.createClass({
  getInitialState: function() {
    this.searchConditions = {}
    return {
      spinning: false,
      value: null,
      dataList: []
    }
  },
  componentWillUnmount() {
    this.ignore = true
  },
  handleOK() {
    const selecter = this.grid.api.getSelectedRows()[0]
    console.log()
    if (selecter) {
      const {ID, rowIndex} = this.props.doge
      this.handleok()
      this.props.zch.grid.x0pCall(ZPost('AfterSale/BindOrd', {RID: ID, OID: selecter.ID}, ({d}) => {
        if (!this.ignore) {
          this.props.zch.updateRowByIndex(rowIndex, d)
        }
      }))
    } else {
      this.handleok()
    }
  },
  handleok() {
    this.props.dispatch({type: 'ORDER_AFTER_BIND_ORDER_VIS_1_SET', payload: null})
  },
  handleSearch(_conditions) {
    Object.assign(this.searchConditions, _conditions || {})
    this.grid.showLoading()
    const uri = 'AfterSale/GetASOrderList'
    const data = Object.assign({
      PageSize: this.grid.getPageSize(),
      PageIndex: 1
    }, this.searchConditions)
    ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.DataCount,
        rowData: d.Ord,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this.handleSearch()
          } else {
            const qData = Object.assign({
              PageSize: params.pageSize,
              PageIndex: params.page
            }, this.searchConditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.Ord)
            }, ({m}) => {
              if (this.ignore) {
                return
              }
              params.fail(m)
            })
          }
        }
      })
    }, () => {
      this.grid.showNoRows()
    })
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    return (
      <Modal wrapClassName={styles.modal} title='绑定售后订单' visible={this.props.doge !== null} maskClosable={false} onCancel={this.handleok} footer='' width={950}>
        <div className={styles.hua}>
          <Toolbars onSearch={this.handleSearch} />
          <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'zhanhua_110' }} columnDefs={columnDefs} paged grid={this} pagesAlign='left'>
            <div className={styles.footerBtns}>
              <Button type='primary' onClick={this.handleOK}>绑定订单</Button>
              <Button onClick={this.handleok}>关闭</Button>
            </div>
          </ZGrid>
        </div>
        <div className='hr' />
        <Detail />
      </Modal>
    )
  }
}))
const Detail = connect(state => ({
  doge: state.order_after_order_detail_vis_1
}))(React.createClass({
  getInitialState() {
    return {
      dataList: [],
      OID: 0
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      ZGet('AfterSale/GetASOrderItemS', {OID: nextProps.doge}, ({d}) => {
        this.setState({
          dataList: d,
          OID: nextProps.doge
        })
      })
    }
  },
  _renderDataList() {
    return (
      <ul className={styles.skulist}>
        {this.state.dataList.map(x => (
          <li key={x.ID}>
            <div className={styles.img} style={{backgroundImage: x.Img ? `url(${x.Img})` : 'none'}} />
            <div className={styles.name}>{x.SkuName}&nbsp;<em>{x.GoodsCode}/{x.SkuID}</em></div>
            <div className={styles.qty}>x {x.Qty}</div>
            <div className={styles.price}>&yen; {x.RealPrice}/单</div>
            <div className={styles.amount}>&yen; {x.Amount}/总</div>
            <div className={styles.norm}>{x.Norm}</div>
            <div className={styles.gift}>
              {x.IsGift ? <small>赠品</small> : null}
            </div>
          </li>
        ))}
      </ul>
    )
  },
  _renderNo() {
    if (this.state.OID > 0) {
      return (
        <div className={styles.noSkulist}>该订单没有商品</div>
      )
    }
    return (
      <div className={styles.noSkulist}>单击单笔订单可查看 订单商品 信息</div>
    )
  },
  render() {
    return (
      <div className={`${styles.details} h-scroller`}>
        {this.state.OID > 0 ? <div className={styles.no}>{this.state.OID}</div> : null}
        {this.state.dataList.length ? this._renderDataList() : this._renderNo()}
      </div>
    )
  }
}))
const columnDefs = [
  {
    headerName: '订单号',
    field: 'ID',
    enableSorting: true,
    width: 100
  }, {
    headerName: '订单日期',
    field: 'ODate',
    enableSorting: true,
    width: 120
  }, {
    headerName: '买家账号',
    field: 'BuyerShopID',
    width: 120
  }, {
    headerName: '店铺',
    field: 'ShopName',
    width: 180
  }, {
    headerName: '外部订单号',
    field: 'SoID',
    width: 120
  }, {
    headerName: '应付款',
    field: 'Amount',
    suppressSorting: true,
    width: 100
  }, {
    headerName: '已付款',
    field: 'PaidAmount',
    suppressSorting: true,
    width: 100
  }, {
    headerName: '运费',
    field: 'ExAmount',
    suppressSorting: true,
    width: 80
  }, {
    headerName: '订单类型',
    field: 'TypeString',
    suppressSorting: true,
    width: 100
  }, {
    headerName: '收货人',
    field: 'RecName',
    suppressSorting: true,
    width: 100
  }, {
    headerName: '买家留言',
    field: 'RecMessage',
    width: 140
  }, {
    headerName: '固定电话',
    field: 'RecTel',
    suppressSorting: true,
    width: 100
  }, {
    headerName: '手机号',
    field: 'RecPhone',
    suppressSorting: true,
    width: 100
  }, {
    headerName: '收货地址',
    field: 'RecAddress',
    width: 250,
    cellRenderer: function(params) {
      const {data} = params
      return `${data.RecLogistics} ${data.RecCity} ${data.RecDistrict} ${data.RecAddress}`
    }
  }, {
    headerName: '快递公司',
    field: 'Express',
    suppressSorting: true,
    width: 100
  }, {
    headerName: '快递单号',
    field: 'ExCode',
    width: 100
  }]
const gridOptions = {
  enableSorting: true,
  enableServerSideSorting: true,
  rowSelection: 'single',
  onRowSelected: function(e) {
    if (e.node.selected) {
      this.grid.props.dispatch({type: 'ORDER_AFTER_ORDER_DETAIL_VIS_1_SET', payload: e.node.data.ID})
    }
  },
  onBeforeSortChanged: function() {
    const sorter = this.api.getSortModel()[0]
    const conditions = sorter ? { SortField: sorter.colId, SortDirection: sorter.sort.toUpperCase() } : { SortField: null, SortDirection: null }
    this.grid.handleSearch(conditions)
  }
  // onRowDoubleClicked: function() {
  //   this.grid.handleOK()
  // }
}

export {
  Test as ButtonModal,
  BindModal
}
