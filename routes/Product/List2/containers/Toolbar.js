/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-10 AM
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
import ItemCatPicker from 'components/ItemCatPicker'
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
        v.KindID = (v.KindID && v.KindID.id) ? v.KindID.id : ''
        this.props.dispatch({type: 'PRODUCT_LIST2_CONDITIONS_SET', payload: v})
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
    this.runSearching()
  },
  handleCreateNew1() {
    this.props.dispatch({type: 'PRODUCT_LIST2_MODIFY_VIS_SET', payload: -1})
  },
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.toolbars}>
        <Form inline>
          <FormItem>
            {getFieldDecorator('GoodsCode')(
              <Input size='small' placeholder='货号' style={{width: 100}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('SkuID')(
              <Input size='small' placeholder='商品编号' style={{width: 100}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('ScoGoodsCode')(
              <Input size='small' placeholder='供应商货号' style={{width: 100}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('KindID')(
              <ItemCatPicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('Enable')(
              <Select placeholder='商品状态' style={{ width: 100 }} size='small'>
                <Option value=''>全部商品</Option>
                <Option value='1'>启用(上架中)</Option>
                <Option value='2'>备用商品</Option>
                <Option value='0'>禁用商品</Option>
              </Select>
            )}
          </FormItem>
          <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
      </div>
    )
  }
}))))
