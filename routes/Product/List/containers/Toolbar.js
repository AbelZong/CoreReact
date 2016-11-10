/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-05 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import styles from './index.scss'
import {
  Button,
  Form,
  Select,
  Input
} from 'antd'
import SupplierPicker from 'components/SupplierPicker'
import BrandPicker from 'components/BrandPicker'
const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
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
          return
        }
        v.Brand = (v.Brand && v.Brand.id) ? v.Brand.id : ''
        v.ScoID = (v.ScoID && v.ScoID.id) ? v.ScoID.id : ''
        this.props.dispatch({type: 'PRODUCT_LIST_CONDITIONS_SET', payload: v})
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
    this.runSearching()
  },
  handleCreateNew1() {
    this.props.dispatch({type: 'PRODUCT_LIST_MODIFY_VIS_SET', payload: -1})
  },
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.toolbars}>
        <Form inline>
          <FormItem>
            {getFieldDecorator('SkuName')(
              <Input size='small' placeholder='商品名称' style={{width: 100}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('SkuSimple')(
              <Input size='small' placeholder='商品简称' style={{width: 100}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Norm')(
              <Input size='small' placeholder='颜色规格' style={{width: 100}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Brand')(
              <BrandPicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('ScoGoodsCode')(
              <Input size='small' placeholder='供应商商品编码' style={{width: 100}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('ScoSku')(
              <Input size='small' placeholder='供应商商品款号' style={{width: 100}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('ScoID')(
              <SupplierPicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Enable')(
              <Select placeholder='商品状态' style={{ width: 80 }} size='small'>
                <Option value=''>全部商品</Option>
                <Option value='1'>启用商品</Option>
                <Option value='2'>备用商品</Option>
                <Option value='0'>禁用商品</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('UpdateSku')(
              <Select placeholder='库存上传' style={{ width: 80 }} size='small'>
                <Option value=''>不限上传</Option>
                <Option value='1'>启用上传</Option>
                <Option value='0'>禁用上传</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('PriceS')(
              <Input size='small' type='number' placeholder='成本价起' style={{width: 80}} />
            )}
            -
            {getFieldDecorator('PriceT')(
              <Input size='small' type='number' placeholder='成本价讫' style={{width: 80}} />
            )}
          </FormItem>
          <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
      </div>
    )
  }
}))))
