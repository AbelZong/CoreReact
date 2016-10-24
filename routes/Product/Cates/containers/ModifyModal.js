import React from 'react'
import { Form, Input, Modal, Switch, Row, Col, Button } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import EE from 'utils/EE'
import {startLoading, endLoading} from 'utils'
const createForm = Form.create
import styles from './index.scss'
const FormItem = Form.Item
export default connect(state => ({
  doge: state.product_cat_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      doge: 0,
      title: '',
      confirm_id: 0,
      stand0: null,
      stand1: null,
      stand2: null,
      stand3: null
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge > 0) {
        startLoading()
        return ZGet({
          uri: 'XyComm/Brand/BrandEdit',
          data: {
            id: nextProps.doge
          },
          success: ({d}) => {
            this.props.form.setFieldsValue({
              id: d.ID,
              Name: d.Name,
              Enable: d.Enable,
              Intro: d.Intro,
              Link: d.Link
            })
            this.setState({
              title: `修改 ID: ${d.ID}`,
              visible: true,
              confirmLoading: false,
              doge: d.ID
            })
          },
          error: () => {
            this.props.dispatch({type: 'PRODUCT_CAT_VIS_SET', payload: 0})
          }
        }).then(endLoading)
      }
      switch (nextProps.doge) {
        case 0: {
          return this.setState({ visible: false, confirmLoading: false, doge: 0, stand0: null, stand2: null, stand1: null, stand3: null })
        }
        case -1: {
          startLoading()
          return ZGet({
            uri: 'XyComm/ItemCateStd/ItemStdKindLst', //获取标准基础菜单
            data: {
              ParentID: 0
            },
            success: ({d}) => {
              this.setState({
                visible: true,
                title: '请选择商品分类',
                confirmLoading: false,
                doge: nextProps.doge,
                stand0: d, stand1: null, stand2: null, stand3: null, stand0_select: null, stand1_select: null, stand2_select: null, stand3_select: null, confirm_id: 0
              })
            }
          }).then(endLoading)
        }
        case -2: {
          return this.setState({
            visible: true,
            title: '请选择商品分类',
            confirmLoading: false,
            doge: nextProps.doge
          })
        }
      }
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      this.setState({
        confirmLoading: true
      })
      const {doge} = this.props
      const data = values
      let uri = ''
      if (doge === 0) {
        uri = 'XyComm/Brand/InsertBrand'
      } else {
        uri = 'XyComm/Brand/UpdateBrand'
        data.id = doge
      }
      ZPost(uri, data, () => {
        this.hideModal()
        EE.triggerRefreshMain()
      }, () => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  hideModal() {
    this.props.dispatch({ type: 'PRODUCT_CAT_VIS_SET', payload: 0 })
    this.props.form.resetFields()
  },
  handleSwitch(x, index) {
    if (x.is_tb_parent) {
      startLoading()
      return ZGet({
        uri: 'XyComm/ItemCateStd/ItemStdKindLst',
        data: {
          ParentID: x.id
        },
        success: ({d}) => {
          const _states = {
            [`stand${index}_select`]: x.id,
            [`stand${index + 1}`]: d,
            confirm_id: 0
          }
          if (index + 2 <= 3) {
            for (let i = index + 2; i <= 3; i++) {
              _states[`stand${i}`] = null
              _states[`stand${i}_select`] = 0
            }
          }
          this.setState(_states)
        }
      }).then(endLoading)
    } else {
      const _states = {
        [`stand${index}_select`]: x.id,
        confirm_id: x.id
      }
      if (index + 1 <= 3) {
        for (let i = index + 1; i <= 3; i++) {
          _states[`stand${i}`] = null
          _states[`stand${i}_select`] = 0
        }
      }
      this.setState(_states)
    }
  },
  handleConfirm1() {
    //
  },
  rendFooter() {
    switch (this.state.doge) {
      case -1: {
        return (
          <div>
            <Button onClick={this.hideModal}>取消</Button>&emsp;
            <Button type='primary' onClick={this.handleConfirm1} disabled={this.state.confirm_id < 1}>确定</Button>
          </div>
        )
      }
      default: {
        return null
      }
    }
  },
  render() {
    //const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading, doge} = this.state
    const w = doge === -1 ? 880 : 680
    // const formItemLayout = {
    //   labelCol: { span: 4 },
    //   wrapperCol: { span: 20 }
    // }
    let _ren = null
    switch (true) {
      case doge > 0: {
        _ren = null
        break
      }
      case doge === -1: {
        const {stand0, stand0_select, stand1, stand1_select, stand2, stand2_select, stand3, stand3_select} = this.state
        _ren = (
          <Row className={styles.ss}>
            <Col span={6} className='h-scroller'>
              <ul>
                {stand0 && stand0.length ? stand0.map(x => <li key={x.id} className={x.id === stand0_select ? styles.se : null} onClick={() => this.handleSwitch(x, 0)}>{x.name}</li>) : null}
              </ul>
            </Col>
            <Col span={6} className='h-scroller'>
              <ul>
                {stand1 && stand1.length ? stand1.map(x => <li key={x.id} className={x.id === stand1_select ? styles.se : null} onClick={() => this.handleSwitch(x, 1)}>{x.name}</li>) : null}
              </ul>
            </Col>
            <Col span={6} className='h-scroller'>
              <ul>
                {stand2 && stand2.length ? stand2.map(x => <li key={x.id} className={x.id === stand2_select ? styles.se : null} onClick={() => this.handleSwitch(x, 2)}>{x.name}</li>) : null}
              </ul>
            </Col>
            <Col span={6} className='h-scroller'>
              <ul>
                {stand3 && stand3.length ? stand3.map(x => <li key={x.id} className={x.id === stand3_select ? styles.se : null} onClick={() => this.handleSwitch(x, 3)}>{x.name}</li>) : null}
              </ul>
            </Col>
          </Row>
        )
        break
      }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={w} maskClosable={false} closable={false} footer={this.rendFooter()}>
        {_ren}
      </Modal>
    )
  }
})))
// <Form horizontal className='pos-form'>
//   <FormItem {...formItemLayout} label='品牌名称'>
//     {getFieldDecorator('Name', {
//       rules: [
//         { required: true, whitespace: true, message: '必填' }
//       ]
//     })(
//       <Input type='text' />
//     )}
//   </FormItem>
//   <FormItem {...formItemLayout} label='简介'>
//     {getFieldDecorator('Intro')(
//       <Input type='textarea' />
//     )}
//   </FormItem>
//   <FormItem {...formItemLayout} label='官网地址'>
//     {getFieldDecorator('Link')(
//       <Input type='url' />
//     )}
//   </FormItem>
//   <FormItem {...formItemLayout} label='是否启用'>
//     {getFieldDecorator('Enable', {
//       valuePropName: 'checked',
//       initialValue: true
//     })(
//       <Switch />
//     )}
//   </FormItem>
// </Form>
