import React from 'react'
import {connect} from 'react-redux'
import {Form, Button, Input} from 'antd'
import {startLoading, endLoading} from 'utils'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import update from 'react-addons-update'
import styles from './index.scss'
const createForm = Form.create
const FormItem = Form.Item
const Main = createForm()(React.createClass({

  getInitialState() {
    return {
      visible: false,
      confirmLoading: false,
      btnDisplay: 'none',
      GoodsCode: [],
      aIndex: []
    }
  },
  handleSearch() {
    startLoading()
    this.props.form.validateFields((errors, v) => {
      const data = {
        GoodsCode: v.GoodsCode ? v.GoodsCode : '',
        ScoGoodsCode: v.ScoGoodsCode ? v.ScoGoodsCode : '',
        SkuID: v.SkuID ? v.SkuID : ''
      }
      ZGet({
        uri: 'XyCore/CoreSku/GetPrintGoodsCode',
        data: data,
        success: ({d}) => {
          this.setState({
            GoodsCode: d,
            aIndex: [],
            SkuProps: [],
            btnDisplay: 'none'
          })
        }}).then(endLoading)
    })
  },
  handleGoods(e, id) {
    this.setState({
      aIndex: [],
      SkuProps: []
    })
    ZGet({
      uri: 'XyCore/CoreSku/GetPrintSkuProps',
      data: {ID: id},
      success: ({d}) => {
        const SkuProps = {}
        if (Object.values(d.DicSkuProps).length > 0 || Object.values(d.SkuProps).length > 0) {
          Object.keys(d.DicSkuProps).forEach((k) => {
            let Props = []
            for (let sku of d.SkuProps) {
              if (k === sku.pid) {
                Props.push({
                  id: sku.ID,
                  val_id: sku.val_id,
                  val_name: sku.val_name
                })
              }
            }
            SkuProps[k] = {
              name: d.DicSkuProps[k],
              id: k,
              Props: Props
            }
          })
          const aIndex = this.state.aIndex
          const aI = aIndex.findIndex(x => x.indexOf('货号') > -1)
          if (aI > -1) {
            this.setState(update(this.state, {
              aIndex: {[`${aI}`]: {$apply: function(x) { return '货号-' + id }}}
            }, {
              SkuProps: {0: {$apply: function(x) { return Object.values(SkuProps) }}}
            }, {
              btnDisplay: {0: {$apply: function(x) { return 'none' }}}
            })
            )
          } else {
            aIndex.push('货号-' + id)
            this.setState({
              aIndex: aIndex,
              SkuProps: Object.values(SkuProps),
              btnDisplay: 'none'
            })
          }
        } else {
          this.setState({
            btnDisplay: 'inline-block'
          })
        }
      }}).then(endLoading)
  },
  handleSku(label, id) {
    const aIndex = this.state.aIndex
    const aI = aIndex.findIndex(x => x.indexOf(label) > -1)
    if (aI > -1) {
      this.setState(update(this.state, {
        aIndex: {[`${aI}`]: {$apply: function(x) { return label + '-' + id }}}
      })
      )
    } else {
      aIndex.push(label + '-' + id)
      this.setState({
        aIndex: aIndex
      })
    }
    if (this.state.aIndex.length !== 0 && (this.state.SkuProps.length + 1) === this.state.aIndex.length) {
      this.setState({
        btnDisplay: 'inline-block'
      })
    }
  },
  handleReset(e) {
    e.preventDefault()
    this.props.form.resetFields()
    this.setState({
      GoodsCode: [],
      aIndex: [],
      SkuProps: [],
      btnDisplay: 'none'
    })
    this.runSearching()
  },
  printTag() {
    window.open('/page/print/modify?my_id=3')
  },
  skuAttr() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    }
    const {SkuProps, aIndex} = this.state
    return (
      <div>
        { SkuProps && SkuProps.length ? SkuProps.map((x, index) => {
          return (
            <FormItem {...formItemLayout} key={x.id} label={x.name}>
              {getFieldDecorator(`sku.${index}`)(
                <div>
                  {x.Props.length ? x.Props.map((y) => {
                    return <a className={aIndex.length && aIndex.findIndex((a) => a === `${x.name}-${y.id}`) > -1 ? `${styles.aTag} ${styles.aOn}` : `${styles.aTag}`} key={y.id} onClick={() => this.handleSku(x.name, y.id)} >{y.val_name}</a>
                  }) : null}
                </div>
              )}
            </FormItem>
        ) }) : null
        }
      </div>
    )
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {GoodsCode, aIndex, btnDisplay} = this.state
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 }
    }
    return (
      <div className={styles.main}>
        <Form inline style={{marginLeft: 15}}>
          <FormItem>
            {getFieldDecorator('GoodsCode')(
              <Input placeholder='款式编码(货号)' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('ScoGoodsCode')(
              <Input placeholder='供销商货号' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('SkuID')(
              <Input placeholder='商品编码' />
            )}
          </FormItem>
          <Button type='primary' style={{marginLeft: 2}} onClick={this.handleSearch}>搜索</Button>
          <Button style={{marginLeft: 3}} onClick={this.handleReset}>重置</Button>
        </Form>
        <Form horizontal className={`${styles.form} pos-form`} >
          <FormItem {...formItemLayout} label='货号'>
            {getFieldDecorator('GoodsCode')(
              <div>
                {
                  GoodsCode.length ? GoodsCode.map((x, index) => {
                    return <a data-index={index} className={aIndex.length && aIndex.findIndex((a) => a === `货号-${x.ID}`) > -1 ? `${styles.aTag} ${styles.aOn}` : `${styles.aTag}`} key={x.ID} onClick={(e) => this.handleGoods(e, x.ID)} >{x.GoodsCode}</a>
                  }) : '(请先搜索)'
                }
              </div>
            )}
          </FormItem>
          {
            this.state.GoodsCode.length ? this.skuAttr() : null
          }
          <Button type='ghost' style={{marginLeft: 15, display: btnDisplay}} onClick={this.printTag}>打印吊牌</Button>
          <Button type='ghost' style={{marginLeft: 15, display: btnDisplay}} onClick={this.printCode}>打印件码</Button>
          <Button type='ghost' style={{marginLeft: 15, display: btnDisplay}} onClick={this.printBT}>BT打印</Button>

          <Button type='ghost' style={{marginLeft: 30}} onClick={this.editTag}>编辑吊牌模板</Button>
          <Button type='ghost' style={{marginLeft: 15}} onClick={this.editCode}>编辑件码模板</Button>
        </Form>
      </div>
    )
  }
}))

export default Main
