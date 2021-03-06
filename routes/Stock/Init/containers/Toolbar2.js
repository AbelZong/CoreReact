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
  Input
} from 'antd'
const createForm = Form.create
const FormItem = Form.Item
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
        this.props.dispatch({type: 'STOCK_INIT_ITEM_CONDITIONS_SET', payload: {
          SkuID: v.SkuID ? v.SkuID : '',
          SkuName: v.SkuName ? v.SkuName : ''
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
      <div className={styles.toolbars2}>
        <Form inline>
          <FormItem>
            {getFieldDecorator('SkuID')(
              <Input className={styles.searchInput} size='small' placeholder='商品编码' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('SkuName')(
              <Input className={styles.searchInput} size='small' placeholder='商品名称' />
            )}
          </FormItem>
          <Button type='primary' size='small' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
          <div className={styles.searchTip} >注意,期初库存为累加关系,每添加一次库存叠加一次</div>
        </Form>

      </div>
    )
  }
}))))
