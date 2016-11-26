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
  Input, Button, Table, Tooltip, message
} from 'antd'
import styles from './index.scss'

let DISPLAY = 'block'
const NUM = new RegExp(/^(0|[1-9]\d*)(\.\d{0,2})?$/)
const TIP = <span>必须，推荐为款式编码（货号）+流水号`如果为空将不保存或删除原有记录</span>
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
  },
  componentWillReceiveProps(nextProps) {
    this._firstload(nextProps.value)
  },
  componentWillUpdate(nextProps, nextState) {
    return false
  },
  handleCreateNO() {
    let items = this.state.items
    let goodscode = this.state.goodscode
    if (goodscode === undefined || goodscode === '') {
      message.error('请先填写款式编码(货号)')
      return
    }
    let keys = Object.keys(items)
    for (let id of keys) {
      if (!items[id].isSkuID) {
        items[id].SkuID = goodscode + id
        items[id].isSkuID = true
      }
    }
    this.setState({
      items: items
    }, () => this.props.callbackParent(this.state.items))
  },
  handleCreateSku() {
    let items = this.state.items
    let keys = Object.keys(items)
    let l = this.state.catalogs.length
    let goodscode = this.state.goodscode
    if (goodscode === undefined || goodscode === '') {
      message.error('请先填写款式编码(货号)')
      return
    }
    for (let id of keys) {
      if (!items[id].isSkuID) {
        items[id].SkuID = goodscode
        for (let i = 0; i < l; i++) {
          items[id].SkuID += items[id][`sku${i}`]
        }
        items[id].isSkuID = true
      }
    }
    this.setState({
      items: items
    }, () => this.props.callbackParent(this.state.items))
  },
  handleCreateMap() {
    let items = this.state.items
    let keys = Object.keys(items)
    let l = this.state.catalogs.length
    let goodscode = this.state.goodscode
    if (goodscode === undefined || goodscode === '') {
      message.error('请先填写款式编码(货号)')
      return
    }
    for (let id of keys) {
      if (!items[id].isSkuID) {
        items[id].SkuID = goodscode
        for (let i = 0; i < l; i++) {
          const Cm = items[id][`mapping${parseInt(i) + 1}`] === 0 ? items[id][`sku${i}`] : items[id][`mapping${parseInt(i) + 1}`]
          items[id].SkuID += Cm
        }
        items[id].isSkuID = true
      }
    }
    this.setState({
      items: items
    }, () => this.props.callbackParent(this.state.items))
  },
  handleCleanSku() {
    let items = this.state.items
    for (let i of items) {
      i.SkuID = ''
      i.isedit = false
      i.isSkuID = false
    }
    this.setState({
      items: items
    }, () => this.props.callbackParent(this.state.items))
  },
  inputChange(e, field, i) {
    let items = this.state.items
    let iIndex = items.findIndex(x => Object.is(x, i))
    if (field === 'SkuID' || field === 'BarCode') {
      items[iIndex][field] = e.target.value
      items[iIndex]['isSkuID'] = true
    } else {
      if (e.target.value === '' || NUM.test(e.target.value)) {
        items[iIndex][field] = e.target.value
      } else {
        items[iIndex][field] = 0.00
      }
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
  ItemEqual(item, source) {
    if (item.Norm === undefined) {
      let index = 0
      for (let key in source) {
        if (item[key] && source[key] === item[key]) {
          index++
        }
      }
      return index === Object.keys(source).length
    } else {
      let NormT = ''
      for (let i = 0; i < this.state.skuprops.length; i++) {
        NormT += source[`sku${i}`] + ';'
      }
      if (NormT.substring(0, NormT.length - 1) === item.Norm) {
        return true
      } else {
        return false
      }
    }
  },
  _firstload(_v) {
    const v = Object.assign({}, this.props.value || {}, _v || {})
    let beforeItems = this.state.items.length === 0 ? v.items : this.state.items
    let itemsDecar = []
    let catalogs = [] //sku 栏位
    let skuprops = v.skuprops

    if (skuprops.length === 0) {
      DISPLAY = 'none'
    } else {
      DISPLAY = 'block'
    }
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
    let items = []
    for (let decar of _descartes) {
      let _ite = {}
      for (let id in decar) {
        _ite = Object.assign({}, _ite, {
          [`sku${id}`]: decar[id].val_name,
          [`pid${parseInt(id) + 1}`]: decar[id].pid,
          [`val_id${parseInt(id) + 1}`]: decar[id].val_id,
          [`mapping${parseInt(id) + 1}`]: decar[id].mapping
        })
      }
      items.push(_ite)
    }
    for (let it in items) {
      let beforeItem = beforeItems.length > 0 ? beforeItems.find(x => this.ItemEqual(x, items[it])) : undefined
      if (beforeItem !== undefined) {
        items[it]['SalePrice'] = beforeItem.isedit ? beforeItem.SalePrice : 0.00
        items[it]['PurPrice'] = beforeItem.isedit ? beforeItem.PurPrice : 0.00
        items[it]['Weight'] = beforeItem.isedit ? beforeItem.Weight : 0.00
        items[it]['SkuID'] = beforeItem.isSkuID ? beforeItem.SkuID : ''
        items[it]['BarCode'] = beforeItem.isSkuID ? beforeItem.BarCode : ''
        items[it]['UniqueCode'] = ''
        items[it]['isedit'] = beforeItem.isedit
        items[it]['isSkuID'] = beforeItem.isSkuID
        items[it]['ID'] = beforeItem.ID !== undefined ? beforeItem.ID : 0
        items[it]['Norm'] = beforeItem.Norm
        for (let i = 0; i < this.state.skuprops.length; i++) {
          items[it][`val_id${parseInt(i) + 1}`] = beforeItem[`val_id${parseInt(i) + 1}`]
        }
      } else {
        items[it]['SalePrice'] = 0.00
        items[it]['PurPrice'] = 0.00
        items[it]['Weight'] = 0.00
        items[it]['SkuID'] = ''
        items[it]['BarCode'] = ''
        items[it]['UniqueCode'] = ''
        items[it]['ID'] = 0
      }
    }
    this.setState({
      catalogs: catalogs,
      items: items,
      goodscode: v.goodscode
    }, () => {
      this.props.callbackParent(this.state.items)
    })
  },
  render() {
    const columns = this.state.catalogs.concat([{
      title: '基本售价',
      dataIndex: 'SalePrice',
      key: 'SalePrice',
      width: 80,
      render: (text, index) => (<Input value={text} width={50} onChange={e => this.inputChange(e, 'SalePrice', index)} />)
    }, {
      title: '采购成本价',
      dataIndex: 'PurPrice',
      key: 'PurPrice',
      width: 80,
      render: (text, index) => (<Input value={text} width={50} onChange={e => this.inputChange(e, 'PurPrice', index)} />)
    }, {
      title: '重量',
      dataIndex: 'Weight',
      key: 'Weight',
      width: 60,
      render: (text, index) => (<Input value={text} width={50} onChange={e => this.inputChange(e, 'Weight', index)} />)
    }, {
      title: '商品编码',
      dataIndex: 'SkuID',
      key: 'SkuID',
      width: 120,
      render: (text, index) => (<Tooltip placement='topLeft' title={TIP}><Input value={text} width={120} onChange={e => this.inputChange(e, 'SkuID', index)} /></Tooltip>)
    }, {
      title: '条形码',
      dataIndex: 'BarCode',
      key: 'BarCode',
      width: 100,
      render: (text, index) => (<Input value={text} width={100} onChange={e => this.inputChange(e, 'BarCode', index)} />)
    }, {
      title: '唯一码前缀',
      dataIndex: 'UniqueCode',
      key: 'UniqueCode'
    }, {
      title: '操作',
      key: 'action',
      width: 80,
      render: text => (<a href='' target='_blank'>查看线上</a>)
    }])
    if (DISPLAY === 'block') {
      return (
        <Table columns={columns} pagination={false} size='small' dataSource={this.state.items} footer={() => <div>
          <Button className={styles.btn} type='ghost' onClick={this.handleCreateNO}>生成商品编码（流水号）</Button>
          <Button className={styles.btn} type='ghost' onClick={this.handleCreateSku}>生成商品编码（颜色规格）</Button>
          <Button className={styles.btn} type='ghost' onClick={this.handleCreateMap}>生成商品编码（颜色规格映射）</Button>
          <Button className={styles.btn} type='ghost' onClick={this.handleCleanSku}>清空商品编码</Button>
        </div>} />
      )
    } else {
      return (<div />)
    }
  }
})
export default connect()(SkuInfo)
