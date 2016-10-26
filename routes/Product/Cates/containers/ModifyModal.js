//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//
import React from 'react'
import { Form, Input, Modal, Radio, Row, Col, Button, InputNumber, Switch, Checkbox, Popconfirm } from 'antd'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import EE from 'utils/EE'
import {startLoading, endLoading} from 'utils'
const createForm = Form.create
import styles from './index.scss'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const ButtonGroup = Button.Group
import ZGrid from 'components/Grid/index'
export default connect(state => ({
  doge: state.product_cat_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return DEF_STATES
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge > 0) {
        this.setState(Object.assign({}, DEF_STATES, {
          title: `修改 ID: ${nextProps.doge}`,
          visible: true,
          confirmLoading: false,
          doge: nextProps.doge
        }))
        // startLoading()
        // return ZGet({
        //   uri: 'XyComm/Brand/BrandEdit',
        //   data: {
        //     id: nextProps.doge
        //   },
        //   success: ({d}) => {
        //     this.props.form.setFieldsValue({
        //       id: d.ID,
        //       Name: d.Name,
        //       Enable: d.Enable,
        //       Intro: d.Intro,
        //       Link: d.Link
        //     })
        //     this.setState(Object.assign({}, DEF_STATES, {
        //       title: `修改 ID: ${d.ID}`,
        //       visible: true,
        //       confirmLoading: false,
        //       doge: d.ID
        //     }))
        //   },
        //   error: () => {
        //     this.props.dispatch({type: 'PRODUCT_CAT_VIS_SET', payload: 0})
        //   }
        // }).then(endLoading)
      }
      switch (nextProps.doge) {
        case 0: {
          return this.setState(Object.assign({}, DEF_STATES, { visible: false, confirmLoading: false, doge: 0 }))
        }
        case -1: {
          startLoading()
          return ZGet({
            uri: 'XyComm/ItemCateStd/ItemStdKindLst', //获取标准基础菜单
            data: {
              ParentID: 0
            },
            success: ({d}) => {
              this.setState(Object.assign({}, DEF_STATES, {
                visible: true,
                title: '请选择商品分类',
                confirmLoading: false,
                doge: nextProps.doge,
                stand0: d
              }))
            }
          }).then(endLoading)
        }
        case -2: {
          return this.setState(Object.assign({}, DEF_STATES, {
            visible: true,
            title: '请选择商品分类',
            confirmLoading: false,
            doge: nextProps.doge
          }))
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
    if (x.is_parent) {
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
    this.setState({
      confirmLoading: true
    })
    this.props.modalCB1(this.state.confirm_id, () => {
      this.hideModal()
    }, () => {
      this.setState({
        confirmLoading: false
      })
    })
  },
  handleConfirm2() {
    this.props.form.validateFields((errors, values) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      console.log(values)
    })
  },
  handleConfirm3() {
    //
  },
  rendFooter() {
    switch (this.state.doge) {
      case -1: {
        return (
          <div>
            <Button onClick={this.hideModal}>取消</Button>&emsp;
            <Button type='primary' onClick={this.handleConfirm1} loading={this.state.confirmLoading} disabled={this.state.confirm_id < 1}>确定</Button>
          </div>
        )
      }
      case -2: {
        return (
          <div>
            <Button onClick={this.hideModal}>取消</Button>&emsp;
            <Button type='primary' onClick={this.handleConfirm2}>保存</Button>
          </div>
        )
      }
      default: {
        return null
      }
    }
  },
  render() {
    const {visible, title, doge} = this.state
    const w = doge === -1 || doge > 0 ? 880 : 680
    let _ren = null
    switch (true) {
      case doge > 0: {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
          labelCol: { span: 3 },
          wrapperCol: { span: 18 }
        }
        _ren = (
          <div className={styles.smForm}>
            <Form horizontal className='pos-form'>
              <FormItem {...formItemLayout} label='分类名'>
                <Col span={8}>
                  {getFieldDecorator('s1', {
                    rules: [
                      { required: true, whitespace: true, message: '必填' }
                    ]
                  })(
                    <Input type='text' size='small' />
                  )}
                </Col>
                <Col span={10} className={styles.fucker}>
                  <FormItem {...{
                    labelCol: { span: 8 },
                    wrapperCol: { span: 16 }
                  }} label='父分类'>
                    {getFieldDecorator('Link')(
                      <Input type='text' disabled size='small' />
                    )}
                  </FormItem>
                </Col>
              </FormItem>
              <FormItem {...formItemLayout} label='排序'>
                <Col span={8}>
                  {getFieldDecorator('s2', {
                    initialValue: 0
                  })(
                    <InputNumber min={1} size='small' />
                  )}
                </Col>
                <Col span={10} className={styles.fucker}>
                  <FormItem {...{
                    labelCol: { span: 8 },
                    wrapperCol: { span: 16 }
                  }} label='状态'>
                    {getFieldDecorator('Enable', {
                      valuePropName: 'checked',
                      initialValue: true
                    })(
                      <Switch size='small' />
                    )}
                  </FormItem>
                </Col>
              </FormItem>
              <FormItem wrapperCol={{ span: 18, offset: 3 }}>
                <Button type='primary' htmlType='submit' size='small'>保存</Button>
              </FormItem>
            </Form>
            <div className='hr' />
            <Props />
            <Props2 />
          </div>
        )
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
      case doge === -2: {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
          labelCol: { span: 3 },
          wrapperCol: { span: 18 }
        }
        const radioStyle = {
          display: 'block',
          height: '22px',
          lineHeight: '22px'
        }
        const addTag = (value) => {
          const old = this.props.form.getFieldValue('s4')
          const olds = old ? old.split(/,|，/) : []
          if (!olds.length || !olds.some(x => x === value)) {
            olds.push(value)
          }
          this.props.form.setFieldsValue({s4: olds.join(',')})
        }
        _ren = (
          <Form horizontal className='pos-form'>
            <FormItem {...formItemLayout} label='分类名'>
              {getFieldDecorator('s1', {
                rules: [
                  { required: true, whitespace: true, message: '必填' }
                ]
              })(
                <Input type='text' />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='排序'>
              {getFieldDecorator('s2', {
                initialValue: 0
              })(
                <InputNumber min={1} />
              )}
            </FormItem>
            <div className='hr' />
            <div className='mb10'>添加颜色规则分类信息</div>
            <FormItem {...formItemLayout} style={{marginBottom: 0}}>
              {getFieldDecorator('s3', {
                rules: [
                  { required: true, message: '必选' }
                ]
              })(
                <RadioGroup onChange={e => {
                  this.setState({
                    nihong: Number(e.target.value)
                  })
                }}>
                  <Radio style={radioStyle} key='1' value='1'>该分类商品不区分颜色规则，每款商品只有一个单品</Radio>
                  <Radio style={radioStyle} key='2' value='2'>该分类商品区分颜色规则，每款商品有多个单品，需要根据颜色规则属性来区分不同单品</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <div style={{display: this.state.nihong === 2 ? 'block' : 'none'}}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('s4', {
                  rules: [
                    { required: true, whitespace: true, message: '必填' }
                  ]
                })(
                  <Input type='text' placeholder='请输入颜色规则分类项目，用逗号分隔' />
                )}
              </FormItem>
              <div>
                历史分类：<ButtonGroup><Button size='small' type='ghost' onClick={() => addTag('尺码')}>尺码</Button><Button size='small' type='ghost' onClick={() => addTag('颜色')}>颜色</Button></ButtonGroup>
              </div>
            </div>
          </Form>
        )
        break
      }
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} width={w} maskClosable={false} footer={this.rendFooter()}>
        {_ren}
      </Modal>
    )
  }
})))
const PropsAbledRender = React.createClass({
  handleClick(e) {
    e.stopPropagation()
    const checked = e.target.checked
    this.props.api.gridOptionsWrapper.gridOptions.grid.grid.x0pCall(ZPost('XyComm/Brand/BrandEnable', {
      IDLst: [this.props.data.ID],
      Enable: checked
    }, () => {
      this.props.data.Enable = checked
      this.props.refreshCell()
    }))
  },
  render() {
    return <Checkbox onChange={this.handleClick} checked={this.props.data.Enable} />
  }
})
const Props = connect()(React.createClass({
  handleNew() {
    this.props.dispatch({type: 'PRODUCT_CAT_PROP_VIS_SET', payload: 0})
  },
  render() {
    return (
      <div className='flex-column'>
        <div className={styles.propsSearch}>
          <div className='pull-right'>
            属性检索：<Checkbox.Group options={[
                { label: '启用', value: '1' },
                    { label: '禁用', value: '2' }
            ]} defaultValue={['1', '2']} onChange={(e) => {
              console.log(e)
            }} />
          </div>
          <Button type='ghost' size='small' icon='plus' onClick={this.handleNew}>添加新属性</Button>
          <div className='clearfix' />
        </div>
        <ZGrid className={styles.zgrid} onReady={this.handleGridReady} gridOptions={{}} storeConfig={{ prefix: 'product_cats_prop' }} columnDefs={[
          {
            headerName: '#',
            width: 30,
            checkboxSelection: true,
            cellStyle: {textAlign: 'center'},
            pinned: 'left',
            suppressSorting: true,
            enableSorting: true
          }, {
            headerName: '属性号',
            field: 'ID',
            cellStyle: {textAlign: 'center'},
            width: 100,
            suppressMenu: true
          }, {
            headerName: '名称',
            field: 'KindName',
            width: 144,
            suppressMenu: true
          }, {
            headerName: '排序',
            field: 'Order',
            width: 70,
            suppressMenu: true
          }, {
            headerName: '状态',
            field: 'Enable',
            width: 70,
            cellStyle: {textAlign: 'center'},
            cellRendererFramework: PropsAbledRender,
            suppressMenu: true
          }, {
            headerName: '可输入',
            field: 'Order',
            width: 70,
            suppressMenu: true,
            cellStyle: {textAlign: 'center'},
            cellRenderer: function(params) {
              return params.data.allow ? 'O' : 'X'
            }
          }, {
            headerName: '可选属性值',
            field: 'Order',
            width: 360,
            suppressMenu: true
          }]}columnsFited grid={this} paged height={360}>
          批量：
          <ButtonGroup>
            <Popconfirm title='确定要启用吗？' onConfirm={this.handleEnable}>
              <Button type='primary' size='small'>启用</Button>
            </Popconfirm>
            <Popconfirm title='确定要禁用吗？' onConfirm={this.handleDisable}>
              <Button type='ghost' size='small'>禁用</Button>
            </Popconfirm>
          </ButtonGroup>
        </ZGrid>
      </div>
    )
  }
}))
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
const Props2 = connect(state => ({
  doge: state.product_cat_prop_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: '新建类目的商品属性'
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else if (nextProps.doge === 0) {
        this.setState({
          visible: true,
          title: '新建类目的商品属性',
          confirmLoading: false
        })
      } else {
        startLoading()
        ZGet({
          uri: 'Purchase/PurchaseSingle',
          data: {
            ID: nextProps.doge
          },
          success: ({d}) => {
            this.setState({
              title: `修改商品属性：[${d.id}]`,
              visible: true,
              confirmLoading: false
            })
          },
          error: () => {
            this.props.dispatch({type: 'PRODUCT_CAT_PROP_VIS_SET', payload: -1})
          }
        }).then(endLoading)
      }
    }
  },
  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return false
      }
      this.setState({
        confirmLoading: true
      })
      //
    })
  },
  hideModal() {
    this.props.dispatch({ type: 'PRODUCT_CAT_PROP_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible} = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    return (
      <Modal title={this.state.title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={this.state.confirmLoading}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='名称'>
            {getFieldDecorator('Name', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Input type='text' />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='排序'>
            {getFieldDecorator('s2', {
              initialValue: 0
            })(
              <InputNumber min={1} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='可输入'>
            {getFieldDecorator('Enable', {
              valuePropName: 'checked',
              initialValue: true
            })(
              <Switch />
            )}
            <span className='ml10 gray'>不可输入的话必须选择</span>
          </FormItem>
          <FormItem {...formItemLayout} label='可选属性值'>
            {getFieldDecorator('Enable')(
              <Input type='textarea' autosize={{minRows: 6, maxRows: 12}} placeholder='多个使用逗号分割，单个最长100字以内' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
const DEF_STATES = {
  visible: false,
  confirmLoading: false,
  doge: 0,
  title: '',
  confirm_id: 0,
  stand0: null,
  stand1: null,
  stand2: null,
  stand3: null,
  stand0_select: null,
  stand1_select: null,
  stand2_select: null,
  stand3_select: null,
  nihong: 0
}
