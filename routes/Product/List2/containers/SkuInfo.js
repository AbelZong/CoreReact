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
//import update from 'react-addons-update'
import {
  connect
} from 'react-redux'
import {
  Input, Tag, Button, Table, InputNumber
} from 'antd'
import styles from './index.scss'

const NUM = new RegExp(/^(0|[1-9]\d*)(\.\d{0,2})?$/)
const SkuInfo = React.createClass({
  getInitialState() {
    return {
      skuprops: this.props.value.skuprops,
      items: this.props.value.items,
      catalogs: [],
      goodscode: this.props.value.goodscode
    }
  },
  componentDidMount() {
    this._firstload()
    //this._firstl()
  },
  componentWillReceiveProps(nextProps) {
    this._firstload(nextProps.value)
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  handleCreateNO() {
    let items = this.state.items
    let keys = Object.keys(items)
    for (let id of keys) {
      items[id].SkuID = this.state.goodscode + id
      items[id].isedit = true
    }
    this.setState({
      items: items
    }, () => this.props.callbackParent(this.state.items))
  },
  handleCreateSku() {
    let items = this.state.items
    let keys = Object.keys(items)
    let l = this.state.catalogs.length
    for (let id of keys) {
      items[id].SkuID = this.state.goodscode
      for (let i = 0; i < l; i++) {
        items[id].SkuID += items[id][`sku${i}`]
      }
      items[id].isedit = true
    }
    this.setState({
      items: items
    }, () => this.props.callbackParent(this.state.items))
  },
  handleCreateMap() {
    let items = this.state.items
    let keys = Object.keys(items)
    let l = this.state.catalogs.length
    for (let id of keys) {
      items[id].SkuID = this.state.goodscode
      for (let i = 0; i < l; i++) {
        const Cm = items[id][`mapping${i}`] === 0 ? items[id][`sku${i}`] : items[id][`mapping${i}`]
        items[id].SkuID += Cm
      }
      items[id].isedit = true
    }
    this.setState({
      items: items
    }, () => this.props.callbackParent(this.state.items))
  },
  handleCleanSku() {
    let items = this.state.items
    for (let i of items) {
      i.SkuID = ''
    }
    this.setState({
      items: items
    }, () => this.props.callbackParent(this.state.items))
  },
  inputChange(e, field, i) {
    let items = this.state.items
    let iIndex = items.findIndex(x => Object.is(x, i))
    if (e.target.value === '' || NUM.test(e.target.value)) {
      items[iIndex][field] = e.target.value
    } else {
      items[iIndex][field] = 0.00
    }
    items[iIndex]['isedit'] = true
    this.setState({
      items: items
    })
  },
  descartes(args) {
    var rs = []
    // A. 校验并转换为JS数组
    for (var i = 0; i < args.length; i++) {
      if (!(args[i] instanceof Array)) {
        return false  // 参数必须为数组
      }
    }
    // 两个笛卡尔积换算
    var bothDescartes = function(m, n) {
      var r = []
      for (let i = 0; i < m.length; i++) {
        for (var ii = 0; ii < n.length; ii++) {
          var t = []
          if (m[i] instanceof Array) {
            t = m[i].slice(0)  //此处使用slice目的为了防止t变化，导致m也跟着变化
          } else {
            t.push(m[i])
          }
          t.push(n[ii])
          r.push(t)
        }
      }
      return r
    }
    // 多个笛卡尔基数换算
    for (let i = 0; i < args.length; i++) {
      if (i === 0) {
        rs = args[i]
      } else {
        rs = bothDescartes(rs, args[i])
      }
    }
    return rs
  },
  ObjectEqual(item, source) {
    let index = 0
    for (let key in source) {
      if (item[key] && source[key] === item[key]) {
        index++
      }
    }
    return index === Object.keys(source).length
  },
  _firstload(_v) {
    const v = Object.assign({}, this.props.value || {}, _v || {})
    let items = []
    let beforeItems = this.state.items
    let itemsDecar = []
    let catalogs = [] //sku 栏位
    let skuprops = v.skuprops
    //.console.log('this.props.value', skuprops)
    for (let prop in skuprops) {
      catalogs.push({
        title: skuprops[prop].name,
        dataIndex: 'sku' + prop,
        key: 'sku' + prop
      })
      const item = []
      for (let p of skuprops[prop].children0) {
        if (p.Enable === 1 || p.Enable === true) {
          item.push({
            val_name: p.val_name,
            val_id: p.val_id,
            pid: p.pid,
            mapping: p.mapping
          })
        }
      }
      for (let p of skuprops[prop].children1) {
        if (p.Enable === 1 || p.Enable === true) {
          item.push({
            val_name: p.val_name,
            val_id: p.val_id,
            pid: p.pid,
            mapping: p.mapping
          })
        }
      }
      itemsDecar.push(item)
    }
    let _descartes = this.descartes(itemsDecar)
    for (let decar of _descartes) {
      let _it
      for (let id in decar) {
        _it = Object.assign({}, _it, {
          [`sku${id}`]: decar[id].val_name,
          [`pid${id}`]: decar[id].pid,
          [`val_id${id}`]: decar[id].val_id,
          [`mapping${id}`]: decar[id].mapping
        })
      }
      items.push(_it)
    }
    for (let it in items) {
      let beforeItem = beforeItems.length > 0 ? beforeItems.find(x => this.ObjectEqual(x, items[it])) : undefined
      if (beforeItem !== undefined) {
        items[it]['SalePrice'] = beforeItem.isedit ? beforeItem.SalePrice : 0.00
        items[it]['PurPrice'] = beforeItem.isedit ? beforeItem.PurPrice : 0.00
        items[it]['Weight'] = beforeItem.isedit ? beforeItem.Weight : 0.00
        items[it]['SkuID'] = ''
        items[it]['BarCode'] = ''
        items[it]['UniqueCode'] = ''
        items[it]['isedit'] = true
      } else {
        items[it]['SalePrice'] = 0.00
        items[it]['PurPrice'] = 0.00
        items[it]['Weight'] = 0.00
        items[it]['SkuID'] = ''
        items[it]['BarCode'] = ''
        items[it]['UniqueCode'] = ''
      }
    }
    this.setState({
      catalogs: catalogs,
      items: items
    }, () => this.props.callbackParent(this.state.items))
  },
  render() {
    const columns = this.state.catalogs.concat([{
      title: '基本售价',
      dataIndex: 'SalePrice',
      key: 'SalePrice',
      width: 80,
      render: (text, index) => (<Input value={text} width={100} onChange={e => this.inputChange(e, 'SalePrice', index)} />)
    }, {
      title: '采购成本价',
      dataIndex: 'PurPrice',
      key: 'PurPrice',
      width: 100,
      render: (text, index) => (<Input value={text} width={100} onChange={e => this.inputChange(e, 'PurPrice', index)} />)
    }, {
      title: '重量',
      dataIndex: 'Weight',
      key: 'Weight',
      width: 80,
      render: (text, index) => (<Input value={text} width={100} onChange={e => this.inputChange(e, 'Weight', index)} />)
    }, {
      title: '商品编码',
      dataIndex: 'SkuID',
      key: 'SkuID'
    }, {
      title: '条形码',
      dataIndex: 'BarCode',
      key: 'BarCode'
    }, {
      title: '唯一码前缀',
      dataIndex: 'UniqueCode',
      key: 'UniqueCode'
    }, {
      title: '操作',
      key: 'action',
      render: text => (<a href='' target='_blank'>查看线上</a>)
    }])
    return (
      <Table columns={columns} pagination={false} size='small' dataSource={this.state.items} footer={() => <div>
        <Button className={styles.btn} type='ghost' onClick={this.handleCreateNO}>生成商品编码（流水号）</Button>
        <Button className={styles.btn} type='ghost' onClick={this.handleCreateSku}>生成商品编码（颜色规格）</Button>
        <Button className={styles.btn} type='ghost' onClick={this.handleCreateMap}>生成商品编码（颜色规格映射）</Button>
        <Button className={styles.btn} type='ghost' onClick={this.handleCleanSku}>清空商品编码</Button>
      </div>} />
    )
  }
})
export default connect()(SkuInfo)
