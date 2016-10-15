import React from 'react'
import { Form, Input, Modal, Row, Col, DatePicker, Switch } from 'antd'
import {connect} from 'react-redux'
import {ZPost} from 'utils/Xfetch'
import {startLoading, endLoading} from 'utils'
import EE from 'utils/EE'
const createForm = Form.create
const FormItem = Form.Item
import ModifyMenusTree from './ModifyMenusTree'
import Token from './Token'

const DEFAULT_TITLE = '创建店铺'
import moment from 'moment'
const shopmodify = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE,
      disable: false,
      apienable: true
    }
  },
  componentDidMount() {
    // ZGet('common/shopsite', (s, d, m) => {
    //   if (!this.ignore) {
    //     this.props.dispatch({type: 'SHOP_SITE_SET', payload: d})
    //   }
    // })
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.code !== nextProps.code) {
      this.props.form.setFieldsValue({
        token: nextProps.code
      })
    }
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false,
          disable: false
        })
      } else if (nextProps.doge === 0) {
        this.setState({
          visible: true,
          title: DEFAULT_TITLE,
          confirmLoading: false,
          disable: false
        })
        this.props.dispatch({type: 'SHOP_SITE_EDIT_DISABLE', payload: 0}) //所属站点赋值，编辑时为0，可操作select，>0 不可编辑
      } else {
        this.setState({
          disable: true
        })
        startLoading()
        ZPost({
          uri: 'Shop/ShopQuery',
          data: {
            ShopID: nextProps.doge
          },
          success: (s, d, m) => {
            if (d.Enable) {
              this.setState({apienable: false})
            } else {
              this.setState({apienable: true})
            }
            this.props.dispatch({type: 'SHOP_SITE_EDIT_DISABLE', payload: d.SitType})
            this.props.form.setFieldsValue({
              id: d.ID,
              coid: d.CoID,
              sittype: d.SitType,
              shopname: d.ShopName,
              shortname: d.ShortName,
              shopbegin: moment(d.ShopBegin, 'YYYY-MM-DD'),
              shopkeeper: d.Shopkeeper,
              sendaddress: d.SendAddress,
              shopurl: d.ShopUrl,
              telphone: d.TelPhone,
              idcard: d.IDcard,
              contactname: d.ContactName,
              returnaddress: d.ReturnAddress,
              returnmobile: d.ReturnMobile,
              returnphone: d.ReturnPhone,
              postcode: d.Postcode,
              enable: d.Enable,
              updatesku: d.UpdateSku,
              downgoods: d.DownGoods,
              updatewaybill: d.UpdateWayBill
            })
            this.setState({
              title: `修改 [${d.ID}]: ${d.ShopName}`,
              visible: true,
              confirmLoading: false
            })
          },
          error: () => {
            this.props.dispatch({type: 'SHOP_MODIFY_VISIABLE', payload: -1})
          }
        }).then(endLoading)
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
        uri = 'shop/createshop'
      } else {
        uri = 'shop/modifyshop'
        data.id = doge
      }
      ZPost(uri, data, (s, d, m) => {
        this.hideModal()
        EE.triggerRefreshMain()
      }, () => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  enableChange(checked) {
    if (checked) {
      this.setState({
        apienable: false
      })
    } else {
      this.setState({
        apienable: true
      })
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'SHOP_MODIFY_VISIABLE', payload: -1 })
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading, apienable} = this.state

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const apienableLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 6 }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={780}>
        <Form horizontal className='pos-form'>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='所属站点'>
                {getFieldDecorator('sittype')(
                  <ModifyMenusTree />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='店铺名称' >
                {getFieldDecorator('shopname', {
                  rules: [
                    { required: true, message: '名称必填' }
                  ]
                })(
                  <Input type='text' placeholder='店铺名称不允许重复' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='店铺简称' >
                {getFieldDecorator('shortname', {})(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem
                label='创店时间'
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                {getFieldDecorator('shopbegin', {})(
                  <DatePicker />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='掌柜昵称' >
                {getFieldDecorator('shopkeeper', {
                  rules: [
                    { required: true, message: '昵称不能为空' }
                  ]
                })(
                  <Input type='text' placeholder='必须是主账号，子账号权限不足' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='发货地址' >
                {getFieldDecorator('sendaddress', {})(
                  <Input type='text' placeholder='' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem
                label='店铺网址'
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Input addonBefore='Http://' defaultValue='mysite.com' id='shopurl' />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem label='联系电话' {...formItemLayout}>
                {getFieldDecorator('telphone', {})(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label='身份证号' {...formItemLayout}>
                {getFieldDecorator('idcard')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='退货联系人'>
                {getFieldDecorator('contactname', {})(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='退货地址'>
                {getFieldDecorator('returnaddress')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='退货手机'>
                {getFieldDecorator('returnmobile', {})(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='退货固话'>
                {getFieldDecorator('returnphone')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='退货邮编'>
                {getFieldDecorator('postcode')(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='授权码'>
                {getFieldDecorator('token')(
                  <Input type='text' disabled />
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem {...formItemLayout}>
                <Token />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} label='是否启用' >
                {getFieldDecorator('enable', {
                  valuePropName: 'checked'
                })(
                  <Switch onChange={this.enableChange} />
                )}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem {...formItemLayout} >
                <span style={{color: 'red'}}>以下三项需启用及授权后方可生效</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={8}>
              <FormItem {...apienableLayout} label='上传库存' >
                {getFieldDecorator('updatesku', {
                  valuePropName: 'checked'
                })(
                  <Switch disabled={apienable} />
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...apienableLayout} label='下载商品' >
                {getFieldDecorator('downgoods', {
                  valuePropName: 'checked'})(
                  <Switch disabled={apienable} />
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem {...apienableLayout} label='下载快递单' >
                {getFieldDecorator('updatewaybill', {
                  valuePropName: 'checked'
                })(
                  <Switch disabled={apienable} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormItem {...formItemLayout} >
                {getFieldDecorator('coid')(
                  <Input type='text' style={{ visibility: 'hidden' }} />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
})

export default connect(state => ({
  doge: state.shop_modify_visiable,
  code: state.shop_token_code
}))(createForm()(shopmodify))
