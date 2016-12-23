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
  Modal, Button, message, Dropdown, Menu, Form, Input, Col, Popover
} from 'antd'
import ZGrid from 'components/Grid/index'
import styles from './index.scss'
import {
  ZPost
} from 'utils/Xfetch'
import {
  Icon as Iconfa
} from 'components/Icon'
import SaleOutToolBar from './SaleOutToolBar'
const InputGroup = Input.Group
const DEFAULT_TITLE = '销售出库单'
const createForm = Form.create
const FormItem = Form.Item
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
    headerName: '出仓单号',
    field: 'ID',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '内部订单号',
    field: 'Status',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '线上订单号',
    field: 'TypeString',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '单据日期',
    field: 'Pickor',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '状态',
    field: 'OrderQty',
    cellStyle: {textAlign: 'center'},
    width: 80
  }, {
    headerName: '物流公司',
    field: 'SkuQty',
    width: 100
  }, {
    headerName: '物流单号（运单号）',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 160
  }, {
    headerName: '批次号',
    field: 'SkuQty',
    cellStyle: {textAlign: 'center'},
    width: 80
  }, {
    headerName: '订单已打印',
    field: 'SkuQty',
    cellStyle: {textAlign: 'center'},
    width: 100
  }, {
    headerName: '快递单已打印',
    field: 'SkuQty',
    cellStyle: {textAlign: 'center'},
    width: 120
  }, {
    headerName: '打印次数',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '买家留言',
    field: 'SkuQty',
    width: 100
  }, {
    headerName: '收货地址',
    field: 'SkuQty',
    width: 200
  }, {
    headerName: '收货人',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 70
  }, {
    headerName: '移动电话',
    field: 'SkuQty',
    width: 100
  }, {
    headerName: '预估重量',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 100
  }, {
    headerName: '货物方式',
    field: 'SkuQty',
    width: 100
  }, {
    headerName: '运费',
    field: 'SkuQty',
    cellStyle: {textAlign: 'right'},
    width: 60
  }, {
    headerName: '已发货',
    field: 'SkuQty',
    width: 80
  }, {
    headerName: '商品',
    field: 'SkuQty',
    width: 60
  }, {
    headerName: '备注',
    field: 'SkuQty',
    width: 100
  }]
const SaleOut = React.createClass({
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
    //const conditions = Object.assign({}, this.props.conditions || {}, _conditions || {})
    //const uri = 'Batch/GetBatchList'
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
  handleGridReady(grid) {
    this.grid = grid
  },
  handlePrintSet(e) {
    const ids = this.grid.api.getSelectedRows().map(x => x.ID)
    if (ids.length === 0) {
      message.info('请先选择拣货批次')
    } else {
      switch (e.key) {
        case '1': {
          ZPost('Batch/MarkPrint', {
            ID: ids
          }, () => {
            this.refreshDataCallback()
          })
          break
        }
        case '2': {
          ZPost('Batch/CancleMarkPrint', {
            ID: ids
          }, () => {
            this.refreshDataCallback()
          })
          break
        }
        default: {
          message.info('not supported yet')
          break
        }
      }
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'PB_SALE_OUT_VIS_SET', payload: -1 })
  },
  render() {
    const {visible, title, confirmLoading} = this.state
    const markmenu = (
      <Menu onClick={this.handlePrintSet}>
        <Menu.Item key='1'><Iconfa type='pencil' style={{color: '#32cd32'}} />&nbsp;标记拣货单已打</Menu.Item>
        <Menu.Item key='2'>取消标记拣货单已打</Menu.Item>
      </Menu>
    )
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={1200} maskClosable>
        <SaleOutToolBar />
        <SeachByPrint />
        <div className={styles.topOperators}>
          <Button type='ghost' size='small' style={{marginLeft: 10}}>
            <Iconfa type='file-excel-o' style={{color: '#32cd32'}} />&nbsp;导出
          </Button>
          <Button type='ghost' size='small' style={{marginLeft: 10}}>
            <Iconfa type='print' style={{color: '#32cd32'}} />&nbsp;补打订单
          </Button>
          <Button type='ghost' size='small' style={{marginLeft: 10}}>
            <Iconfa type='print' style={{color: '#32cd32'}} />&nbsp;补打快递单
          </Button>
          <Button type='ghost' size='small' style={{marginLeft: 10}}>
            <Iconfa type='print' style={{color: '#32cd32'}} />&nbsp;商品小标签
          </Button>
          <Dropdown overlay={markmenu}>
            <Button type='ghost' size='small' style={{marginLeft: 10}}>
              <Iconfa type='pencil' style={{color: '#32cd32'}} />&nbsp;标记&nbsp;|&nbsp;取消标记打印
            </Button>
          </Dropdown>
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'stock_batch_sale_out' }} columnDefs={columnDefs} grid={this} paged height={500} />
      </Modal>
      )
  }
})
export default connect(state => ({
  doge: state.pb_sale_out_vis
}))(SaleOut)

const SeachByPrint = connect(state => ({
  doge: state.pb_sale_out_print_task_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      title: '根据打印任务筛选出库订单',
      confirmLoading: false
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else {
        this.setState({
          visible: true,
          confirmLoading: false
        })
      }
    }
  },
  handleSubmit() {
  },
  hideModal() {
    this.props.dispatch({ type: 'PB_SALE_OUT_PRINT_TASK_VIS_SET', payload: -1 })
    this.setState({
      visible: false
    }, () => {
      this.props.form.resetFields()
    })
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const Pop1 = (
      <div>
        <p>打印任务号为每次请求打印时自动生成。</p>
        <p>`标准格式由三部分组成，如：161112.2212.12（年月日-时分-打印流水号）</p>
        <p>`如果只输入一部分，如：12=则默认为当天的打印流水号`如果输入两部分，如161112.12=则默认为指定打印日期及对应的打印流水号`全部输入则精确匹配</p>
      </div>
    )
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={500} maskClosable>
        <div className={styles.sborder}>
          <p>打印快递单时，系统会为每次打印任务号生成一个任务号，并且每个订单按照打印先后顺序生成打印序号。</p>
          <p>标准格式由三部分组成，如：161112.2212.12（年月日.时分.打印流水号）</p>
          <p>打印序号指每个订单打印时的序号，每次任务均从1开始编号</p>
        </div>
        <Form horizontal className='pos-form' style={{marginTop: 10}}>
          <FormItem {...formItemLayout} label='打印任务号'>
            {getFieldDecorator('GoodsCode', {
              rules: [{ required: true, message: '必填' }]
            })(
              <Popover placement='top' content={Pop1} trigger='click'>
                <Input placeholder='' style={{width: 200}} />
              </Popover>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='打印序号'>
            {getFieldDecorator('GoodsCode')(
              <InputGroup>
                <Col span={6}>
                  <Popover placement='top' content='印任务号对应流水号，每打印任务均从1开始。' trigger='click'>
                    <Input placeholder='起始打印号' />
                  </Popover>
                </Col>
                <Col span={6}>
                  <Popover placement='top' content='印任务号对应流水号，每打印任务均从1开始。' trigger='click'>
                    <Input placeholder='结束打印号' />
                  </Popover>
                </Col>
              </InputGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
