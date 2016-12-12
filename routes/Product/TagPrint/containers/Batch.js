import React from 'react'
import {connect} from 'react-redux'
import {Tabs, Button, Upload, Icon, message, Form, Input} from 'antd'
import styles from './index.scss'
import ZGrid from 'components/Grid/index'
import {
  Icon as Iconfa
} from 'components/Icon'
import AppendProduct from 'components/SkuPicker/append'

const TabPane = Tabs.TabPane
const Dragger = Upload.Dragger
const createForm = Form.create
const FormItem = Form.Item




const Main = React.createClass({

  getInitialState() {
    return {
      collapse: false
    }
  },
  render() {
    return (
      <Tabs className={styles.main} onChange={this.handleTab} type='card'>
        <TabPane tab='从采购单导入打印' key='1'><PurchaseGet /></TabPane>
        <TabPane tab='从销退暂存位导入打印' key='2'><Pinback /></TabPane>
        <TabPane tab='文件导入打印' key='3'><FileUpload /></TabPane>
        <TabPane tab='自由选择商品编码' key='4'><ChoiceSku /></TabPane>
      </Tabs>
    )
  }
})

export default Main


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
    headerName: '商品编码',
    field: 'SkuID',
    cellStyle: {textAlign: 'center'},
    width: 150
  }, {
    headerName: '数量',
    field: 'Qty',
    width: 80
  }, {
    headerName: '款式编码',
    field: 'SkuName',
    width: 150
  }, {
    headerName: '颜色尺码',
    field: 'Norm',
    width: 150
  }]
const gridOptions = {
}
//自由选择商品编码
const ChoiceSku = connect()(React.createClass({
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    return (
      <div>
        <AppendProduct style={{margin: '0 0 15px 0px'}} />
        <Button type='ghost' style={{margin: '0 0 15px 15px'}}>
          打印吊牌预览
        </Button>
        <Button type='ghost' style={{margin: '0 0 15px 15px'}}>
          打印件码预览
        </Button>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'product_choice_sku' }} columnDefs={columnDefs} grid={this} height={500} paged />
      </div>
    )
  }
}))

//文件导入
const props = {
  name: 'file',
  multiple: true,
  showUploadList: false,
  action: '/upload.do',
  onChange(info) {
    const status = info.file.status
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  }
}
const FileUpload = connect()(React.createClass({
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    return (
      <div>
        <Dragger {...props}>
          <p className='ant-upload-drag-icon'>
            <Icon type='cloud-upload-o' />
          </p>
          <p className='ant-upload-text'>点击图标，或将文件拖至当前区域即可导入文件</p>
          <p className='ant-upload-hint'>通过EXCEL导入(EXCEL字段格式为：商品编码 数量 款式编码 颜色尺码)</p>
        </Dragger>
        <div style={{margin: '10px'}} />
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'product_choice_sku' }} columnDefs={columnDefs} grid={this} height={500} paged />
      </div>
    )
  }
}))

//从销退暂存导入
const Pinback = connect()(React.createClass({
  handleGridReady(grid) {
    this.grid = grid
  },
  render() {
    return (
      <div>
        <Button type='ghost' style={{margin: '0 0 15px 15px'}}>
          打印吊牌预览
        </Button>
        <Button type='ghost' style={{margin: '0 0 15px 15px'}}>
          打印件码预览
        </Button>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'product_choice_sku' }} columnDefs={columnDefs} grid={this} height={500} paged />
      </div>
    )
  }
}))

//从采购单导入

const PurchaseGet = connect()(createForm()(React.createClass({
  handleGridReady(grid) {
    this.grid = grid
  },
  handleSearch() {

  },
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form inline>
          <FormItem>
            {getFieldDecorator('a1')(
              <Input placeholder='采购单号' />
            )}
          </FormItem>
          <Button type='primary' style={{marginLeft: 2}} onClick={this.handleSearch}>导入商品</Button>
        </Form>
        <Button type='ghost' style={{margin: '15px 0'}}>打印吊牌预览</Button>
        <Button type='ghost' style={{margin: '15px 5px'}}>打印件码预览</Button>
        <Button type='ghost' style={{margin: '15px 5px'}}>BT打印件码预览</Button>
        <Button type='ghost' style={{margin: '15px 5px'}}>BT打印件码预览</Button>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'product_choice_sku' }} columnDefs={columnDefs} grid={this} height={500} paged />
      </div>
    )
  }
})))
