/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-04 08:35:51
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import update from 'react-addons-update'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import styles from './index.scss'
import Wrapper from 'components/MainWrapper'
import {
  Form,
  Col,
  Row,
  Button,
  Popconfirm
} from 'antd'
import {
  startLoading,
  endLoading,
  preZeroFill
} from 'utils/index'
const createForm = Form.create
const ButtonGroup = Button.Group
const FormItem = Form.Item
//todo OPT(RPG~)
const Input = React.createClass(
  {
    getInitialState() {
      const value = this.props.value || ''
      this.oldValue = value
      return {
        value
      }
    },
    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.state.value) {
        const value = nextProps.value || ''
        this.setState({value}, () => {
          this.oldValue = value
        })
      }
    },
    shouldComponentUpdate(nextProps, nextState) {
      return this.state.value !== nextState.value
    },
    handleChange(e) {
      this.setState({value: e.target.value})
    },
    handleBlur(e) {
      //console.log(this.oldValue, this.state.value, this.oldValue === this.state.value)
      if (this.oldValue !== this.state.value) {
        this.oldValue = this.state.value
        this.props.onChange(e)
      }
    },
    render() {
      return (
        <input type='text' className='ant-input' onChange={this.handleChange} onBlur={this.handleBlur} value={this.state.value} />
      )
    }
  }
)
export default createForm()(Wrapper(React.createClass({
  getInitialState: function() {
    return {
      data: []
    }
  },
  componentDidMount() {
    this.refreshDataCallback()
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  componentWillUnmount() {
    this.ignore = true
  },
  refreshDataCallback() {
    startLoading()
    ZGet('XyComm/CustomKindSkuProps/SkuProps', ({d}) => {
      this.cache = {}
      this.autoIndex = 0
      // for (let i = 0; i < 10; i++) {
      //   let e = {
      //     pid: i,
      //     name: `${i}`,
      //     KindNames: `${i}`,
      //     skuprops_values: []
      //   }
      //   for (let j = 0; j < 100; j++) {
      //     e.skuprops_values.push({pid: i, id: Number(`${i}0000${j}`), mapping: '', name: `${i},${j}`})
      //   }
      //   d.push(e)
      // }
      this.setState({
        data: d
      })
    }).then(endLoading)
  },
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      const keys1 = Object.keys(values)
      const cer = []
      for (let id of keys1) {
        let cc = values[id]
        let rpg = {pid: id, skuprops_values: []}
        let keys = Object.keys(cc)
        let thiefs = {}
        for (let key of keys) {
          let keys = key.split('.')
          let [id, field] = keys
          thiefs[id] = thiefs[id] || {}
          thiefs[id][field] = cc[key]
        }
        for (let id of Object.keys(thiefs)) {
          rpg.skuprops_values.push({
            id,
            ...thiefs[id]
          })
        }
        cer.push(rpg)
      }
      startLoading()
      ZPost('XyComm/CustomKindSkuProps/UptSkuPropsValues', {
        SkuPropLst: cer
      }, () => {
        this.refreshDataCallback()
      }).then(endLoading)
    })
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
  },
  _setGetterFieldDecorator(index, key, value) {
    if (!this.cache[index]) {
      this.cache[index] = this.props.form.getFieldDecorator(key, value)
    }
    return this.cache[index]
  },
  heyJude(vs) {
    //getFieldValue('keys')
    return vs.map(x => {
      return (
        <div className={styles.damnit} key={x.id}>
          <FormItem className={styles.op1}>
            {this._setGetterFieldDecorator(`1-${x.pid}-${x.id}`, `${x.pid}.${x.id}.name`, {
              initialValue: x.name,
              rules: [{
                required: true,
                whitespace: true,
                message: '必填'
              }]
            })(
              <Input />
            )}
          </FormItem>
          <span className='gray'>-</span>
          <FormItem className={styles.op2}>
            {this._setGetterFieldDecorator(`2-${x.pid}-${x.id}`, `${x.pid}.${x.id}.mapping`, {
              initialValue: x.mapping,
              rules: [{
                required: true,
                whitespace: true,
                message: '必填'
              }]
            })(
              <Input />
            )}
          </FormItem>
          <span className={styles.op3}>
            <Popconfirm title='删除后不可恢复' onConfirm={() => this.handleRemove(x)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        </div>
      )
    })
  },
  handleAdd(pid) {
    const index = this.state.data.findIndex(x => x.pid === pid)
    this.setState(update(this.state, {
      data: {
        [`${index}`]: {
          skuprops_values: {
            $push: [
              {pid, id: --this.autoIndex, mapping: null, name: ''}
            ]
          }
        }
      }
    }))
  },
  handleRemove(x) {
    const pIndex = this.state.data.findIndex(p => p.pid === x.pid)
    const iIndex = this.state.data[pIndex].skuprops_values.findIndex(p => p.id === x.id)
    if (x.id < 1) {
      this.setState(update(this.state, {
        data: {
          [`${pIndex}`]: {
            skuprops_values: {
              $splice: [[iIndex, 1]]
            }
          }
        }
      }))
    } else {
      startLoading()
      ZPost('XyComm/CustomKindSkuProps/DelSkuPropsValues', {ID: x.id}, () => {
        this.setState(update(this.state, {
          data: {
            [`${pIndex}`]: {
              skuprops_values: {
                $splice: [[iIndex, 1]]
              }
            }
          }
        }))
      }).then(endLoading)
    }
  },
  handleCreate(size) {
    const vv = this.props.form.getFieldsValue()
    const keys = Object.keys(vv)
    const cer = {}
    const aer = {}
    for (let c1 of keys) {
      let cc = vv[c1]
      let keys = Object.keys(cc)
      aer[c1] = []
      for (let c2 of keys) {
        let keys = c2.split('.')
        let [, c4] = keys
        if (c4 === 'mapping' && cc[c2]) {
          aer[c1].push(cc[c2])
        }
      }
    }
    for (let c1 of keys) {
      let cc = vv[c1]
      let c = 1
      let keys = Object.keys(cc)
      for (let c2 of keys) {
        let keys = c2.split('.')
        let [c3, c4] = keys
        if (c4 === 'mapping' && !cc[c2]) {
          let v = preZeroFill(c++, size)
          if (aer[c1].length) {
            while (aer[c1].indexOf(v) !== -1) {
              v = preZeroFill(c++, size)
            }
          }
          cer[`${c1}.${c3}.mapping`] = v
        }
      }
    }
    if (Object.keys(cer).length) {
      this.props.form.setFieldsValue(cer)
    }
  },
  handleClear() {
    const vv = this.props.form.getFieldsValue()
    const keys = Object.keys(vv)
    const cer = {}
    for (let a1 of keys) {
      let cc = vv[a1]
      let keys = Object.keys(cc)
      for (let a2 of keys) {
        let keys = a2.split('.')
        let [a3, a4] = keys
        if (a4 === 'mapping' && cc[a2]) {
          cer[`${a1}.${a3}.mapping`] = ''
        }
      }
    }
    if (Object.keys(cer).length) {
      this.props.form.setFieldsValue(cer)
    }
  },
  render() {
    //console.log('rending, damnit')
    return (
      <div className={styles.main}>
        <Row type='flex'>
          <Col span={12} style={{overflow: 'auto'}}>
            <Form inline className='pos-form'>
              <div className={`${styles.leftCol}`}>
                <div className={styles.item}>
                  <div className={styles.left} />
                  <div className={styles.right}>
                    <div className={styles.zhang}>
                      <span className={styles.op1}>
                        属性
                      </span>
                      <span className={styles.op2}>
                        属性映射值
                      </span>
                      <span className={styles.op3}>
                        操作
                      </span>
                    </div>
                  </div>
                </div>
                {this.state.data.length ? this.state.data.map(x => (
                  <div key={x.pid} className={styles.item}>
                    <div className={styles.left}>
                      <h3>{x.name}</h3>
                      <div>{x.KindNames}</div>
                    </div>
                    <div className={styles.right}>
                      <div className={styles.chun}>
                        {this.heyJude(x.skuprops_values)}
                      </div>
                      <div className={styles.hua}>
                        <Button type='primary' size='small' onClick={() => this.handleAdd(x.pid)}>增加自定义</Button>
                      </div>
                      <div className='hr' />
                    </div>
                  </div>
                )) : null}
              </div>
            </Form>
          </Col>
          <Col span={12}>
            <div className='ml10'>
              <div>
                <Button type='primary' onClick={this.handleSubmit}>
                  保存
                </Button>
              </div>
              <div className='clearfix mt20'>
                <ButtonGroup>
                  <Button type='ghost' onClick={() => this.handleCreate(2)}>
                    生成两位属性映射值
                  </Button>
                  <Button type='ghost' onClick={() => this.handleCreate(3)}>
                    生成三位属性映射值
                  </Button>
                  <Button onClick={this.handleClear}>
                    清空属性映射值
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
})))
