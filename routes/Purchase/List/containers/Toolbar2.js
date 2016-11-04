/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-14 11:10:43
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {Button, Form, Input} from 'antd'
const createForm = Form.create
const FormItem = Form.Item
import styles from './index.scss'

export default connect()(createForm()(React.createClass({
  handleSearch(e) {
    e.preventDefault()
    this.runSearching()
  },
  runSearching(x) {
    setTimeout(() => {
      this.props.form.validateFieldsAndScroll((errors, v) => {
        if (errors) {
          console.error('search Error: ', errors)
          return
        }
        this.props.dispatch({type: 'PUR_CONDITIONS2_UPDATE', update: {
          $merge: {
            Skuid: v.a1 || '',
            SkuName: v.a2 || '',
            GoodsCode: v.a3 || ''
          }
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
        <span className={styles.detailName}>采购明细</span>
        <div className='pull-right'>
          <FormItem>
            {getFieldDecorator('a1')(
              <Input size='small' placeholder='商品编码' style={{width: 110}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a2')(
              <Input size='small' placeholder='商品名称' style={{width: 110}} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('a3')(
              <Input size='small' placeholder='款式编码' style={{width: 110}} />
            )}
          </FormItem>
          <Button type='primary' size='small' onClick={this.handleSearch}>搜索明细</Button>
          <Button size='small' style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </div>
        <div className='clearfix' />
      </Form>
    )
  }
})))
