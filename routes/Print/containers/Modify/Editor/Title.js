import React from 'react'
import { Form, Input, Button } from 'antd'

@Form.create()
export default class Title extends React.Component {
  submit(e) {
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      const wtf = !!errors
      if (wtf) {
        return
      }
      this.props.onSubmit(values)
    })
  }
  //componentWillReceiveProps(nextProps) {
   // console.log(nextProps)
  //}
  closeMe() {
    this.props.onCancel()
  }
  render() {
    const { getFieldProps } = this.props.form
    const titleProps = getFieldProps('title', { initialValue: this.props.titleValue, rules: [{ required: true, message: '标题必填' }] })
    //titleProps.value = this.props.titleValue; //fix bug
    return (
      <Form horizontal onSubmit={this.submit.bind(this)}>
        <Form.Item label='标题' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          <Input type='text' placeholder='Please enter...' {...titleProps} />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 7 }}>
          <Button type='ghost' onClick={this.closeMe.bind(this)}>取消</Button>
          &emsp
          <Button type='primary' htmlType='submit'>确定</Button>
        </Form.Item>
      </Form>
    )
  }
}
