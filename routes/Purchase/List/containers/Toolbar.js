/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-17 13:28:53
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {Button, Form, Select, DatePicker, Input} from 'antd'
import SupplierPicker from 'components/SupplierPicker'
import SkuPicker from 'components/SkuPicker'
import WareHousePicker from 'components/WareHouse2Picker'
const RangePicker = DatePicker.RangePicker
const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
import {sTypes} from 'constants/Purchase'
import Wrapper from 'components/MainWrapper'

export default connect()(createForm()(Wrapper(React.createClass({
  componentDidMount() {
    this.refreshDataCallback()
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
          console.error('search Error: ', errors)
          return
        }
        this.props.dispatch({type: 'PUR_CONDITIONS1_SET', payload: {
          Purid: v.a1 || '',
          PurdateStart: v.a2 && v.a2[0] ? v.a2[0].format() : '',
          PurdateEnd: v.a2 && v.a2[1] ? v.a2[1].format() : '',
          Status: v.s6 || '',
          CoID: v.a3 && v.a3.id ? v.a3.id : '',
          Skuid: v.a4 && v.a4.id ? v.a4.id : '',
          Buyyer: v.a5 || '',
          Warehouseid: v.a7 && v.a7.id ? v.a7.id : ''
        }})
        this.props.dispatch({type: 'PUR_CONDITIONS2_SET', payload: {
          Purid: 0
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
      <Form inline>
        <FormItem>
          {getFieldDecorator('a1')(
            <Input size='small' placeholder='采购单号' style={{width: 100}} />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('a2')(
            <RangePicker size='small' showTime format='YYYY-MM-DD HH:mm:ss' />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('s6')(
            <Select placeholder='单据状态' style={{ width: 80 }} size='small'>
              <Option value=''>全部单据</Option>
              {Object.keys(sTypes).map(k => <Option key={k} value={k}>{sTypes[k]}</Option>)}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('a3')(
            <SupplierPicker size='small' />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('a4')(
            <SkuPicker size='small' />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('a7')(
            <WareHousePicker size='small' />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('a5')(
            <Input size='small' placeholder='采购员' style={{width: 80}} />
          )}
        </FormItem>
        <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
        <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
      </Form>
    )
  }
}))))
