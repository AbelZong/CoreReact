import React from 'react'
import {connect} from 'react-redux'
import {Form, Button, Input, Select, Modal} from 'antd'
import styles from './index.scss'
import ZGrid from 'components/Grid/index'
import {startLoading, endLoading} from 'utils'
import {
  ZGet, ZPost
} from 'utils/Xfetch'


const createForm = Form.create
const FormItem = Form.Item
const Option = Select.Option
const columnDefs = [{
  headerName: '商品编码',
  field: 'SkuID',
  cellStyle: {textAlign: 'center'},
  width: 150
}, {
  headerName: '数量',
  field: 'Qty',
  width: 80
}]
const gridOptions = {
}
const Brand = createForm()(React.createClass({

  getInitialState() {
    return {
      collapse: false
    }
  },
  handleSetPrint() {
    this.props.dispatch({ type: 'PRODUCT_SHOP_BAND_SET', payload: 1 })
  },
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.main}>
        <Form inline style={{ margin: '0px 0px 15px 15px' }}>
          <FormItem>
            {getFieldDecorator('type', {
              initialValue: '1'
            })(
              <Select style={{width: '110px'}}>
                <Option value='1'>运单号</Option>
                <Option value='2'>内部订单号</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('no')(
              <Input />
            )}
          </FormItem>
          <Button type='primary' style={{marginLeft: 2}} onClick={this.handleSearch}>打印</Button>
          <Button type='ghost' style={{marginLeft: 15}} onClick={this.handleSetPrint}>设置店铺模板</Button>
          <Button type='ghost' style={{marginLeft: 15}} onClick={this.handleSetPrint}>编辑吊牌模板</Button>
        </Form>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={gridOptions} storeConfig={{ prefix: 'product_choice_sku' }} columnDefs={columnDefs} grid={this} height={500} paged />
        <ModifyModal />
      </div>
    )
  }
}))

export default connect(state => ({
  conditions: state.product_list2_conditions
}))(Brand)


const ModifyModal = connect(state => ({
  doge: state.product_shop_band
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: '设置店铺模板',
      shopAndprint: {shopEnum: [], myTpls: []}
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
        startLoading()
        ZGet({
          uri: 'print/tpl/GetShopAndMytpl',
          data: {
            type: 1 // 吊牌type
          },
          success: ({d}) => {
            this.setState({
              visible: true,
              confirmLoading: false,
              shopAndprint: d
            })
          }}).then(endLoading)
      }
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'PRODUCT_SHOP_BAND_SET', payload: -1 })
  },
  handleSubmit() {
    this.props.form.validateFields((errors, v) => {
      const shopArr = []
      for (let id in v.shop) {
        shopArr.push({id: id, printID: v.shop[id].id})
      }
      this.setState({
        confirmLoading: true
      }, () => {
        ZPost({
          uri: 'Shop/setShopPrint',
          data: {
            shopArr: shopArr
          },
          success: ({s}) => {
            if (s > 0) {
              this.hideModal()
            }
          }})
      })
    })
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state
    const formItemLayout2 = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={500} maskClosable={false}>
        <Form horizontal className='pos-form'>
          {
            this.state.shopAndprint.shopEnum.length ? this.state.shopAndprint.shopEnum.map((x, index) => {
              return <FormItem {...formItemLayout2} label={x.label} key={index}>
                {getFieldDecorator(`shop.${x.value}`, {initialValue: {
                  id: x.printID,
                  tpls: this.state.shopAndprint.myTpls
                }})(
                  <PrintS key={`${x.value}-index`} />
                )}
              </FormItem>
            }) : null
          }
        </Form>
      </Modal>
    )
  }

})))

const PrintS = React.createClass({
  getInitialState() {
    return {
      id: this.props.value.id,
      tpls: this.props.value.tpls
    }
  },
  handleCheck(e) {
    this.setState({
      value: e.label,
      id: e.key
    }, () => {
      this.props.onChange && this.props.onChange({
        value: this.state.value,
        id: this.state.id
      })
    })
  },
  render() {
    return (
      <Select labelInValue style={{ width: 200 }} defaultValue={{key: this.state.id !== 0 ? `${this.state.id}` : ''}} onChange={this.handleCheck}>
        {this.state.tpls ? (this.state.tpls.map(y => <Option value={`${y.id}`} key={y.id}>{y.name}
        </Option>)
        ) : <Option key={0} />}
      </Select>
    )
  }
})

