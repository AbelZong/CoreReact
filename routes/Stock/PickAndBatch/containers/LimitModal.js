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
  Button,
  Checkbox,
  DatePicker,
  Collapse
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
import DateRange from 'components/DateStartEnd'
const RangePicker = DatePicker.RangePicker
const RadioGroup = Radio.Group
const createForm = Form.create
const FormItem = Form.Item
const DEFAULT_TITLE = '限定条件'
const Panel = Collapse.Panel
const CheckboxGroup = Checkbox.Group

const LimitModal = React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: DEFAULT_TITLE,
      ploys: [],
      on_id: 0,
      type: 0
    }
  },
  componentWillReceiveProps(nextProps) { //波次类型(0:一单一件;1:一单多件;2:现场|大单;3:零拣补货;4:采购退货)
    startLoading()
    if (this.props.ploys.length !== nextProps.ploys.length) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false,
          ploys: []
        })
      } else {
        this.setState({
          visible: true,
          ploys: nextProps.ploys,
          on_id: nextProps.doge
        })
      }
    }
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
            type: 0,
            ploys: d
          })
        })
      } else if (nextProps.doge === 2) {
        ZGet('Batch/GetStrategySimple', {type: 1}, ({d}) => {
          this.setState({
            visible: true,
            title: DEFAULT_TITLE + '（多件）',
            confirmLoading: false,
            type: 1,
            ploys: d
          })
        })
      }
    }
    endLoading()
  },
  handleSubmit() {
    this.props.form.validateFields((errors, vs) => {
      const wtf = !!errors
      if (wtf) {
        return false
      }
      let uri = ''
      if (this.state.type === 0) {
        uri = 'Batch/SetSingleOrdStrategy'
      } else if (this.state.type === 1) {
        uri = 'Batch/SetMultiOrdStrategy'
      }
      if (this.state.on_id !== 0) {
        ZPost(uri, {ID: this.state.on_id}, () => {
          this.hideModal()
          EE.triggerRefreshMain()
        }, () => {
          this.setState({
            confirmLoading: false
          })
        })
      }
    })
  },
  onRadioChange() {

  },
  handleModify(id) {
    if (this.state.on_id !== 0) {
      if (this.state.on_id !== id) {
        Modal.confirm({
          title: '当前有编辑策略，是否确定离开?',
          content: '【确定】离开后不会自动保存',
          onOk: () => {
            this.props.dispatch({type: 'PB_LIMIT_POLICY_VIS_SET', payload: [id, this.state.type]})
            this.setState({
              on_id: id
            })
          }
        })
      }
    } else {
      this.props.dispatch({type: 'PB_LIMIT_POLICY_VIS_SET', payload: [id, this.state.type]})
      this.setState({
        on_id: id
      })
    }
  },
  handleRemove(id) {
    startLoading()
    ZPost('Batch/DeleteStrategy', {ID: id, Type: this.state.type}, ({d}) => {
      this.setState({
        ploys: d
      })
    }).then(() => {
      endLoading()
    })
  },
  handleAdd() {
     //(0:一单一件;0:一单多件;2:现场|大单;3:零拣补货;4:采购退货)
    if (this.state.on_id !== 0) {
      Modal.confirm({
        title: '当前有编辑策略，是否确定离开?',
        content: '【确定】离开后不会自动保存',
        onOk: () => {
          this.props.dispatch({type: 'PB_LIMIT_POLICY_VIS_SET', payload: [0, 0]})
          this.setState({
            on_id: 0
          })
        }
      })
    } else {
      this.props.dispatch({type: 'PB_LIMIT_POLICY_VIS_SET', payload: [0, this.state.type]})
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'PB_LIMIT_VIS_SET', payload: -1 })
    this.props.dispatch({type: 'PB_LIMIT_POLICY_VIS_SET', payload: []})
    this.props.dispatch({type: 'PB_LIMIT_POLICY_VIS_SET', payload: [-1, 0]})
    this.props.form.resetFields()
  },
  render() {
    const {visible, title, confirmLoading} = this.state
    const {ploys, on_id} = this.state
    return (
      <Modal title={title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={confirmLoading} width={980} maskClosable={false}>
        <div className={styles.topOperators}>
          <Button onClick={this.handleAdd}>添加新的限定策略</Button>
        </div>
        <div className='flex-row'>
          <div className={`${styles.left} h-scroller`}>
            <ul className={styles.lst}>
              {ploys.map(x => <li key={x.ID} className={on_id === x.ID ? styles.active : ''}>
                <div className='clearfix'><span onClick={() => this.handleModify(x.ID)}>{x.StrategyName}&emsp;<a>修改</a></span>
                  <Popconfirm title='确认删除？无法恢复' onConfirm={e => this.handleRemove(x.ID)}>
                    <a className='pull-right'>删除</a>
                  </Popconfirm>
                </div>
              </li>)}
            </ul>
          </div>
          <Limit />
        </div>
      </Modal>
    )
  }
})
export default connect(state => ({
  doge: state.pb_limit_vis,
  ploys: state.pb_limit_ploys_vis
}))(createForm()(LimitModal))

const Limit = connect(state => ({
  id_type: state.pb_limit_policy_vis
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
      exAll: false,
      id_type: []
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
    if (nextProps.id_type.length && nextProps.id_type[0] !== this.props.id_type[0]) {
      this.setState({
        id_type: nextProps.id_type
      })
      if (nextProps.id_type[0] > 0) {
        ZGet('Batch/GetStrategyEdit', {id: nextProps.id_type[0]}, ({d}) => {
          const ploy = {
            StrategyName: d.StrategyName,
            SkuIn: d.SkuIn,
            SkuNotIn: d.SkuNotIn,
            OrdGift: d.OrdGift,
            KindIDIn: d.KindIDIn !== '' ? d.KindIDIn.split(',') : [],
            PCodeIn: d.PCodeIn,
            ExpPrint: d.ExpPrint,
            ExpressIn: d.ExpressIn !== '' ? d.ExpressIn.split(',') : [],
            DistributorIn: d.DistributorIn !== '' ? d.DistributorIn.split(',') : [],
            ShopIn: d.ShopIn !== '' ? d.ShopIn.split(',') : [],
            NoTag: d.NoTag,
            Tag: d.Tag,
            AmtMin: d.AmtMin,
            AmtMax: d.AmtMax,
            PayTime: d.PayTime,
            RecMessage: d.RecMessage,
            SendMessage: d.SendMessage
          }
          this.setState({
            exDefault: d.ExpressIn === 'B',
            exAll: d.ExpressIn === 'A',
            shopDefault: d.ShopIn === 'B',
            shopAll: d.ShopIn === 'A'
          }, () => {
            this.props.form.setFieldsValue(ploy)
          })
        })
      } else if (nextProps.id_type[0] === 0) {
        this.props.form.resetFields()
      } else {
        this.setState({
          id_type: []
        })
      }
    }
  },
  componentWillUnmount() {
    this.ignore = true
  },
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, d) => {
      this.setState({
        confirmLoading: true
      })
      if (errors) {
        return
      }
      let data = {}
      let type = 0
      let uri = ''
      if (this.props.id_type[0] > 0) {
        let KindIDIn = ''
        if (d.exDefault) {
          KindIDIn = 'B'
        } else if (d.exAll) {
          KindIDIn = 'A'
        } else {
          KindIDIn = d.KindIDIn && d.KindIDIn.length ? d.KindIDIn.join(',') : ''
        }
        let ShopIn = ''
        if (d.shopDefault) {
          ShopIn = 'B'
        } else if (d.shopAll) {
          ShopIn = 'A'
        } else {
          ShopIn = d.ShopIn && d.ShopIn.length ? d.ShopIn.join(',') : ''
        }
        data = {
          ID: this.props.id_type[0],
          StrategyName: d.StrategyName,
          SkuIn: d.SkuIn,
          SkuNotIn: d.SkuNotIn,
          OrdGift: d.OrdGift,
          KindIDIn: KindIDIn,
          PCodeIn: d.PCodeIn,
          ExpPrint: d.ExpPrint,
          ExpressIn: d.ExpressIn.length ? d.ExpressIn.join(',') : '',
          DistributorIn: d.DistributorIn.length ? d.DistributorIn.join(',') : '',
          ShopIn: ShopIn,
          NoTag: d.NoTag,
          Tag: d.Tag,
          AmtMin: d.AmtMin,
          AmtMax: d.AmtMax,
          PayTime: d.PayTime,
          RecMessage: d.RecMessage,
          SendMessage: d.SendMessage,
          PrioritySku: d.PrioritySku,
          OrdQty: d.OrdQty
        }
        uri = 'Batch/UpdateStrategy'
      } else {
        let KindIDIn = ''
        if (d.exDefault) {
          KindIDIn = 'B'
        } else if (d.exAll) {
          KindIDIn = 'A'
        } else {
          KindIDIn = d.KindIDIn && d.KindIDIn.length ? d.KindIDIn.join(',') : ''
        }
        let ShopIn = ''
        if (d.shopDefault) {
          ShopIn = 'B'
        } else if (d.shopAll) {
          ShopIn = 'A'
        } else {
          ShopIn = d.ShopIn && d.ShopIn.length ? d.ShopIn.join(',') : ''
        }
        data = {
          StrategyName: d.StrategyName,
          SkuIn: d.SkuIn,
          SkuNotIn: d.SkuNotIn,
          OrdGift: d.OrdGift,
          KindIDIn: KindIDIn,
          PCodeIn: d.PCodeIn,
          ExpPrint: d.ExpPrint,
          ExpressIn: d.ExpressIn && d.ExpressIn.length ? d.ExpressIn.join(',') : '',
          DistributorIn: d.DistributorIn && d.DistributorIn.length ? d.DistributorIn.join(',') : '',
          ShopIn: ShopIn,
          NoTag: d.NoTag,
          Tag: d.Tag,
          AmtMin: d.AmtMin,
          AmtMax: d.AmtMax,
          PayTime: d.PayTime,
          RecMessage: d.RecMessage,
          SendMessage: d.SendMessage
        }
        if (this.props.id_type[1] === 0) {
          type = 0
          data = Object.assign({}, data, {
            Type: 0
          })
        } else if (this.props.id_type[1] === 1) {
          type = 1
          data = Object.assign({}, data, {
            Type: 1,
            OrdQty: d.OrdQty
          })
        }

        uri = 'Batch/InsertStrategy'
      }

      ZPost(uri, data, ({d}) => {
        //
        this.setState({
          id_type: []
        })
        this.props.dispatch({ type: 'PB_LIMIT_VIS_SET', payload: 0 })
        this.props.dispatch({type: 'PB_LIMIT_PLOYS_VIS_SET', payload: d})
        this.props.dispatch({type: 'PB_LIMIT_POLICY_VIS_SET', payload: [-1, type]})
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
    const options = []
    this.state.SkuKinds.forEach((x) => {
      options.push({ label: x.KindName, value: x.ID })
    })
    const WareTip = (<div>
      <p>逗号分隔多个仓位`只有当订单中所有商品（不包括赠品）均在仓位内才会生成任务``仓位采取模糊匹配。</p>
      <p>比如：`A=所有A区的仓位</p>
      <p>`A-01=所有A区第一排的仓位</p>
      <p>`A-01-02=所有A区第一排第二列的仓位</p>
      <p>`（类推仓位所有元素）</p>
    </div>)
    return (
      <div className={`${styles.main} ${styles.aside} h-scroller`} style={{display: this.state.id_type.length ? 'block' : 'none'}}>
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
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header='限定商品' key='1'>
              <FormItem {...formItemLayout} label='包含商品编码'>
                {getFieldDecorator('SkuIn')(
                  <Input type='textarea' placeholder='逗号分隔多个商品编码' autosize={{minRows: 2, maxRows: 6}} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label='排除商品编码'>
                {getFieldDecorator('SkuNotIn')(
                  <Input type='textarea' placeholder='逗号分隔多个商品编码' autosize={{minRows: 2, maxRows: 6}} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label='订单包含赠品'>
                {getFieldDecorator('OrdGift', {initialValue: 0})(
                  <RadioGroup onChange={this.onChange}>
                    <Radio value={0}>不区分订单是否包含赠品</Radio>
                    <Radio value={1}>订单包含赠品</Radio>
                    <Radio value={2}>订单没有赠品</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label='优先聚齐包含以下商品编码的订单' style={{display: this.props.id_type[1] === 1 ? 'block' : 'none'}}>
                {getFieldDecorator('PrioritySku')(
                  <Input type='textarea' placeholder='逗号分隔多个商品编码' autosize={{minRows: 2, maxRows: 6}} />
                )}
              </FormItem>
            </Panel>
            <Panel header='限定商品分类' key='2'>
              <FormItem {...formItemLayout} label=''>
                {getFieldDecorator('KindIDIn')(
                  <CheckboxGroup options={options} style={{width: 100}} />
                )}
              </FormItem>
            </Panel>
            <Panel header='限定仓位' key='3'>
              <FormItem {...formItemLayout} label=''>
                {getFieldDecorator('PCodeIn')(
                  <Input title={WareTip} type='textarea' autosize={{minRows: 2, maxRows: 6}} />
                )}
              </FormItem>
            </Panel>
            <Panel header='限定打印快递单' key='4'>
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
            <Panel header='限定快递公司' key='5'>
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
                  <CheckboxGroup options={this.state.express} disabled={this.state.exDefault || this.state.exAll} />
                )}
              </FormItem>
            </Panel>
            <Panel header='限定分销商' key='6'>
              <FormItem {...formItemLayout} label=''>
                {getFieldDecorator('DistributorIn')(
                  <CheckboxGroup options={this.state.distributors} />
                )}
              </FormItem>
            </Panel>
            <Panel header='限定店铺' key='7'>
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
                  <CheckboxGroup options={this.state.shops} disabled={this.state.shopDefault || this.state.shopAll} />
                )}
              </FormItem>
            </Panel>
            <Panel header='限定标签' key='8'>
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
            <Panel header='其他限定条件' key='9'>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout3} label='限定金额-最小值'>
                    {getFieldDecorator('AmtMin', {initialValue: 0})(
                      <InputNumber min={0} step={1} placeholder='最大值' />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout2} label='最大值'>
                    {getFieldDecorator('AmtMax', {initialValue: 0})(
                      <InputNumber min={0} step={1} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{display: this.props.id_type[1] === 1 ? 'block' : 'none'}}>
                <Col span={8}>
                  <FormItem {...formItemLayout3} label='限定每批拣货波次订单数' >
                    {getFieldDecorator('OrdQty', {initialValue: 0})(
                      <InputNumber min={0} step={1} placeholder='每批拣货波次订单数' />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem {...formItemLayout} label='限定付款时间'>
                    {getFieldDecorator('PayTime')(
                      <DateRange format='YYYY-MM-DD' />
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
          </Collapse>
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
