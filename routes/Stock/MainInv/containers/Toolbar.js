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
import {
  Button,
  Form,
  Select,
  Input,
  message
} from 'antd'
import {sTypes} from 'constants/StockInv'
const createForm = Form.create
const FormItem = Form.Item
const Option = Select.Option
import Wrapper from 'components/MainWrapper'
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
        let searchKey = {
          GoodsCode: v.a1 ? v.a1 : '',
          SkuID: v.a2 ? v.a2 : '',
          SkuName: v.a3 ? v.a3 : '',
          Norm: v.a4 ? v.a4 : ''
        }
        if (v.a5 !== undefined) {
          let minv = v.a6 ? v.a6 : 0
          let maxv = v.a7 ? v.a7 : 0
          if (minv > maxv) {
            message.error('最小值不能不大于最大值')
            return
          }
          searchKey = Object.assign({}, searchKey, {
            Type: v.a5 ? v.a5 : '',
            Min: v.a6 ? v.a6 : '',
            Max: v.a7 ? v.a7 : ''
          })
        }
        this.props.dispatch({type: 'STOCK_MAININV_CONDITIONS_SET', payload: searchKey})
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
    this.runSearching()
  },
  checkNum(rule, value, callback) {
    if (!/^(0|[1-9][0-9]*)$/.test(value) && value !== undefined && value !== '') {
      callback('请填写整数')
    } else {
      callback()
    }
  },
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.toolbars}>
        <Form inline>
          <FormItem>
            {getFieldDecorator('a1')(
              <Input placeholder='款式编码' size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a2')(
              <Input placeholder='商品编码' size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a3')(
              <Input placeholder='商品名称' size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a4')(
              <Input placeholder='颜色规格' size='small' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a5')(
              <Select placeholder='检索内容及范围' style={{ width: 130 }} size='small'>
                {Object.keys(sTypes).map(k => <Option key={k} value={k}>{sTypes[k]}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a6', {
              rules: [{ validator: this.checkNum }]
            })(
              <Input size='small' placeholder='最小值' style={{ width: 60 }} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a7', {
              rules: [{ validator: this.checkNum }]
            })(
              <Input size='small' placeholder='最大值' style={{ width: 60 }} />
            )}
          </FormItem>
          <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
      </div>
    )
  }
}))))
