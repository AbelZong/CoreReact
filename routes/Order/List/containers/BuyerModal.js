/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-17 PM
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
  Modal,
  Button,
  Form,
  Input
} from 'antd'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {
  ZGet
} from 'utils/Xfetch'
import ShopOriginPicker from 'components/ShopOriginPicker'
const FormItem = Form.Item

const Toolbars = Form.create()(React.createClass({
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
        if (errors) {
          console.error('search Error: ', errors)
          return
        }
        this.props.onSearch && this.props.onSearch({
          ShopSit: values.ShopSit && values.ShopSit.name ? values.ShopSit.name : '',
          Receiver: values.Receiver || '',
          BuyerId: values.BuyerId || ''
        })
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
    const _initialValues = this.props.initialValues || {}
    return (
      <div className={styles.toolbars}>
        <Form inline>
          <FormItem>
            {getFieldDecorator('ShopSit', {
              initialValue: _initialValues.ShopSit || undefined
            })(
              <ShopOriginPicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Receiver', {
              initialValue: _initialValues.Receiver || ''
            })(
              <Input placeholder='客户名字' size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('BuyerId', {
              initialValue: _initialValues.BuyerId || ''
            })(
              <Input placeholder='客户店铺帐号' size='small' />
            )}
          </FormItem>
          <Button type='primary' size='small' style={{marginLeft: 12}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
      </div>
    )
  }
}))

export default connect(state => ({
  doge: state.order_list_buyer_select_vis
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
    this.ignoreCase = true
  },
  handleOK() {
    const selecter = this.grid.api.getSelectedRows()[0]
    if (selecter) {
      this.props.onOk(selecter)
    } else {
      this.props.onCancel()
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
    const uri = 'Order/RecInfoList'
    const data = Object.assign({
      NumPerPage: this.grid.getPageSize(),
      PageIndex: 1
    }, this.searchConditions)
    ZGet(uri, data, ({d}) => {
      if (this.ignore) {
        return
      }
      this.grid.setDatasource({
        total: d.Datacnt,
        rowData: d.Recinfo,
        page: 1,
        getRows: (params) => {
          if (params.page === 1) {
            this.handleSearch()
          } else {
            const qData = Object.assign({
              NumPerPage: params.pageSize,
              PageIndex: params.page
            }, this.searchConditions)
            ZGet(uri, qData, ({d}) => {
              if (this.ignore) {
                return
              }
              params.success(d.Recinfo)
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
      <Modal wrapClassName={styles.modal} title='选择客户' visible={this.props.doge >= 0} maskClosable={false} onCancel={this.props.onCancel} footer='' width={850}>
        <div className={styles.hua}>
          <Toolbars onSearch={this.handleSearch} />
          <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'zhanghua_10' }} columnDefs={columnDefs} paged grid={this} pagesAlign='left'>
            <div className={styles.footerBtns}>
              <Button type='ghost' onClick={this.handleOk} className='hide'>清除</Button>
              <Button type='primary' onClick={this.handleOK}>确认客户</Button>
              <Button onClick={this.handleok}>关闭</Button>
            </div>
          </ZGrid>
        </div>
      </Modal>
    )
  }
}))
const NUMBER_REG = new RegExp(/^(\d{3})\d{4}(\d{4})$/)
const NumberHidden = function(params) {
  return params.value ? `${params.value}`.replace(NUMBER_REG, '$1****$2') : ''
}
const columnDefs = [
  {
    headerName: 'ID',
    field: 'ID',
    width: 80
  }, {
    headerName: '买家账号',
    field: 'BuyerId',
    width: 130
  }, {
    headerName: '商店站点',
    field: 'ShopSit',
    width: 120
  }, {
    headerName: '用户姓名',
    field: 'Receiver',
    width: 130
  }, {
    headerName: '省',
    field: 'Logistics',
    width: 90
  }, {
    headerName: '市',
    field: 'City',
    width: 90
  }, {
    headerName: '区',
    field: 'District',
    width: 90
  }, {
    headerName: '地址',
    field: 'Address',
    width: 220
  }, {
    headerName: '邮编',
    field: 'ZipCode',
    width: 100
  }, {
    headerName: '电话',
    field: 'Tel',
    width: 100,
    cellRenderer: NumberHidden
  }, {
    headerName: '手机',
    field: 'Phone',
    width: 100,
    cellRenderer: NumberHidden
  }, {
    headerName: '邮箱',
    field: 'Email',
    width: 100
  }, {
    headerName: 'QQ',
    field: 'QQ',
    width: 80
  }]
const gridOptions = {
  enableSorting: true,
  enableServerSideSorting: true,
  rowSelection: 'single',
  onBeforeSortChanged: function() {
    const sorter = this.api.getSortModel()[0]
    const conditions = sorter ? { SortField: sorter.colId, SortDirection: sorter.sort.toUpperCase() } : { SortField: null, SortDirection: null }
    this.grid.handleSearch(conditions)
  },
  onRowDoubleClicked: function() {
    this.grid.handleOK()
  }
}
