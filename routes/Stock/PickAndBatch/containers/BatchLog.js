/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-12-08 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {
  Modal,
  Form,
  Select,
  Input,
  Button
} from 'antd'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'

const createForm = Form.create
const Option = Select.Option
const FormItem = Form.Item
const DEFAULT_TITLE = '批次日志'
const gridOptions = {}
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
    headerName: '出库订单号',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '操作',
    field: 'Status',
    cellStyle: {textAlign: 'center'},
    width: 70
  }, {
    headerName: '唯一码',
    field: 'TypeString',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '商品编码',
    field: 'Pickor',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '数量',
    field: 'OrderQty',
    cellStyle: {textAlign: 'right'},
    width: 80
  }, {
    headerName: '备注',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '备注2',
    field: 'Qty',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '操作时间',
    field: 'PickedQty',
    cellStyle: {textAlign: 'right'},
    width: 80
  }, {
    headerName: '操作人',
    field: 'NotPickedQty',
    cellStyle: {textAlign: 'right'},
    width: 80
  }]
const BatchLogMain = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE
    }
  },
  componentDidMount() {
    this._firstBlood()
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge > 0) {
        this.setState({
          visible: true,
          confirmLoading: false
        }, () => {
          this._firstBlood(nextProps.conditions)
        })
      } else {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      }
    }
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
  _firstBlood(_conditions) {
    const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    const uri = 'Batch/GetBatchList'
    // const data = Object.assign({
    //   PageSize: this.grid.getPageSize(),
    //   PageIndex: 1
    // }, conditions)
    // this.grid.x0pCall(ZGet(uri, data, ({d}) => {
    //   if (this.ignore) {
    //     return
    //   }
    //   this.grid.setDatasource({
    //     total: d.Datacnt,
    //     rowData: d.Batch,
    //     page: 1,
    //     getRows: (params) => {
    //       if (params.page === 1) {
    //         this._firstBlood()
    //       } else {
    //         const qData = Object.assign({
    //           PageSize: params.pageSize,
    //           PageIndex: params.page
    //         }, conditions)
    //         ZGet(uri, qData, ({d}) => {
    //           if (this.ignore) {
    //             return
    //           }
    //           params.success(d.Batch)
    //         }, ({m}) => {
    //           if (this.ignore) {
    //             return
    //           }
    //           params.fail(m)
    //         })
    //       }
    //     }
    //   })
    // }))
  },
  handleSearch(e) {
    e.preventDefault()
    this.runSearching()
  },
  runSearching(x) {
    setTimeout(() => {
      this.props.form.validateFieldsAndScroll((errors, v) => {
        if (errors) {
          return
        }
        console.log(v)
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
    this.runSearching()
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  hideModal() {
    this.props.dispatch({ type: 'PB_BATCH_LOG_VIS_SET', payload: -1 })
  },
  render() {
    const {visible, title, confirmLoading} = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const BatchLog = [{
      'value': '0',
      'label': '绑定批次'
    }, {
      'value': '1',
      'label': '解绑批次'
    }, {
      'value': '2',
      'label': '拣货'
    }, {
      'value': '3',
      'label': '播种'
    }, {
      'value': '4',
      'label': '取消播种'
    }]
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={1000} maskClosable={false}>
        <Form inline className={`pos-form`}>
          <FormItem {...formItemLayout} label=''>
            {getFieldDecorator('Type')(
              <Select showSearch style={{ width: 200 }} placeholder='请选择' optionFilterProp='children' onChange={this.handleChange}>
                {BatchLog.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='出库单'>
            {getFieldDecorator('OrderId')(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='备注'>
            {getFieldDecorator('Remark')(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label=''>
            <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
          </FormItem>
          <FormItem {...formItemLayout} label=''>
            <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
          </FormItem>
        </Form>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_batch_log' }} columnDefs={columnDefs} grid={this} paged height={500} />
      </Modal>
      )
  }
})
export default connect(state => ({
  doge: state.pb_batch_log_vis
}))(createForm()(BatchLogMain))
