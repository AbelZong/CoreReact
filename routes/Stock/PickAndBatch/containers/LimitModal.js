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
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Popconfirm,
  Row,
  Col,
  Select,
  Button,
  Checkbox,
  DatePicker
} from 'antd'
import {
  connect
} from 'react-redux'
import {
  ZPost,
  ZGet
} from 'utils/Xfetch'
import EE from 'utils/EE'
import styles from './index.scss'
import {
  startLoading,
  endLoading
} from 'utils'
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
      title: DEFAULT_TITLE,
      ploys: [],
      on_id: 0
    }
  },
  componentWillReceiveProps(nextProps) { //波次类型(0:一单一件;1:一单多件;2:现场|大单;3:零拣补货;4:采购退货)
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else if (nextProps.doge === 1) {
        ZGet('Batch/GetStrategySimple', {type: 0}, ({d}) => {
          this.setState({
            visible: true,
            title: DEFAULT_TITLE + '（单件）',
            confirmLoading: false,
            ploys: d
          })
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
  handleModify(id) {
    if (this.props.on_id !== -1 && this.props.on_id !== null && this.props.on_id !== undefined) {
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
  hideModal() {
    this.props.dispatch({ type: 'PB_LIMIT_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  render() {
    const {visible, title, confirmLoading} = this.state
    const {ploys} = this.state
    const {on_id} = this.props
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={680} maskClosable={false}>
        <div className={styles.topOperators}>
          <Button>添加新的限定策略</Button>
        </div>
        <div className={styles.topOperators}>
          <div className={`${styles.left} h-scroller`}>
            <ul className={styles.lst}>
              {ploys.map(x => <li key={x.ID} className={on_id === x.ID ? styles.active : ''}>
                <div className='clearfix'><span onClick={() => this.handleModify(x.ID)}>{x.StrategyName}&emsp;<a>修改</a></span>
                  <Popconfirm title='确认删除？无法恢复' onConfirm={this.handleRemove}>
                    <a className='pull-right'>删除</a>
                  </Popconfirm>
                </div>
              </li>)}
            </ul>
          </div>
        </div>
        <Limit />
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.pb_limit_vis
}))(createForm()(LimitModal))

const Limit = connect(state => ({
  id: state.pb_limit_policy_vis
}))(createForm()(React.createClass({
  getInitialState: function() {
    return {
      s2_enabled: true,
      s4_enabled: true,
      confirmLoading: false,
      title: '',
      shops: [],
      distributors: [],
      SkuKinds: [],
      express: [],
      shopDefault: true,
      shopAll: false,
      exDefault: true,
      exAll: false
    }
  },
  componentDidMount() {
    ZGet('Common/batchBase', null, ({d}) => {
      this.setState({
        SkuKinds: d.KindLst.Children,
        shops: d.shops,
        distributors: d.distributor,
        express: d.express
      })
    })
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({
        confirmLoading: false
      })
      if (nextProps.id > 0) {
        this.setState({
          confirmLoading: false
        })

        ZGet('Batch/GetStrategyEdit', {id: nextProps.id}, ({d}) => {
          // const ploy = {
          //   StrategyName: d.StrategyName,
          //   SkuIn: d.SkuIn,
          //   SkuNotIn: d.SkuNotIn,
          //   OrdGift: d.OrdGift,
          //   KindIDIn: d.KindIDIn,
          //   PCodeIn: d.PCodeIn,
          //   ExpPrint: d.ExpPrint
          // }
          this.setState({
            exDefault: d.ExpressIn === 'B',
            exAll: d.ExpressIn === 'A',
            shopDefault: d.ShopIn === 'B',
            shopAll: d.ShopIn === 'A'
          }, () => {
            this.props.form.setFieldsValue(d)
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
    const v = e.target.value === undefined ? this.state.shopDefault : e.target.value
    if (v === this.state.shopDefault) {
      this.setState({
        shopAll: false,
        shopDefault: !v
      })
    } else {
      if (!v === this.state.shopDefault && v) {
        this.setState({
          shopAll: false,
          shopDefault: true
        })
      } else {
        this.setState({
          shopDefault: !v
        })
      }
    }
  },
  shopAllChange(e) {
    const v = e.target.value === undefined ? this.state.shopAll : e.target.value
    if (!v) {
      this.setState({
        shopAll: !v,
        shopDefault: false
      })
    } else {
      if (!v === this.state.shopAll && v) {
        this.setState({
          shopAll: true,
          shopDefault: false
        })
      } else {
        this.setState({
          shopAll: !v
        })
      }
    }
  },
  exDefaultChange(e) {
    const v = e.target.value === undefined ? this.state.exDefault : e.target.value
    if (v === this.state.exDefault) {
      this.setState({
        exAll: false,
        exDefault: !v
      })
    } else {
      if (!v === this.state.exDefault && v) {
        this.setState({
          exAll: false,
          exDefault: true
        })
      } else {
        this.setState({
          exDefault: !v
        })
      }
    }
  },
  exAllChange(e) {
    const v = e.target.value === undefined ? this.state.exAll : e.target.value
    if (!v) {
      this.setState({
        exAll: !v,
        exDefault: false
      })
    } else {
      if (!v === this.state.exAll && v) {
        this.setState({
          exAll: true,
          exDefault: false
        })
      } else {
        this.setState({
          exAll: !v
        })
      }
    }
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
            {getFieldDecorator('StrategyName', {
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
              {getFieldDecorator('SkuIn')(
                <Input type='textarea' autosize={{minRows: 2, maxRows: 6}} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='排除商品编码'>
              {getFieldDecorator('SkuNotIn')(
                <Input type='textarea' autosize={{minRows: 2, maxRows: 6}} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='订单包含赠品'>
              {getFieldDecorator('OrdGift')(
                <RadioGroup onChange={this.onChange}>
                  <Radio value={0}>不区分订单是否包含赠品</Radio>
                  <Radio value={1}>订单包含赠品</Radio>
                  <Radio value={2}>订单没有赠品</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定商品分类'>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('KindIDIn')(
                <Select multiple placeholder='请选择'>
                  {this.state.SkuKinds.map(x => <Option value={`${x.ID}`} key={x.ID}>{x.KindName}</Option>)}
                </Select>
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定仓位'>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('PCodeIn')(
                <Input title={WareTip} type='textarea' autosize={{minRows: 2, maxRows: 6}} />
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定打印快递单'>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('ExpPrint', {initialValue: 0})(
                <RadioGroup onChange={this.onChange}>
                  <Radio value={0} key={0}>不限定</Radio>
                  <Radio value={1} key={1}>未打印</Radio>
                  <Radio value={2} key={2}>已打印</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定快递公司'>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('DefaultEx')(
                <Checkbox checked={this.state.exDefault} onChange={e => this.exDefaultChange(e)} >根据父页面【限制生成任务的快递公司】进行自动判断（默认，选择该项，以下选项无效）</Checkbox>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('AllEx')(
                <Checkbox checked={this.state.exAll} onChange={e => this.exAllChange(e)} >全部快递公司（如果选择该项，以下选项无效）</Checkbox>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('ExpressIn')(
                <Select multiple placeholder='请选择' disabled={this.state.exDefault || this.state.exAll}>
                  {this.state.express.map(x => <Option value={`${x.value}`} key={x.value}>{x.label}</Option>)}
                </Select>
              )}
            </FormItem>
          </Panel>
          <Panel closed header='限定分销商'>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('DistributorIn')(
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
              {getFieldDecorator('AllShop')(
                <Checkbox checked={this.state.shopAll} onChange={e => this.shopAllChange(e)} >全部店铺（如果选择该项，以下选项无效）</Checkbox>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label=''>
              {getFieldDecorator('ShopIn')(
                <Select multiple placeholder='请选择' disabled={this.state.shopDefault || this.state.shopAll}>
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
                <FormItem {...formItemLayout3} label='限定金额-最小值'>
                  {getFieldDecorator('AmtMin', {initialValue: 0})(
                    <InputNumber min={0} step={0.01} placeholder='最大值' />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout2} label='最大值'>
                  {getFieldDecorator('AmtMax', {initialValue: 0})(
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
                  {getFieldDecorator('RecMessage')(
                    <Input placeholder='买家留言包含关键字,多个逗号分隔' style={{width: '200px'}} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem {...formItemLayout} label='卖家备注'>
                  {getFieldDecorator('SendMessage')(
                    <Input placeholder='卖家留言包含关键字,多个逗号分隔' style={{width: '200px'}} />
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
