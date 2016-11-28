/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959.com>
* Date  : 2016-11-24 PM
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
import {Button, Form, Select, DatePicker, Input} from 'antd'
import SkuPicker from 'components/SkuPicker'
import WareHousePicker from 'components/WareHousePicker'
const RangePicker = DatePicker.RangePicker
const createForm = Form.create
const FormItem = Form.Item
import Wrapper from 'components/MainWrapper'
import {sTypes} from 'constants/Stock'
export default connect()(createForm()(Wrapper(React.createClass({
  componentDidMount() {
    //this.refreshDataCallback()
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
        this.props.dispatch({type: 'STOCK_INIT_CONDITIONS_SET', payload: {Skuautoid: v.a4.id}})
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
          <FormItem>
            {getFieldDecorator('a7')(
              <WareHousePicker size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a2')(
              <RangePicker size='small' showTime format='YYYY-MM-DD HH:mm:ss' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('s6')(
              <Select placeholder='盘点状态' style={{ width: 80 }} size='small'>
                <Option value=''>全部状态</Option>
                {Object.keys(sTypes).map(k => <Option key={k} value={k}>{sTypes[k]}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a4')(
              <SkuPicker size='small' />
            )}
          </FormItem>
          <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
      </div>
    )
  }
}))))
