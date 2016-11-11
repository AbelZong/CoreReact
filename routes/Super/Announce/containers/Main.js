/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-10 PM
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
import {
  Form,
  Input,
  Col,
  Button
} from 'antd'
import {
  startLoading,
  endLoading
} from 'utils/index'
import WheatEditor from 'components/Editor'
const createForm = Form.create
const FormItem = Form.Item
export default createForm()(Wrapper(React.createClass({
  getInitialState: function() {
    return {
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
    ZGet('XyUser/Notice/NoticeGet', ({d}) => {
      this.props.form.setFieldsValue(d)
    }).then(() => {
      endLoading()
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      startLoading()
      this.setState({
        confirmLoading: true
      })
      ZPost('XyUser/Notice/InsertNotice', values).then(() => {
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
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.main}>
        <div style={{marginTop: '2em'}} />
        <Form vertical className='pos-form'>
          <FormItem label='公告简述'>
            {getFieldDecorator('Title', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Input type='textarea' />
            )}
          </FormItem>
          <FormItem label='公告详情'>
            {getFieldDecorator('Content', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <WheatEditor />
            )}
          </FormItem>
          <div style={{marginBottom: '1em'}} className='clearfix' />
          <FormItem>
            <Col span='7' offset='6'>
              <Button type='primary' onClick={this.handleSubmit} loading={this.state.confirmLoading}>保存发布</Button>
            </Col>
          </FormItem>
        </Form>
      </div>
    )
  }
})))
