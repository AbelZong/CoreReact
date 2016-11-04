/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-03 15:51:14
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
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
import { Form, Input, Modal, Radio, Row, Col, Button, InputNumber, Switch, Checkbox, Popconfirm, message, Icon, Tree } from 'antd'
//import Modal from 'components/Modal/DragModal'
import {connect} from 'react-redux'
import {ZGet, ZPost} from 'utils/Xfetch'
import EE from 'utils/EE'
import {startLoading, endLoading, listToTree} from 'utils'
const createForm = Form.create
import styles from './index.scss'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const ButtonGroup = Button.Group
import ZGrid from 'components/Grid/index'
const TreeNode = Tree.TreeNode
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
        startLoading()
        return ZGet({
          uri: 'XyComm/Customkind/SkuKind',
          data: {
            id: nextProps.doge
          },
          success: ({d}) => {
            this.props.form.setFieldsValue({
              //id: d.ID,
              s1: d.KindName,
              s2: d.Order,
              s3: d.Enable
            })
            this.setState(Object.assign({}, DEF_STATES, {
              title: `修改 ID: ${d.ID}`,
              visible: true,
              confirmLoading: false,
              doge: d.ID
            }))
          },
          error: () => {
            this.props.dispatch({type: 'PRODUCT_CAT_VIS_SET', payload: 0})
          }
        }).then(endLoading)
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
      if (errors) {
        return false
      }
      this.setState({
        confirmLoading: true
      })
      const data = {
        KindName: values.s1,
        Order: values.s2,
        Enable: 'true',
        mode: values.s3
      }
      if (values.s3 === '2') {
        data.NormLst = values.s4 ? values.s4.split(/,|，/) : []
      }
      this.props.modalCB2(data, () => {
        this.hideModal()
      }, () => {
        this.setState({
          confirmLoading: false
        })
      })
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
  // <Col span={10} className={styles.fucker}>
  //   <FormItem {...{
  //     labelCol: { span: 8 },
  //     wrapperCol: { span: 16 }
  //   }} label='父分类'>
  //     {getFieldDecorator('Link')(
  //       <Input type='text' disabled size='small' />
  //     )}
  //   </FormItem>
  // </Col>
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
                    <Input type='text' />
                  )}
                </Col>
              </FormItem>
              <FormItem {...formItemLayout} label='排序'>
                <Col span={8}>
                  {getFieldDecorator('s2', {
                    initialValue: 0
                  })(
                    <InputNumber min={1} />
                  )}
                </Col>
                <Col span={10} className={styles.fucker}>
                  <FormItem {...{
                    labelCol: { span: 8 },
                    wrapperCol: { span: 16 }
                  }} label='状态'>
                    {getFieldDecorator('s3', {
                      valuePropName: 'checked',
                      initialValue: true
                    })(
                      <Switch />
                    )}
                  </FormItem>
                </Col>
              </FormItem>
              <FormItem wrapperCol={{ span: 18, offset: 3 }}>
                <Button type='primary' onClick={() => {
                  this.props.form.validateFields((errors, values) => {
                    if (errors) {
                      return false
                    }
                    this.setState({
                      confirmLoading: true
                    })
                    ZPost('XyComm/Customkind/UpdateSkuKind', {
                      ID: this.props.doge,
                      KindName: values.s1,
                      Order: values.s2,
                      Enable: values.s3
                    }, () => {
                      EE.triggerRefreshMain()
                    }).then(() => {
                      this.setState({
                        confirmLoading: false
                      })
                    })
                  })
                }} size='small' loading={this.state.confirmLoading}>保存</Button>
              </FormItem>
            </Form>
            <div className='hr' />
            <Props cat_id={doge} />
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
            {this.state.nihong === 2 ? (
              <div>
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
            ) : null}
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
    this.props.api.gridOptionsWrapper.gridOptions.grid.grid.x0pCall(ZPost('XyComm/CustomKindProps/UpdateSkuPropsEnable', {
      IDLst: [this.props.data.id],
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
const PropOperatorsRender = React.createClass({
  handleEditClick(e) {
    e.stopPropagation()
    const Yyah = this.props.api.gridOptionsWrapper.gridOptions
    Yyah.grid.modifyRowByID(this.props.data.id)
  },
  render() {
    return (
      <div className='operators'>
        <Icon type='edit' onClick={this.handleEditClick} />
      </div>
    )
  }
})
//
const CopyDefault = {
  cats: [],
  visible: false,
  confirmLoading: false
}
const Copy = connect(state => ({
  youthethief: state.product_cat_prop_copy_vis
}))(React.createClass({
  getInitialState() {
    this.youthethief = []
    this.thief = 1
    return CopyDefault
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.youthethief !== this.props.youthethief) {
      this.youthethief = []
      this.thief = 1
      if (nextProps.youthethief === null) {
        return this.setState({
          visible: false
        })
      }
      startLoading()
      ZGet('XyComm/CustomKindProps/CopyToKindLst', ({d}) => {
        if (!d || !d.length) {
          message.error('not cats')
          this.props.dispatch({type: 'PRODUCT_CAT_PROP_COPY_VIS_SET', payload: null})
          return
        }
        const cats = listToTree(d, {
          idKey: 'ID',
          parentKey: 'ParentID',
          childrenKey: 'Children'
        })
        this.setState(Object.assign({}, CopyDefault, {
          visible: true,
          cats
        }))
      }).then(endLoading)
    }
  },
  hideModal() {
    this.props.dispatch({type: 'PRODUCT_CAT_PROP_COPY_VIS_SET', payload: null})
  },
  handleSubmit() {
    const data = {
      Type: this.thief,
      KindIDLst: this.youthethief,
      IDLst: this.props.youthethief
    }
    this.setState({
      confirmLoading: true
    })
    ZPost('XyComm/CustomKindProps/SaveCopyToProps', data, () => {
      this.hideModal()
    }, () => {
      this.setState({
        confirmLoading: true
      })
    })
  },
  handleChange(e) {
    this.thief = e.target.value
  },
  handleCheck(e) {
    this.youthethief = e
  },
  render() {
    const {visible, cats} = this.state
    const radioStyle = {
      display: 'block'
    }
    const loop = data => data.map(item => {
      const key = item.ID * 1
      const title = item.KindName + (item.Enable ? '' : 'x')
      if (item.Children instanceof Array && item.Children.length) {
        return (
          <TreeNode key={key} title={title}>
            {loop(item.Children)}
          </TreeNode>
        )
      }
      return <TreeNode key={key} title={title} />
    })
    return (
      <Modal title='请选择复制方式与目标类目' visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={this.state.confirmLoading} width={700}>
        <div className={styles.cp_method}>
          <RadioGroup onChange={this.handleChange} defaultValue={this.thief}>
            <Radio style={radioStyle} key='1' value={1}>添加到目标类目原有属性列表中，碰到相同的属性（以属性号为判断依据）则直接覆盖</Radio>
            <Radio style={radioStyle} key='2' value={2}>禁用目标类目原有所有属性列表，添加新的属性，碰到相同的类目则直接覆盖（包括启用禁用）</Radio>
          </RadioGroup>
        </div>
        <div className={`${styles.cp_targets} h-scroller`}>
          <Tree multiple autoExpandParent onSelect={this.handleCheck}>
            {cats.length ? loop(cats) : null}
          </Tree>
        </div>
      </Modal>
    )
  }
}))
const Props = connect()(React.createClass({
  componentDidMount() {
    this.conditions = {
      Enable: 'true'
    }
    this.refreshDataCallback()
  },
  handleNew() {
    this.props.dispatch({type: 'PRODUCT_CAT_PROP_VIS_SET', payload: 0})
  },
  refreshDataCallback() {
    ZGet('XyComm/Customkind/SkuKindProps', {
      ID: this.props.cat_id,
      Enable: this.conditions.Enable
    }, ({d}) => {
      this.grid.setDatasource({
        rowData: d
      })
    })
  },
  modifyRowByID(id) {
    this.props.dispatch({type: 'PRODUCT_CAT_PROP_VIS_SET', payload: id})
  },
  handleConfirm(data, flag, successCB, errorCB) {
    if (flag) {
      ZPost('XyComm/CustomKindProps/InsertSkuProps', data, () => {
        successCB && successCB()
        this.refreshDataCallback()
      }, () => errorCB && errorCB())
    } else {
      ZPost('XyComm/CustomKindProps/UpdateSkuProps', data, () => {
        successCB && successCB()
        this.refreshDataCallback()
      }, () => errorCB && errorCB())
    }
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleEnable() {
    const ids = this.grid.api.getSelectedRows().map(x => x.id)
    if (!ids || !ids.length) {
      message.info('请先选择')
    }
    this.grid.x0pCall(ZPost('XyComm/CustomKindProps/UpdateSkuPropsEnable', {
      IDLst: ids,
      Enable: true
    }, () => {
      this.refreshDataCallback()
    }))
  },
  handleDisable() {
    const ids = this.grid.api.getSelectedRows().map(x => x.id)
    if (!ids || !ids.length) {
      message.info('请先选择')
    }
    this.grid.x0pCall(ZPost('XyComm/CustomKindProps/UpdateSkuPropsEnable', {
      IDLst: ids,
      Enable: false
    }, () => {
      this.refreshDataCallback()
    }))
  },
  handleCopy() {
    const ids = this.grid.api.getSelectedRows().map(x => x.id)
    if (!ids || !ids.length) {
      return message.info('请先选择')
    }
    this.props.dispatch({type: 'PRODUCT_CAT_PROP_COPY_VIS_SET', payload: ids})
  },
  render() {
    return (
      <div className='flex-column'>
        <div className={styles.propsSearch}>
          <div className='pull-right'>
            属性检索：<Checkbox.Group options={[
                { label: '启用', value: '1' },
                    { label: '禁用', value: '2' }
            ]} defaultValue={['1']} onChange={(e) => {
              this.conditions.Enable = e.length === 1 ? String(e[0] === '1') : 'all'
              this.refreshDataCallback()
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
            field: 'pid',
            cellStyle: {textAlign: 'center'},
            width: 120,
            suppressMenu: true
          }, {
            headerName: '名称',
            field: 'name',
            width: 144,
            suppressMenu: true
          }, {
            headerName: '排序',
            field: 'Order',
            width: 70,
            cellStyle: {textAlign: 'center'},
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
            field: 'ValLst',
            width: 360,
            suppressMenu: true,
            cellRenderer: function(params) {
              return params.data.ValLst instanceof Array ? params.data.ValLst.join(',') : ''
            }
          }, {
            headerName: '操作',
            width: 80,
            cellRendererFramework: PropOperatorsRender,
            suppressMenu: true
          }]} columnsFited grid={this} height={360}>
          批量：
          <ButtonGroup>
            <Popconfirm title='确定要启用吗？' onConfirm={this.handleEnable}>
              <Button type='primary' size='small'>启用</Button>
            </Popconfirm>
            <Popconfirm title='确定要禁用吗？' onConfirm={this.handleDisable}>
              <Button type='ghost' size='small'>禁用</Button>
            </Popconfirm>
          </ButtonGroup>&emsp;
          <Button type='dashed' size='small' onClick={this.handleCopy}>复制属性到其它类目</Button>
        </ZGrid>
        <Props2 onConfirm={this.handleConfirm} cat_id={this.props.cat_id} />
        <Copy />
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
const Props2 = connect(state => ({
  doge: state.product_cat_prop_vis
}))(createForm()(React.createClass({
  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      title: '新建类目的商品属性',
      field1: true
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
          uri: 'XyComm/CustomKindProps/SkuKindProp',
          data: {
            ID: nextProps.doge
          },
          success: ({d}) => {
            this.props.form.setFieldsValue({
              s1: d.name,
              s2: d.Order,
              s3: d.Enable,
              s4: d.ValLst instanceof Array ? d.ValLst.join(',') : ''
            })
            this.setState({
              title: `修改商品属性：[${d.id}]`,
              visible: true,
              confirmLoading: false,
              field1: true //todo
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
      const ValLst = values.s4 ? values.s4.split(/,|，/) : []
      const data = {
        kindid: this.props.cat_id,
        name: values.s1,
        Order: values.s2,
        is_input_prop: values.s3,
        ValLst
      }
      if (this.props.doge === 0) {
        this.props.onConfirm(data, true, () => {
          this.hideModal()
        }, () => {
          this.setState({
            confirmLoading: false
          })
        })
      } else {
        data.id = this.props.doge
        this.props.onConfirm(data, false, () => {
          this.hideModal()
        }, () => {
          this.setState({
            confirmLoading: false
          })
        })
      }
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
    // { validator: (rule, value, callback) => {
    //   const form = this.props.form
    //   console.log(value, form.getFieldValue('s3'))
    //   if (!value && !form.getFieldValue('s3')) {
    //     form.validateFields(['s4'], { force: true })
    //     callback('Two passwords you enter is inconsistent!')
    //   } else {
    //     callback()
    //   }
    // } }
    return (
      <Modal title={this.state.title} visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal} confirmLoading={this.state.confirmLoading}>
        <Form horizontal className='pos-form'>
          <FormItem {...formItemLayout} label='名称'>
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
              <InputNumber min={0} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='可输入'>
            {getFieldDecorator('s3', {
              valuePropName: 'checked',
              initialValue: this.state.field1
            })(
              <Switch onChange={(e) => this.setState({
                field1: e
              })} />
            )}
            <span className='ml10 gray'>不可输入的话必须选择</span>
          </FormItem>
          <FormItem {...formItemLayout} label='可选属性值'>
            {getFieldDecorator('s4', {
              rules: [
                {
                  required: !this.state.field1,
                  whitespace: true,
                  message: '【可输入】没有开启，该项必填'
                }
              ]
            })(
              <Input type='textarea' autosize={{minRows: 6, maxRows: 12}} placeholder='多个使用逗号分割，单个最长100字以内' />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
})))
