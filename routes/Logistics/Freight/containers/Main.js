/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-28 09:29:06
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import update from 'react-addons-update'
import {
  Icon,
  Popconfirm,
  InputNumber,
  Button,
  Modal,
  Alert,
  Form,
  Radio
} from 'antd'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import {
  startLoading,
  endLoading
} from 'utils/index'
const ButtonGroup = Button.Group
const createForm = Form.create
const FormItem = Form.Item
const RadioGroup = Radio.Group
export default Wrapper(React.createClass({
  getInitialState() {
    return {
      exprs: []
    }
  },
  componentWillMount() {
    this._firstBlood()
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  handleDelete(ID) {
    this.refreshDataCallback()
  },
  _firstBlood() {
    this.setState({
      exprs: [
        {ID: 1, Name: '圆通快递', Detail: {
          'ID': 1,
          'StartWeight': 10,
          'StartFee': 10,
          'AddWeight': 10,
          'AddFee': 10,
          'CalcType': 'start_and_more',
          'WeightOff': 10,
          'Items': [
            {
              'Destination': {
                '江苏': '苏州市,淮安市'
              },
              'StartWeight': 1,
              'StartFee': 1,
              'AddWeight': 1,
              'AddFee': 1,
              'Ranges': [
                {
                  'ID': 10,
                  'MinWeight': 1,
                  'MaxWeight': 2,
                  'StartWeight': 3,
                  'StartFee': 3,
                  'AddWeight': 3,
                  'AddFee': 3
                }
              ]
            }
          ]
        }},
        {ID: '2', Name: 'EMS', Detail: null},
        {ID: '3', Name: '顺丰速运', Detail: null}
      ]
    })
    // ZGet('', ({d}) => {
    //   this.setState(d)
    // })
  },
  render() {
    return (
      <div className={styles.main}>
        {this.state.exprs.length ? this.state.exprs.map(x => <Tt key={x.ID} zch={this} x={x} />) : (
          <div className='mt20 tc'>请先设置 物流（快递）公司 信息</div>
        )}
        <Modal1 zch={this} />
        <div className='mt25'>
          <h2>::List数据结构<small className='ml10 gray'>尚未有API</small></h2>
          <pre>{JSON.stringify(this.state.exprs, null, 4)}</pre>
        </div>
      </div>
    )
  }
}))
const Modal1 = connect(state => ({
  doge: state.logistics_freight_expr_1_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      data: {}
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge === nextProps.doge) {
      return
    }
    if (nextProps.doge) {
      const index = this.props.zch.state.exprs.findIndex(x => x.ID === nextProps.doge)
      if (index === -1) {
        Modal.error({
          title: '数据对象不存在，请刷新页面重试',
          onOk: () => {
            this.props.zch.refreshDataCallback()
          }
        })
        return
      }
      //demo to be killed
      this._nextRID = 0
      const data = this.props.zch.state.exprs[index]
      if (!data.Detail) {
        data.Detail = {}
      }
      // this.props.form.setFieldsValue({
      //   StartWeight: data.Detail.StartWeight || '0',
      //   StartFee: data.Detail.StartFee || '0',
      //   AddWeight: data.Detail.AddWeight || '0',
      //   AddFee: data.Detail.AddFee || '0',
      //   WeightOff: data.Detail.WeightOff || '0'
      // })
      if (!data.Detail.Items || !data.Detail.Items.length) {
        data.Detail.Items = [
          {
            'Destination': null,
            'StartWeight': '',
            'StartFee': '',
            'AddWeight': '',
            'AddFee': '',
            'Ranges': [
            /*  {
                'ID': --this._nextRID,
                'MinWeight': '',
                'MaxWeight': '',
                'StartWeight': '',
                'StartFee': '',
                'AddWeight': '',
                'AddFee': ''
              }
              */
            ]
          }
        ]
      }
      this.setState({
        visible: true,
        data
      })
      // startLoading()
      // ZGet('todo', {ID: nextProps.doge}, ({d}) => {
      //   this.setState({
      //     visible: true,
      //     data: d
      //   })
      // }).then(endLoading)
    } else {
      this.setState({
        visible: false,
        confirmLoading: false,
        data: {}
      })
    }
  },
  handleOK() {
    this.props.form.validateFields((errors, values) => {
      console.log(values)
      if (errors) {
        return false
      }
    })
  },
  handleok() {
    this.props.dispatch({type: 'LOGISTICS_FREIGHT_EXPR_1_VIS', payload: null})
    //this.props.form.resetFields()
  },
  handleAppendItem() {
    this.setState(update(this.state, {
      data: {
        Detail: {
          Items: {
            $push: [{
              'Destination': null,
              'StartWeight': '',
              'StartFee': '',
              'AddWeight': '',
              'AddFee': '',
              'Ranges': []
            }]
          }
        }
      }
    }))
  },
  handleAppendRanges(nums, item, index) {
    //console.log(nums, item, index)
    const $push = []
    for (let i = 0; i < nums; i++) {
      $push.push({
        'ID': --this._nextRID,
        'MinWeight': '',
        'MaxWeight': '',
        'StartWeight': '',
        'StartFee': '',
        'AddWeight': '',
        'AddFee': ''
      })
    }
    this.setState(update(this.state, {
      data: {
        Detail: {
          Items: {
            [`${index}`]: {
              Ranges: {
                $push
              }
            }
          }
        }
      }
    }))
  },
  handleRemoveItem(item, index) {
    this.setState(update(this.state, {
      data: {
        Detail: {
          Items: {
            $splice: [[index, 1]]
          }
        }
      }
    }))
  },
  handleDeleteRange(item, index, range, rangeIndex) {
    this.setState(update(this.state, {
      data: {
        Detail: {
          Items: {
            [`${index}`]: {
              Ranges: {
                $splice: [[rangeIndex, 1]]
              }
            }
          }
        }
      }
    }))
  },
  handleModifyArea(item, index) {
    console.log(item, index)
  },
  _renderArea(obj) {
    if (obj === null) {
      return '(未添加地区)'
    }
    const aa = []
    for (let a in obj) {
      aa.push(`<span class='ml5'>${a}</span>`)
      if (obj[a]) {
        aa.push(`<span class=${styles.gray}>(${obj[a]})</span>`)
      }
    }
    return aa.join('')
  },
  render() {
    const {data, confirmLoading, visible} = this.state
    const {getFieldDecorator} = this.props.form
    const Detail = data.Detail || {}
    return (
      <Modal title={`运费模板设置-${data.Name}`} confirmLoading={confirmLoading} onOk={this.handleOK} visible={visible} onCancel={this.handleok} width='100%'>
        <Alert message='除指定地区外,其余地区运费采用默认运费（如需根据不同重量范围，采用不同的规则，请进行详细设定）' type='warning' />
        <div className={styles.mForm}>
          <Form horizontal className='pos-form'>
            <div className={styles.line}>
              <span>默认运费：</span>
              <FormItem>
                {getFieldDecorator('b.StartWeight', {
                  initialValue: Detail.StartWeight || 0,
                  rules: [
                    {required: true, message: '必填', type: 'number'}
                  ]
                })(
                  <InputNumber size='small' step={0.01} min={0} />
                )}
              </FormItem>
              kg内，&nbsp;
              <FormItem>
                {getFieldDecorator('b.StartFee', {
                  initialValue: Detail.StartFee || 0,
                  rules: [
                    {required: true, message: '必填', type: 'number'}
                  ]
                })(
                  <InputNumber size='small' step={0.01} />
                )}
              </FormItem>
              元，每增加&nbsp;
              <FormItem>
                {getFieldDecorator('b.AddWeight', {
                  initialValue: Detail.AddWeight || 0,
                  rules: [
                    {required: true, message: '必填', type: 'number'}
                  ]
                })(
                  <InputNumber size='small' step={0.01} />
                )}
              </FormItem>
              kg，增加运费&nbsp;
              <FormItem>
                {getFieldDecorator('b.AddFee', {
                  initialValue: Detail.AddFee || 0,
                  rules: [
                    {required: true, message: '必填', type: 'number'}
                  ]
                })(
                  <InputNumber size='small' step={0.01} />
                )}
              </FormItem>
            </div>
            <div className={styles.line}>
              <span className='mr5'>计算方式</span>
              <FormItem>
                {getFieldDecorator('b.CalcType', {
                  initialValue: Detail.CalcType || 'start_and_more',
                  rules: [
                    {required: true, message: '必选'}
                  ]
                })(
                  <RadioGroup>
                    <Radio value='start_and_more'>首重费用+续重费用(重量从首重开始计算)</Radio>
                    <Radio value='start_or_more'>小于等于首重=首重费用；大于首重=续重费用(重量从0开始计算)</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </div>
            <div className={styles.line}>
              <span className='mr5'>舍入重量</span>
              <FormItem>
                {getFieldDecorator('b.WeightOff', {
                  initialValue: Detail.WeightOff || '0',
                  rules: [
                    {required: true, message: '必填', type: 'number'}
                  ]
                })(
                  <InputNumber size='small' step={0.01} />
                )}
              </FormItem>
            </div>
            <div className={styles.Tt}>
              <div className={styles.ttt}>
                <div className={styles.th}>
                  <div className={styles.td0}>运送到</div>
                  <div className={styles.tdd}>
                    <div className={styles.tdr1}>
                      <div className={styles.td1}>限定重量范围(kg)</div>
                      <div className={styles.td2}>首重(kg)</div>
                      <div className={styles.td3}>首费(元)</div>
                      <div className={styles.td4}>续重(kg)</div>
                      <div className={styles.td5}>续费(元)</div>
                      <div className={styles.td10} />
                    </div>
                  </div>
                </div>
                {data.Detail && data.Detail.Items && data.Detail.Items.length ? data.Detail.Items.map((x, m) => (
                  <div className={styles.tr} key={m}>
                    <div className={styles.td0}>
                      <div className={styles.area}>
                        <div className={styles._mC} dangerouslySetInnerHTML={{__html: this._renderArea(x.Destination)}} />
                      </div>
                      <div className={styles.areaE}>
                        <Button className={styles._mC} size='small' type='primary' onClick={() => this.handleModifyArea(x, m)}>编辑</Button>
                      </div>
                    </div>
                    <div className={styles.tdd}>
                      <div className={styles.tdr1}>
                        <div className={styles.td1}>(<strong>默认，不限</strong>)</div>
                        <div className={styles.td2}>
                          <FormItem>
                            {getFieldDecorator(`m${m}.StartWeight`, {
                              initialValue: x.StartWeight,
                              rules: [
                                {required: true, message: '必填', type: 'number'}
                              ]
                            })(
                              <InputNumber size='small' step={0.01} min={0} />
                            )}
                          </FormItem>
                        </div>
                        <div className={styles.td3}>
                          <FormItem>
                            {getFieldDecorator(`m${m}.StartFee`, {
                              initialValue: x.StartFee,
                              rules: [
                                {required: true, message: '必填', type: 'number'}
                              ]
                            })(
                              <InputNumber size='small' step={0.01} min={0} />
                            )}
                          </FormItem>
                        </div>
                        <div className={styles.td4}>
                          <FormItem>
                            {getFieldDecorator(`m${m}.AddWeight`, {
                              initialValue: x.AddWeight,
                              rules: [
                                {required: true, message: '必填', type: 'number'}
                              ]
                            })(
                              <InputNumber size='small' step={0.01} min={0} />
                            )}
                          </FormItem>
                        </div>
                        <div className={styles.td5}>
                          <FormItem>
                            {getFieldDecorator(`m${m}.AddFee`, {
                              initialValue: x.AddFee,
                              rules: [
                                {required: true, message: '必填', type: 'number'}
                              ]
                            })(
                              <InputNumber size='small' step={0.01} min={0} />
                            )}
                          </FormItem>
                        </div>
                      </div>
                      {x.Ranges && x.Ranges.length ? x.Ranges.map((y, n) => (
                        <div className={styles.tdr} key={y.ID}>
                          <div className={styles.td1}>
                            <Popconfirm title='确定删除该条重量区间么？' onConfirm={() => this.handleDeleteRange(x, m, y, n)}>
                              <a className='mr5'><Icon type='delete' /></a>
                            </Popconfirm>
                            <FormItem>
                              {getFieldDecorator(`y${m}.MinWeight.${y.ID}`, {
                                initialValue: y.MinWeight,
                                rules: [
                                  {required: true, message: '必填', type: 'number'}
                                ]
                              })(
                                <InputNumber size='small' step={0.01} min={0} style={{width: 52}} />
                              )}
                            </FormItem>
                            ~
                            <FormItem>
                              {getFieldDecorator(`y${m}.MaxWeight.${y.ID}`, {
                                initialValue: y.MaxWeight,
                                rules: [
                                  {required: true, message: '必填', type: 'number'}
                                ]
                              })(
                                <InputNumber size='small' step={0.01} min={0} style={{width: 52}} />
                              )}
                            </FormItem>
                          </div>
                          <div className={styles.td2}>
                            <FormItem>
                              {getFieldDecorator(`y${m}.StartWeight.${y.ID}`, {
                                initialValue: y.StartWeight,
                                rules: [
                                  {required: true, message: '必填', type: 'number'}
                                ]
                              })(
                                <InputNumber size='small' step={0.01} min={0} />
                              )}
                            </FormItem>
                          </div>
                          <div className={styles.td3}>
                            <FormItem>
                              {getFieldDecorator(`y${m}.StartFee.${y.ID}`, {
                                initialValue: y.StartFee,
                                rules: [
                                  {required: true, message: '必填', type: 'number'}
                                ]
                              })(
                                <InputNumber size='small' step={0.01} min={0} />
                              )}
                            </FormItem>
                          </div>
                          <div className={styles.td4}>
                            <FormItem>
                              {getFieldDecorator(`y${m}.AddWeight.${y.ID}`, {
                                initialValue: y.AddWeight,
                                rules: [
                                  {required: true, message: '必填', type: 'number'}
                                ]
                              })(
                                <InputNumber size='small' step={0.01} min={0} />
                              )}
                            </FormItem>
                          </div>
                          <div className={styles.td5}>
                            <FormItem>
                              {getFieldDecorator(`y${m}.AddFee.${y.ID}`, {
                                initialValue: y.AddFee,
                                rules: [
                                  {required: true, message: '必填', type: 'number'}
                                ]
                              })(
                                <InputNumber size='small' step={0.01} min={0} />
                              )}
                            </FormItem>
                          </div>
                        </div>
                      )) : null}
                      <div className={styles.tdr2}>
                        <div className={styles.btns}>
                          <a onClick={() => this.handleAppendRanges(1, x, m)}>添加重量范围</a>
                          &emsp;
                          <a onClick={() => this.handleAppendRanges(4, x, m)}>添加4条重量范围</a>
                        </div>
                      </div>
                    </div>
                    <div className={styles.td10}>
                      <Popconfirm title='确定删除该条目的地记录吗？' onConfirm={() => this.handleRemoveItem(x, m)}>
                        <Button className={styles._mC} type='dashed' size='small'>删除</Button>
                      </Popconfirm>
                    </div>
                  </div>
                )) : null}
              </div>
            </div>
            <div className='mt10'>
              <div className={styles.btns}>
                <a className='ml10' onClick={this.handleAppendItem}>为指定地区设置运费</a>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    )
  }
})))
const Tt = connect()(React.createClass({
  createNew() {
    this.props.dispatch({type: 'LOGISTICS_FREIGHT_EXPR_1_VIS', payload: this.props.x.ID})
  },
  handleCopy() {

  },
  handleModify() {
    this.props.dispatch({type: 'LOGISTICS_FREIGHT_EXPR_1_VIS', payload: this.props.x.ID})
  },
  handleDelete() {
    Modal.confirm({
      title: `确定要删除【${this.props.x.Name}】的运费模板吗？`,
      content: '删除后无法恢复',
      onOk: () => {
        startLoading()
        ZPost('todo', {ID: this.props.x.ID}, () => {
          this.props.zch.handleDelete(this.props.x.ID)
        }).then(endLoading)
      }
    })
  },
  _renderArea(obj) {
    const aa = []
    for (let a in obj) {
      aa.push(`<span class='ml5'>${a}</span>`)
      if (obj[a]) {
        aa.push(`<span class=${styles.gray}>(${obj[a]})</span>`)
      }
    }
    return aa.join('')
  },
  render() {
    const xx = this.props.x.Detail
    if (!xx) {
      return (
        <div className={styles.Tt}>
          <h3>{this.props.x.Name}</h3>
          <div className={styles.noTt}>
            <span className='gray'>没有设定模板，<a onClick={this.createNew}>创建新的运费模板</a></span>
          </div>
        </div>
      )
    }
    return (
      <div className={styles.Tt}>
        <div className={styles.tile}>
          <h3>{this.props.x.Name}</h3>
          <div className='pull-right'>
            <ButtonGroup>
              <Button type='dashed' size='small' onClick={this.handleCopy} icon='copy'>复制</Button>
              <Button type='ghost' size='small' onClick={this.handleModify} icon='edit'>修改</Button>
              <Button type='default' size='small' onClick={this.handleDelete} icon='delete'>删除</Button>
            </ButtonGroup>
          </div>
          <div className='clearfix' />
        </div>
        <div className={styles.ttt}>
          <div className={styles.th}>
            <div className={styles.td0}>运送到</div>
            <div className={styles.tdr}>
              <div className={styles.td1}>限定重量范围(kg)</div>
              <div className={styles.td2}>首重(kg)</div>
              <div className={styles.td3}>首费(元)</div>
              <div className={styles.td4}>续重(kg)</div>
              <div className={styles.td5}>续费(元)</div>
            </div>
          </div>
          <div className={styles.tr}>
            <div className={styles.td0}><span className='ml5'>全国(默认)</span></div>
            <div className={styles.tdr}>
              <div className={styles.td1}>(<strong>不限</strong>)</div>
              <div className={styles.td2}>{xx.StartWeight}</div>
              <div className={styles.td3}>{xx.StartFee}</div>
              <div className={styles.td4}>{xx.AddWeight}</div>
              <div className={styles.td5}>{xx.AddFee}</div>
            </div>
          </div>
          {xx.Items && xx.Items.length ? xx.Items.map((x, m) => (
            <div className={styles.tr} key={m}>
              <div className={styles.td0}><div className={styles.area} dangerouslySetInnerHTML={{__html: this._renderArea(x.Destination)}} /></div>
              <div className={styles.tdc}>
                <div className={styles.tdr1}>
                  <div className={styles.td1}>(<strong>不限</strong>)</div>
                  <div className={styles.td2}>{x.StartWeight}</div>
                  <div className={styles.td3}>{x.StartFee}</div>
                  <div className={styles.td4}>{x.AddWeight}</div>
                  <div className={styles.td5}>{x.AddFee}</div>
                </div>
                {x.Ranges && x.Ranges.length ? x.Ranges.map(y => (
                  <div className={styles.tdr} key={y.ID}>
                    <div className={styles.td1}>{y.MinWeight}~{y.MaxWeight}</div>
                    <div className={styles.td2}>{y.StartWeight}</div>
                    <div className={styles.td3}>{y.StartFee}</div>
                    <div className={styles.td4}>{y.AddWeight}</div>
                    <div className={styles.td5}>{y.AddFee}</div>
                  </div>
                )) : null}
              </div>
            </div>
          )) : null}
        </div>
      </div>
    )
  }
}))
