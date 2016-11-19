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
import update from 'react-addons-update'
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
      display: this.props.value.display,
      goodscode: this.props.value.goodscode
    }
  },
  componentDidMount() {
    //this._firstl()
  },
  componentWillReceiveProps(nextProps) {
    
      this._firstl(nextProps.value)
    
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  handleCreateNO() {
    let items = this.state.items
    let keys = Object.keys(items)
    for (let id of keys) {
      items[id].SkuID = this.props.value.fieldv.GoodsCode + id
    }
    this.setState({
      //reflash: false,
      items: items
    })
    // this.props.onChange && this.props.onChange({
    //   fieldv: this.props.value.fieldv,
    //   items: items
    // })
  },
  handleCreateSku() {
    let items = this.state.items
    let keys = Object.keys(items)
    for (let id of keys) {
      items[id].SkuID = this.props.value.fieldv.GoodsCode + items[id].Color + items[id].Size
    }
    this.setState({
      reflash: false,
      items: items
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
      items[id].SkuID = this.props.value.fieldv.GoodsCode + Cm + Sm
    }
    this.setState({
      reflash: false,
      items: items
    })
    this.props.onChange && this.props.onChange({
      fieldv: this.props.value.fieldv,
      items: items
    })
  },
  handleCleanSku() {
    this.props.onChange && this.props.onChange({
      items: [],
      fieldv: this.props.value.fieldv
    })
  },
  inputChange(e, field, i) {
    let items = this.state.items
    items[i][field] = e.target.value
    items[i]['isedit'] = true
    this.setState({
      items: items
    })
  },
  _firstl(_v) {
    console.log(_v)
    const vv = Object.assign({}, this.props.value || {}, _v || {})
    const v = vv.fieldv
    const keys1 = Object.keys(v)
    let skuprops = []
    for (let id of keys1) {
      if (v[id] === undefined) continue
      let cc = v[id]
      if (typeof cc === 'object') {
        let a = id.split('-')
        if (a[0] === 'sku') {
          if (!cc.checked) continue
          if (id.indexOf('--') > -1) { //自定义规格
            let selfSku = id.split('-')
            skuprops.push({
              pid: selfSku[3],
              val_id: 0,
              mapping: 0,
              fname: cc.fname,
              val_name: cc.value
            })
          } else {
            skuprops.push({
              pid: a[2],
              val_id: a[1],
              mapping: a[3],
              fname: cc.fname,
              val_name: cc.value
            })
          }
        }
      }
    }

    //console.log(skuprops)
    let items = []
    let catalog = []
    for (let sku of skuprops) {
      for (let s2 of skuprops) {
        if (sku.pid !== s2.pid) {
          catalog.findIndex(x => x === s2.pid) > -1 ? null : (catalog.push(s2.pid))
          if (items.findIndex(x => (x.Pid1 === s2.pid && x.Pid2 === sku.pid)) === -1) {
            let skuid = ''
            if (vv.cmd === 'handleCreateMap') {
              skuid = v.GoodsCode + sku.mapping + s2.mapping
            }
            let lt = this.state.items.find(x => x.Color === sku.val_name && x.Size === s2.val_name)
            let item = { }
            if (lt !== undefined) {
              item = {
                Color: sku.val_name,
                Size: s2.val_name,
                SalePrice: lt.SalePrice !== undefined && lt.isedit ? lt.SalePrice : v.SalePrice,
                PurPrice: lt.PurPrice !== undefined && lt.isedit ? lt.PurPrice : v.PurPrice,
                Weight: lt.Weight !== undefined && lt.isedit ? lt.Weight : v.Weight,
                SkuID: skuid,
                BarCode: lt.BarCode !== undefined && lt.isedit ? lt.BarCode : '',
                UniqueCode: lt.UniqueCode !== undefined && lt.isedit ? lt.UniqueCode : '',
                ColorMapping: sku.mapping,
                SizeMapping: s2.mapping,
                Pid1: sku.pid,
                val_id1: sku.val_id,
                Pid2: s2.pid,
                val_id2: s2.val_id,
                isedit: lt.isedit
              }
            } else {
              item = {
                Color: sku.val_name,
                Size: s2.val_name,
                SalePrice: v.SalePrice,
                PurPrice: v.PurPrice,
                Weight: v.Weight,
                SkuID: skuid,
                BarCode: '',
                UniqueCode: '',
                ColorMapping: sku.mapping,
                SizeMapping: s2.mapping,
                Pid1: sku.pid,
                val_id1: sku.val_id,
                Pid2: s2.pid,
                val_id2: s2.val_id,
                isedit: false
              }
            }
            items.push(item)
          }
        }
      }
    }
    if (this.props.value.skupid !== 0 && this.props.value.skupid === catalog.length) {
      this.setState({
        display: 'block'
      })
    }
    this.setState({
      items: items
    })

    //console.log(this.state.display)
  },
  render() {
    return (
      <div>
        <table className={styles.items} style={{display: this.state.display}}>
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
            {this.state.items.map((y, index) =>
              <tr key={`tr+${index}`} className={styles.chun}>
                <td><Input value={`${y.Color === undefined ? y.Norm.split(';')[0] : y.Color}`} /></td>
                <td><Input value={`${y.Size === undefined ? y.Norm.split(';')[1] : y.Size}`} /></td>
                <td><Input value={`${y.SalePrice}`} onChange={(e) => this.inputChange(e, 'Weight', index)} /></td>
                <td><Input value={`${y.PurPrice}`} onChange={(e) => this.inputChange(e, 'Weight', index)} /></td>
                <td><Input value={`${y.Weight}`} onChange={(e) => this.inputChange(e, 'Weight', index)} /></td>
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
