/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-12 10:16:04
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import { Form, Select, Modal, Radio, message } from 'antd'
import {connect} from 'react-redux'
import {ZPost, ZGet} from 'utils/Xfetch'
import styles from './index.scss'
import EE from 'utils/EE'

const createForm = Form.create
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const DEFAULT_TITLE = '安排拣货任务'

const SetPickor = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE,
      defaultRadio: 0,
      dataList: [],
      roles: [],
      error: function() { return '' }
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.setCondition !== nextProps.setCondition) {
      if (nextProps.setCondition.ids.length === 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else {
        ZGet('Batch/GetPickorInit', null, ({d}) => {
          this.setState({
            visible: true,
            confirmLoading: false,
            roles: d.Role,
            dataList: d.Pickor,
            isRe: nextProps.setCondition.re,
            ids: nextProps.setCondition.ids
          })
        })
      }
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, vs) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      if (vs.Pickor.length === 0) {
        message.info('至少选择一位拣货员')
      } else {
        const uri = this.state.isRe ? 'Batch/ReSetPickor' : 'Batch/SetPickor'
        ZPost(uri, {
          ID: this.state.ids,
          Pickor: vs.Pickor
        }, ({d}) => {
          if (d.FailIDs.length) {
            let error = d.FailIDs.map((e, index) => <p key={index}>批次号: &nbsp;&nbsp;{e.ID}&nbsp;&nbsp;{e.Reason}</p>)
            this.setState({
              error: error
            })
          } else {
            this.hideModal()
          }
          EE.triggerRefreshMain()
        })
      }
    })
  },
  handleChange(e) {
    const flag = e.target.value === undefined ? this.state.exDefault : e.target.value
    this.setState({
      exDefault: !flag
    })
  },
  onRadioChange(e) {
    ZGet('Batch/GetPickorByRole', {RoleID: e.target.value}, ({d}) => {
      this.setState({
        dataList: d,
        defaultRadio: e.target.value
      })
    })
  },
  hideModal() {
    this.props.dispatch({ type: 'PB_PICKOR_SET_VIS_SET', payload: {ids: []} })
    this.props.form.resetFields()
    this.setState({
      error: ''
    })
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const {visible, title, confirmLoading, dataList} = this.state
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={680} maskClosable>
        <div className={styles.part_left}>
          <RadioGroup onChange={this.onRadioChange} value={this.state.defaultRadio}>
            <Radio key={0} value={0}>所有角色</Radio>
            {this.state.roles.map(x => <Radio key={x.value} value={x.value}>{x.label}</Radio>)}
          </RadioGroup>
        </div>
        <Form horizontal className={`${styles.part_right} pos-form`}>
          <FormItem {...formItemLayout} label=''>
            {getFieldDecorator('Pickor')(
              <Select multiple placeholder='选择操作人，选择多个操作人将平均分配任务' disabled={this.state.exDefault}>
                {dataList.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
              </Select>
            )}
          </FormItem>
        </Form>
        <div style={{color: 'red'}}>{this.state.error}</div>
      </Modal>
    )
  }
})
export default connect(state => ({
  setCondition: state.pb_pickor_set_vis
}))(createForm()(SetPickor))
