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
import { Form, Input, Modal, Col, Row } from 'antd'
import {connect} from 'react-redux'
import {ZPost} from 'utils/Xfetch'
import styles from './index.scss'
const createForm = Form.create
const FormItem = Form.Item
const DEFAULT_TITLE = '创建新的仓位'

const NewPileModal = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.conditions !== nextProps.conditions) {
      if (nextProps.conditions.WarehouseID < 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else {
        this.setState({
          visible: true,
          title: DEFAULT_TITLE,
          confirmLoading: false,
          WarehouseID: nextProps.conditions.WarehouseID,
          WarehouseName: nextProps.conditions.WarehouseName,
          Type: nextProps.conditions.Type
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
      const data = {
        WarehouseID: this.state.WarehouseID,
        WarehouseName: this.state.WarehouseName,
        Type: this.state.Type,
        area: vs.Area,
        row: [vs.RowMin, vs.RowMax],
        col: [vs.ColMin, vs.ColMax],
        storey: (vs.StoreyMin !== undefined && vs.StoreyMax !== undefined) ? [vs.StoreyMin, vs.StoreyMax] : null,
        cell: (vs.CellMin !== undefined && vs.CellMax !== undefined) ? [vs.CellMin, vs.CellMax] : null
      }
      ZPost('Wmspile/InsertPile', data, () => {
        this.hideModal()
        this.props.dispatch({type: 'WARE_PILE_VIS_SET', payload: {
          WarehouseID: this.state.WarehouseID,
          WarehouseName: this.state.WarehouseName,
          Type: this.state.Type
        }})
      }, () => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },

  hideModal() {
    this.props.dispatch({ type: 'WARE_PILE_NEW_VIS_SET', payload: {WarehouseID: -1} })
    this.props.form.resetFields()
  },
  checkNum(rule, value, callback) {
    if (!/^[A-Za-z]$|^[0-9]{1,3}$/.test(value) && value !== undefined && value !== '') {
      callback('格式错误')
    } else {
      callback()
    }
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={680} maskClosable={false}>
        <div className={`${styles.topOperators} ${styles.tip}`}>
          区域一个字符,行列层格均为中划线分隔的起止符,支持纯数字与单字母,层格可不填
        </div>
        <Form horizontal className='pos-form'>
          <Row className={styles.row}>
            <Col span='10'>
              <FormItem {...formItemLayout} label='区域'>
                {getFieldDecorator('Area', {
                  rules: [
                    { required: true, message: '必填' },
                    { validator: this.checkNum }
                  ]
                })(
                  <Input placeholder='' style={{width: '100px'}} />
                )}
              </FormItem>
            </Col>
            <Col span='14'>
              <div className={styles.tip2}>单字母或3位内正整数（库房面积少于500平米建议只分一个区）</div>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col span='6'>
              <FormItem {...formItemLayout} label='行'>
                {getFieldDecorator('RowMin', {
                  rules: [
                    { required: true, message: '必填' },
                    { validator: this.checkNum }
                  ]
                })(
                  <Input placeholder='最小值' style={{width: '100px'}} />
                )}
              </FormItem>
            </Col>
            <Col span='4'>
              <FormItem {...formItemLayout} label=''>
                {getFieldDecorator('RowMax', {
                  rules: [
                    { required: true, message: '必填' },
                    { validator: this.checkNum }
                  ]
                })(
                  <Input placeholder='最大值' />
                )}
              </FormItem>
            </Col>
            <Col span='8'>
              <div className={styles.tip2}>单字母或3位内正整数</div>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col span='6'>
              <FormItem {...formItemLayout} label='列'>
                {getFieldDecorator('ColMin', {
                  rules: [
                    { required: true, message: '必填' },
                    { validator: this.checkNum }
                  ]
                })(
                  <Input placeholder='最小值' style={{width: '100px'}} />
                )}
              </FormItem>
            </Col>
            <Col span='4'>
              <FormItem {...formItemLayout} label=''>
                {getFieldDecorator('ColMax', {
                  rules: [
                    { required: true, message: '必填' },
                    { validator: this.checkNum }
                  ]
                })(
                  <Input placeholder='最大值' />
                )}
              </FormItem>
            </Col>
            <Col span='8'>
              <div className={styles.tip2}>单字母或3位内正整数</div>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col span='6'>
              <FormItem {...formItemLayout} label='层'>
                {getFieldDecorator('StoreyMin', {
                  rules: [
                    { validator: this.checkNum }
                  ]
                })(
                  <Input placeholder='最小值' style={{width: '100px'}} />
                )}
              </FormItem>
            </Col>
            <Col span='4'>
              <FormItem {...formItemLayout} label=''>
                {getFieldDecorator('StoreyMax', {
                  rules: [
                    { validator: this.checkNum }
                  ]
                })(
                  <Input placeholder='最大值' />
                )}
              </FormItem>
            </Col>
            <Col span='8'>
              <div className={styles.tip2}>可选, 单字母或3位内正整数</div>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col span='6'>
              <FormItem {...formItemLayout} label='格'>
                {getFieldDecorator('CellMin', {
                  rules: [
                    { validator: this.checkNum }
                  ]
                })(
                  <Input placeholder='最小值' style={{width: '100px'}} />
                )}
              </FormItem>
            </Col>
            <Col span='4'>
              <FormItem {...formItemLayout} label=''>
                {getFieldDecorator('CellMax', {
                  rules: [
                    { validator: this.checkNum }
                  ]
                })(
                  <Input placeholder='最大值' />
                )}
              </FormItem>
            </Col>
            <Col span='8'>
              <div className={styles.tip2}>可选, 单字母或3位内正整数</div>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
})
export default connect(state => ({
  conditions: state.ware_pile_new_vis
}))(createForm()(NewPileModal))
