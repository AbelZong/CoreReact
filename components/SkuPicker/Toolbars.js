/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-11 10:14:12
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Select, Button, Input, Form} from 'antd'
import styles from './index.scss'
import SupplierPicker from 'components/SupplierPicker'
import BrandPicker from 'components/BrandPicker'
const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
import {types} from 'constants/Item'

export default createForm()(React.createClass({
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
          Brand: values.Brand && values.Brand.name ? values.Brand.name : '',
          SCoID: values.SCoID && values.SCoID.id ? values.SCoID.id : '',
          Enable: values.Enable || '',
          Filter: values.Filter || '',
          GoodsCode: values.GoodsCode || '',
          SkuID: values.SkuID || '',
          Type: values.Type || ''
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
            {getFieldDecorator('GoodsCode', {
              initialValue: _initialValues.GoodsCode || ''
            })(
              <Input placeholder='款式编码' size='small' style={{width: 90}} onPressEnter={this.runSearching} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('SkuID', {
              initialValue: _initialValues.SkuID || ''
            })(
              <Input placeholder='商品条码|编码' size='small' style={{width: 120}} onPressEnter={this.runSearching} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Filter', {
              initialValue: _initialValues.Filter || ''
            })(
              <Input placeholder='商品名称|简介|颜色或规格' size='small' style={{width: 155}} onPressEnter={this.runSearching} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('SCoID', {
              initialValue: _initialValues.SCoID || undefined
            })(
              <SupplierPicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Enable', {
              initialValue: typeof _initialValues.Enable === 'undefined' ? 'true' : _initialValues.Enable
            })(
              <Select style={{ width: 60 }} size='small'>
                <Option value='true'>启用</Option>
                <Option value='false'>备用</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Type', {
              initialValue: _initialValues.Type || ''
            })(
              <Select placeholder='商品类型' style={{ width: 80 }} size='small'>
                <Option value=''>不限类型</Option>
                {Object.keys(types).map(k => <Option key={k} value={k}>{types[k]}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Brand', {
              initialValue: _initialValues.Brand || undefined
            })(
              <BrandPicker size='small' />
            )}
          </FormItem>
          <Button type='primary' size='small' style={{marginLeft: 12}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
      </div>
    )
  }
}))
