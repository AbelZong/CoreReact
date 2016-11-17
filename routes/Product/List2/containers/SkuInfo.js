/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: JieChen
* Date  :
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import {
  Input, Tag, Button
} from 'antd'
import styles from './index.scss'

let item = {
  Color: '',
  Size: '',
  SalePrice: 0,
  PurPrice: 0,
  Weight: 0,
  SkuID: '',
  BarCode: '',
  UniqueCode: '',
  ColorMapping: '',
  SizeMapping: '',
  Pid1: '',
  val_id1: 0,
  Pid2: '',
  val_id2: ''
}

const SkuInfo = React.createClass({
  getInitialState() {
    return {
      skuprops: this.props.value.skuprops,
      items: this.props.value.items,
      goodscode: this.props.value.goodscode
    }
  },
  componentDidMount() {
    //this._firstload()
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.value.reflash) {
      this._firstload(nextProps.value)
    }
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  handleCreateNO() {
    let items = this.state.items
    let keys = Object.keys(items)
    for (let id of keys) {
      items[id].SkuID = this.props.value.goodscode + id
    }
    this.setState({
      items: items
    })
    this.props.onChange && this.props.onChange({
      reflash: false,
      goodscode: this.props.value.goodscode,
      skuprops: this.props.value.skuprops,
      items: items
    })
  },
  handleCreateSku() {
    let items = this.state.items
    let keys = Object.keys(items)
    for (let id of keys) {
      items[id].SkuID = this.props.value.goodscode + items[id].Color + items[id].Size
    }
    this.setState({
      items: items
    })
    this.props.onChange && this.props.onChange({
      items: items,
      reflash: false,
      skuprops: this.props.value.skuprops,
      goodscode: this.props.value.goodscode
    })
  },
  handleCreateMap() {
    let items = this.state.items
    let keys = Object.keys(items)
    let Cm = ''
    let Sm = ''
    for (let id of keys) {
      items[id].ColorMapping === 0 ? Cm = items[id].Color : Cm = items[id].ColorMapping
      items[id].SizeMapping === 0 ? Sm = items[id].Size : Sm = items[id].SizeMapping
      items[id].SkuID = this.props.value.goodscode + Cm + Sm
    }
    this.setState({
      items: items
    })
    this.props.onChange && this.props.onChange({
      reflash: false,
      items: items,
      skuprops: this.props.value.skuprops,
      display: this.props.value.display,
      goodscode: this.props.value.goodscode
    })
  },
  handleCleanSku() {
    let items = this.state.items
    for (let i of items) {
      i.SkuID = ''
    }
    this.setState({
      items: items
    })
    this.props.onChange && this.props.onChange({
      items: items,
      goodscode: this.props.value.goodscode,
      skuprops: this.props.value.skuprops,
      reflash: true
    })
  },
  _firstload(_v) {
    let items = []
    let itemTemp = []
    const v = Object.assign({}, this.props.value || {}, _v || {})
    for (let p of this.state.skuprops) {
      if (p.pid === '100016110114201') { //尺码
        item.Size = p.value
        item.SizeMapping = p.mapping
        item.Pid1 = '100016110114201'
        item.val_id1 = p.val_id
        itemTemp.push(item)
        item = {
          Color: '',
          Size: '',
          SalePrice: 0,
          PurPrice: 0,
          Weight: 0,
          SkuID: '',
          BarCode: '',
          UniqueCode: '',
          ColorMapping: '',
          SizeMapping: '',
          Pid1: '',
          val_id1: 0,
          Pid2: '',
          val_id2: ''}
      }
    }
    const keys1 = Object.keys(itemTemp)
    for (let p of v.skuprops) {
      if (p.pid === '100016110194735') { //颜色
        for (let id of keys1) {
          item.Size = itemTemp[id].Size
          item.SizeMapping = itemTemp[id].SizeMapping
          item.Pid1 = itemTemp[id].Pid1
          item.val_id1 = itemTemp[id].val_id1
          item.Color = p.value
          item.ColorMapping = p.mapping
          item.Pid2 = '100016110194735'
          item.val_id2 = p.val_id
          item.PurPrice = v.purPrice === undefined ? 0 : v.purPrice
          item.SalePrice = v.salePrice === undefined ? 0 : v.salePrice
          item.Weight = v.weight === undefined ? 0 : v.weight
          items.push(item)
          item = {
            Color: '',
            Size: '',
            SalePrice: 0,
            PurPrice: 0,
            Weight: 0,
            SkuID: '',
            BarCode: '',
            UniqueCode: '',
            ColorMapping: '',
            SizeMapping: '',
            Pid1: '',
            val_id1: 0,
            Pid2: '',
            val_id2: ''}
        }
      }
    }
    this.setState({
      items: items
    })
  },
  render() {
    return (
      <div>
        <table className={styles.items} style={{display: this.props.value.display}}>
          <thead className={styles.right}>
            <tr className={styles.zhang}>
              <th className={styles.op10}>颜色分类</th>
              <th className={styles.op5}>尺码</th>
              <th className={styles.op10}>基本售价</th>
              <th className={styles.op10}>采购成本价</th>
              <th className={styles.op5}>重量</th>
              <th className={styles.op20}>商品编码</th>
              <th className={styles.op20}>商品条形码</th>
              <th className={styles.op10}>唯一码前缀</th>
              <th className={styles.op15}>操作</th>
            </tr>
          </thead>
          <tbody className={styles.right}>
            {this.state.items.map(y =>
              <tr key={Math.random() * 10000} className={styles.chun}>
                <td><Input value={`${y.Color === undefined ? y.Norm.split(';')[0] : y.Color}`} /></td>
                <td><Input value={`${y.Size === undefined ? y.Norm.split(';')[1] : y.Size}`} /></td>
                <td><Input value={`${y.SalePrice}`} /></td>
                <td><Input value={`${y.PurPrice}`} /></td>
                <td><Input value={`${y.Weight}`} /></td>
                <td><Input value={`${y.SkuID === undefined ? '' : y.SkuID}`} /></td>
                <td><Input value={`${y.BarCode === undefined ? '' : y.BarCode}`} /></td>
                <td><Input value={`${y.UniqueCode === undefined ? '' : y.UniqueCode}`} /></td>
                <td style={{textAlign: 'center'}}><Tag><a href='' target='_blank'>查看</a></Tag></td>
              </tr>
            )}
          </tbody>
        </table>
        <Button type='ghost' onClick={this.handleCreateNO}>生成商品编码（流水号）</Button>
        <Button type='ghost' onClick={this.handleCreateSku}>生成商品编码（颜色规格）</Button>
        <Button type='ghost' onClick={this.handleCreateMap}>生成商品编码（颜色规格映射）</Button>
        <Button type='ghost' onClick={this.handleCleanSku}>清空商品编码</Button>
      </div>
    )
  }
})
export default connect()(SkuInfo)
