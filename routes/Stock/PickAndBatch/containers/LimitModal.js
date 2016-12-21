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
import {Form, Input, InputNumber, Modal, Radio, Popconfirm, Row, Col, Select, Button, Checkbox, Popover, DatePicker} from 'antd'
import {connect} from 'react-redux'
import {ZPost, ZGet} from 'utils/Xfetch'
import EE from 'utils/EE'
import styles from './index.scss'
import {startLoading, endLoading} from 'utils'
import classNames from 'classnames'

const RangePicker = DatePicker.RangePicker
const RadioGroup = Radio.Group
const Option = Select.Option
const createForm = Form.create
const FormItem = Form.Item
const DEFAULT_TITLE = '限定条件'

const LimitModal = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else if (nextProps.doge === 1) {
        this.setState({
          visible: true,
          title: DEFAULT_TITLE + '（单件）',
          confirmLoading: false
        })
      } else if (nextProps.doge === 2) {
        this.setState({
          visible: true,
          title: DEFAULT_TITLE + '（多件）',
          confirmLoading: false
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
      ZPost('XyCore/Inventory/UptInvMainLstVirtualQty', vs, () => {
        this.hideModal()
        EE.triggerRefreshMain()
      }, () => {
        this.setState({
          confirmLoading: false
        })
      })
    })
  },
  onRadioChange() {

  },
  hideModal() {
    this.props.dispatch({ type: 'PB_LIMIT_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  render() {
    const {visible, title, confirmLoading} = this.state
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={680} maskClosable={false}>
        <div className={styles.topOperators}>
          <Left />
        </div>
        <Limit />
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.pb_limit_vis
}))(createForm()(LimitModal))

const Left = connect(
  state => ({
    on_id: state.pb_limit_policy_vis
  })
)(React.createClass({
  getInitialState: function() {
    return {
      ploys: [],
      on_id: 0
    }
  },
  componentDidMount() {
    if (this.state.on_id >= 0) {
      this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: -1})
    }
    this.refreshDataCallback()
  },
  refreshDataCallback() {
    startLoading()
    ZGet('Warehouse/WarePloyList', ({d}) => {
      this.setState({
        ploys: d
      })
    }).then(endLoading)
  },
  handleModify(id) {
    if (this.props.on_id !== -1 && this.props.on_id !== null) {
      if (this.props.on_id !== id) {
        Modal.confirm({
          title: '当前有编辑策略，是否确定离开?',
          content: '【确定】离开后不会自动保存',
          onOk: () => {
            this.props.dispatch({type: 'PB_LIMIT_POLICY_VIS_SET', payload: id})
          }
        })
      }
    } else {
      this.props.dispatch({type: 'PB_LIMIT_POLICY_VIS_SET', payload: id})
    }
  },
  handleRemove(id) {
    startLoading()
    // ZPost('Warehouse/wareSettingGet', {id}, () => {
    //   this.refreshDataCallback()
    //   if (this.props.on_id !== -1) {
    //     this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: -1})
    //   }
    // }).then(() => {
    //   endLoading()
    // })
  },
  handleAdd() {
    if (this.props.on_id !== -1) {
      if (this.props.on_id !== 0) {
        Modal.confirm({
          title: '当前有编辑策略，是否确定离开?',
          content: '【确定】离开后不会自动保存',
          onOk: () => {
            this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: 0})
          }
        })
      }
    } else {
      this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: 0})
    }
  },
  render() {
    const {ploys} = this.state
    const {on_id} = this.props
    return (
      <div className={`${styles.left} h-scroller`}>
        <ul className={styles.lst}>
          {ploys.map(x => <li key={x.id} className={on_id === x.id ? styles.active : ''}>
            <div className='clearfix'><span onClick={() => this.handleModify(x.id)}>{x.name}&emsp;<a>修改</a></span>
              <Popconfirm title='确认删除？无法恢复' onConfirm={this.handleRemove}>
                <a className='pull-right'>删除</a>
              </Popconfirm>
            </div>
          </li>)}
        </ul>
      </div>
    )
  }
}))

const Limit = connect(state => ({
  id: state.pb_limit_policy_vis
}))(createForm()(React.createClass({
  getInitialState: function() {
    return {
      s2_enabled: true,
      s4_enabled: true,
      confirmLoading: false,
      title: '',
      provinces: [],
      shops: [],
      distributors: [],
      SkuKinds: [],
      shopDefault: true
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({
        confirmLoading: false
      })
      if (nextProps.id > 0) {
        startLoading()
        this.setState({
          confirmLoading: true
        })
        ZGet('XyComm/Customkind/SkuKindLst', {ParentID: 0}, ({d}) => {
          this.setState({
            SkuKinds: d.Children
          })
        })

        ZGet('Warehouse/editploy', {id: nextProps.id}, ({d}) => {
          const {ploy, province, shop, distributor} = d
          this.setState({
            provinces: province,
            shops: shop,
            distributors: distributor
          })
          ploy.Payment = ploy.Payment + ''
          ploy.WareHouse = ploy.Wid >= 0 ? {
            id: ploy.Wid,
            name: ploy.Wname
          } : null
          this.props.form.setFieldsValue(ploy)
        }).then(() => {
          endLoading()
          this.setState({
            confirmLoading: false
          })
        })
      } else if (nextProps.id === 0) {
        this.props.form.resetFields()
        startLoading()
        ZGet('Warehouse/getPloySetting', ({d}) => {
          const {province, shop} = d
          this.setState({
            provinces: province,
            shops: shop,
            confirmLoading: false
          })
        }).then(endLoading)
      }
    }
  },
  componentWillUnmount() {
    this.ignore = true
  },
  handleSwitch3(e) {
    this.setState({
      s2_enabled: e
    })
  },
  handleSwitch5(e) {
    this.setState({
      s4_enabled: e
    })
  },
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      //console.log(values)
      if (errors) {
        return
      }
      console.log(values)
      // const data = {
      //   Name: values.Name,
      //   Level: values.Level,
      //   Wid: values.WareHouse.id,
      //   Province: values.Province || [],
      //   Shopid: values.Shopid || [],
      //   ContainSkus: values.ContainSkus ? values.ContainSkus.split(/,|，/) : [],
      //   RemoveSkus: values.RemoveSkus ? values.RemoveSkus.split(/,|，/) : [],
      //   ContainGoods: values.ContainGoods ? values.ContainGoods.split(/,|，/) : [],
      //   RemoveGoods: values.RemoveGoods ? values.RemoveGoods.split(/,|，/) : [],
      //   Did: values.Did || [],
      //   MinNum: values.MinNum,
      //   MaxNum: values.MaxNum,
      //   Gift: 1,
      //   Payment: values.Payment,
      //   shopDefault: true
      // }
      // let uri = 'Warehouse/createploy'
      // if (this.props.id > 0) {
      //   data.ID = this.props.id
      //   uri = 'Warehouse/modifyploy'
      // }
      // startLoading()
      // this.setState({
      //   confirmLoading: true
      // })
      // ZPost(uri, data, ({d}) => {
      //   EE.triggerRefreshMain()
      //   if (this.props.id === 0) {
      //     this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: d.ID})
      //   }
      // }).then(() => {
      //   endLoading()
      //   this.setState({
      //     confirmLoading: false
      //   })
      // })
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
  },
  _renderNull() {
    return <div />
  },
  shopDefaultChange(e) {
    const flag = e.target.value === undefined ? this.state.shopDefault : e.target.value
    this.setState({
      shopDefault: !flag
    })
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    const formItemLayout2 = {
      labelCol: { span: 6 },
      wrapperCol: { span: 6 }
    }
    const formItemLayout3 = {
      labelCol: { span: 12 },
      wrapperCol: { span: 6 }
    }
    const {title} = this.state
    const WareTip = (<div>
      <p>逗号分隔多个仓位`只有当订单中所有商品（不包括赠品）均在仓位内才会生成任务``仓位采取模糊匹配。</p>
      <p>比如：`A=所有A区的仓位</p>
      <p>`A-01=所有A区第一排的仓位</p>
      <p>`A-01-02=所有A区第一排第二列的仓位</p>
      <p>`（类推仓位所有元素）</p>
    </div>)
    return (
      <div className={`${styles.main} ${styles.aside} h-scroller`} style={{display: this.props.id === -1 || this.props.id === null ? 'none' : 'block'}}>
        <h3 className='mb15 tr mr25'>
          {title}
        </h3>
        <Form horizontal className={`${styles.limitform} pos-form`}>
          <FormItem {...formItemLayout} label='策略名称'>
            {getFieldDecorator('Name', {
              rules: [
                { required: true, whitespace: true, message: '必填' }
              ]
            })(
              <Input type='text' style={{maxWidth: 300}} />
            )}
          </FormItem>
          <div className='hr' />
          <Panel header='限定商品'>
            <FormItem {...formItemLayout} label='包含商品编码'>
              {getFieldDecorator('ContainSkus')(
                <Input type='textarea' autosize={{minRows: 2, maxRows: 6}} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='排除商品编码'>
              {getFieldDecorator('RemoveSkus')(
                <Input type='textarea' autosize={{minRows: 2, maxRows: 6}} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='订单包含赠品'>
              {getFieldDecorator('Gift')(
                <RadioGroup onChange={this.onChange}>
                  <Radio value={1}>不区分订单是否包含赠品</Radio>
                  <Radio value={2}>订单包含赠品</Radio>
                  <Radio value={3}>订单没有赠品</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定商品分类'>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('SkuKinds')(
                <Select multiple placeholder='请选择'>
                  {this.state.SkuKinds.map(x => <Option value={`${x.ID}`} key={x.ID}>{x.KindName}</Option>)}
                </Select>
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定仓位'>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('Ware')(
                <Popover content={WareTip} title='小贴士：' placement='right'>
                  <Input type='textarea' autosize={{minRows: 2, maxRows: 6}} />
                </Popover>
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定打印快递单'>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('WayBill', {initialValue: 1})(
                <RadioGroup onChange={this.onChange}>
                  <Radio value={1}>不限定</Radio>
                  <Radio value={2}>未打印</Radio>
                  <Radio value={3}>已打印</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定快递公司'>
          1
          </Panel>
          <Panel closed header='限定分销商'>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('Did')(
                <Select multiple placeholder='请选择'>
                  {this.state.distributors.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
                </Select>
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定店铺'>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('DefaultShop')(
                <Checkbox checked={this.state.shopDefault} onChange={this.shopDefaultChange} >根据父页面【限制生成任务的店铺】进行自动判断（默认，选择该项，以下选项无效）</Checkbox>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('Shopid')(
                <Select multiple placeholder='请选择' disabled={this.state.shopDefault}>
                  {this.state.shops.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
                </Select>
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定标签'>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('NoTag')(
                <Checkbox >没有标签</Checkbox>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('Tag')(
                <Input placeholder='多个关键字逗号隔开' />
              )}
            </FormItem>
          </Panel>
          <Panel closed header='其他限定条件'>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout3} label='限定金额-最大值'>
                  {getFieldDecorator('MinMoney', {initialValue: 0})(
                    <InputNumber min={0} step={0.01} placeholder='最大值' />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout2} label='最小值'>
                  {getFieldDecorator('MaxMoney', {initialValue: 0})(
                    <InputNumber min={0} step={0.01} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem {...formItemLayout} label='限定付款时间'>
                  {getFieldDecorator('PayTime')(
                    <RangePicker />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem {...formItemLayout} label='买家留言'>
                  {getFieldDecorator('BuyerMsg')(
                    <Popover content='买家留言包含关键字，比如（发票,请联系我）`多关键字逗号分隔' title='小贴士：' placement='right'>
                      <Input placeholder='买家留言包含关键字' style={{width: '200px'}} />
                    </Popover>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem {...formItemLayout} label='卖家备注'>
                  {getFieldDecorator('SellerMsg')(
                    <Popover content='卖家备注包含关键字，比如（发票,特别关注）`多关键字逗号分隔' title='小贴士：' placement='right'>
                      <Input placeholder='卖家留言包含关键字' style={{width: '200px'}} />
                    </Popover>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>
          <div style={{marginBottom: '1em'}} className='clearfix' />
          <FormItem>
            <Col span='7' offset='6'>
              <Button type='primary' onClick={this.handleSubmit} loading={this.state.confirmLoading}>保存设置</Button>
            </Col>
          </FormItem>
        </Form>
      </div>
    )
  }
})))

const Panel = React.createClass({
  getInitialState() {
    return {
      closed: !!this.props.closed
    }
  },
  handleCollege() {
    this.setState({
      closed: !this.state.closed
    })
  },
  render() {
    const CN = classNames(styles.box, {
      [`${styles.closed}`]: this.state.closed
    })
    const style = this.props.style || {}
    return (
      <div className={CN} style={style}>
        <div className={styles.tt} onClick={this.handleCollege}>
          <div className={styles.arrow} />
          {this.props.header}
        </div>
        <div className={styles.dd}>
          {this.props.children}
        </div>
      </div>
    )
  }
})
