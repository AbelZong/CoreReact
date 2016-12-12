/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-01 08:43:34
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import {connect} from 'react-redux'
import {
  Form,
  Input,
  Button
} from 'antd'
import {
  startLoading,
  endLoading
} from 'utils/index'
const createForm = Form.create
const FormItem = Form.Item
export default connect()(createForm()(Wrapper(React.createClass({
  getInitialState: function() {
    return {
      s2_enabled: true,
      s4_enabled: true,
      confirmLoading: false
    }
  },
  componentDidMount() {
    this.refreshDataCallback()
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshDataCallback() {
    startLoading()
    this.setState({
      confirmLoading: true
    })
    ZGet('Wmspile/pileGetOrder', ({d}) => {
      this.props.form.setFieldsValue({
        s1: d
      })
    }).then(() => {
      endLoading()
    })
  },
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, v) => {
      if (errors) {
        return
      }
      startLoading()
      this.setState({
        confirmLoading: true
      })
      ZPost('Wmspile/pileOrder', {
        order: v.s1
      }).then(() => {
        endLoading()
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
  },
  checkNum(rule, value, callback) {
    if (!/^[a-zA-Z0-9,]+$/.test(value) && value !== undefined && value !== '') {
      callback('区域之间请以英文 , 隔开')
    } else {
      callback()
    }
  },
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.main}>
        <div style={{marginTop: '2em'}} />
        <Form horizontal className='pos-form'>
          <FormItem label='仓位找货优先级 （生成新的仓位后务必重新设定一下优先级）'>
            {getFieldDecorator('s1', {
              rules: [
                { required: true, whitespace: true, message: '必填' },
                { validator: this.checkNum }
              ]
            })(
              <Input type='textarea' className={styles.in} style={{height: '400px'}} />
            )}
          </FormItem>
          <Button type='primary' onClick={this.handleSubmit} style={{marginLeft: '550px'}} >
            确定
          </Button>
        </Form>
      </div>
    )
  }
}))))
