/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-12-14 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, {
  Component
} from 'react'
import {
  Button,
  message,
  Select,
  InputNumber,
  notification
} from 'antd'
import classNames from 'classnames'
import {
  connect
} from 'react-redux'
import {
  ZGet
} from 'utils/Xfetch'
import QRious from 'qrious'
const JsBarcode = require('jsbarcode')
import update from 'react-addons-update'
import {
  getLodop
} from '3rd/Lodop'
import {
  utf16to8,
  getUriParam
} from 'utils/index'
import styles from './Modify/Preview.scss'
import stylesA from './View.scss'
const Option = Select.Option

class View extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }
  state = {
    emus: null,
    printing: false,
    setting: {
      pageW: 0, //210mm
      pageH: 0, //270
      prT: 0, //边距上
      prL: 0 //边距左
    },
    lodop_target: '',
    print_msg: null,
    printRange: {},
    print_setting: {
      machine: '-1',
      paper: '*',
      direction: '1',
      quality: 100,
      machines: [{ key: '-1', value: '选择打印机' }],
      papers: [{ key: '*', value: '纸张:自动' }],
      directions: [
        { key: '1', value: '纵向(默认)' },
        { key: '2', value: '横向打印' }
      ]
    },
    tableColumns: null,
    tableHelp: {
      minTHHeight: 24,
      minTDHeight: 24
    },
    tableStyle: {
      left: 80, //default
      top: 200 //default
    },
    bm: {
      id: null,
      type: null,
      tpls: null,
      title: ''
    }
  }
  componentWillMount() {
    const type = getUriParam('print')
    ZGet('print/tpl/getPrintSet', {
      tpl_type: type
    }, ({d}) => {
      console.log(d)
      const states = {
        setting: d.states.setting,
        tableColumns: d.states.tableColumns || [],
        bm: {
          type,
          tpls: d.tpls || [],
          title: d.title || '',
          id: d.tpl_id || null
        }
      }
      if (d.states.tableHelp) {
        states.tableHelp = d.states.tableHelp
      }
      if (d.states.tableStyle) {
        states.tableStyle = d.states.tableStyle
      }
      if (d.states.doms && d.states.doms instanceof Array && d.states.doms.length) {
        states.doms = d.states.doms.map((dom, index) => {
          dom.id = `DOMS-${dom.type}-${dom.field}-${index}`
          dom.actived = false
          return dom
        })
      }
      if (d.states.tableColumns && d.states.tableColumns instanceof Array && d.states.tableColumns.length) {
        states.tableColumns = d.states.tableColumns.map((column, columnIndex) => {
          column.id = `Column-${column.type}-${column.field}-${columnIndex}`
          column.actived = 0
          return column
        })
      }
      this.setState(states, () => {
        this.initialLodop(d.lodop_target, d.print_setting)
      })
    })
  }
  initialLodop = (src, setting) => {
    renderLodopScript(src, () => {
      const Lodop = getLodop()
      if (typeof Lodop === 'string') {
        this.setState({
          print_msg: Lodop
        })
      } else if (Lodop) {
        const len = Lodop.GET_PRINTER_COUNT()
        if (len > 0) {
          let machine_index = 0
          let paper = '*'
          let direction = '1'
          let quality = 100
          const machines = []
          for (let i = 0; i < len; i++) {
            const name = Lodop.GET_PRINTER_NAME(i)
            if (name === setting.machine_name) { //这个名字是从后台获取的
              machine_index = i
              paper = setting.paper
              direction = setting.direction //.GET_PRINTER_NAME('0:Orientation')
              quality = setting.quality //.GET_PRINTER_NAME(`${machine_index}:PrintQuality`);
            }
            machines.push({
              key: i + '',
              value: name
            })
          }
          const merge = {
            machines,
            papers: getPagers(machine_index),
            direction,
            paper,
            machine: machine_index + '',
            quality
          }
          this.setState({
            lodop_target: src,
            print_setting: Object.assign({}, this.state.print_setting, merge)
          }, this._getData)
        }
      }
    })
  }
  _getData = () => {
    const type = this.state.bm.type
    const data = {
      type
    }
    switch (type) {
      case 1: {
        data.ids = getUriParam('ids')
        break
      }
    }
    ZGet('print/data/withType', data, ({d}) => {
      console.log(d)
    })
  }
  changePrintState = (bool) => {
    this.setState(update(this.state, {
      printing: {
        $set: bool
      }
    }))
  }
  getQrcodeSize(css) {
    const { width, height } = css
    return Math.min(width, height)
  }
  getBarcodeSize(css) {
    const { height } = css
    return height
  }
  //获取的是 { oriTop, renderTop }
  getTableBottomPX(tableStyle, tableHelp, itemsLength) {
    const oriTop = tableStyle.top + tableHelp.minTHHeight + tableHelp.minTDHeight + 2 + 12 //border-width
    const inc = itemsLength > 0 ? tableHelp.minTDHeight * (itemsLength - 1) : 0
    //console.log(tableStyle)
    return { oriTop, inc }
  }

  //数据项解析
  getActRender(item, emu) {
    switch (item.act) {
      case 1: {
        const css = item.type === 3 ? item.tdCss : item.css
        const value = emu[`${item.field}`]
        return (
          <div className={styles.coderImg}>
            <img width={css.width - 4} height={css.height - 4} src={value} />
          </div>
        )
      }
      case 2: { //二维码
        const css = item.type === 3 ? item.tdCss : item.css
        const size = this.getQrcodeSize(css)
        const value = utf16to8(emu[`${item.field}`])
        const qr = new QRious({ value, size })
        return (
          <div className={styles.coderImg}>
            <img src={qr.toDataURL()} width={size} />
          </div>
        )
      }
      case 3: { //条形码
        const width = item.ext && item.ext.barcodeWidth ? item.ext.barcodeWidth * 1 : 1
        const css = item.type === 3 ? item.tdCss : item.css
        const size = this.getBarcodeSize(css)
        const value = emu[`${item.field}`] + ''
        const canvas = document.createElement('canvas')
        JsBarcode(canvas, value, {
          width,
          height: size - 4,
          fontSize: 12,
          margin: 2,
          displayValue: false
        })
        const data = canvas.toDataURL()
        return (
          <div className={styles.coderImg}>
            <img src={data} />
          </div>
        )
      }
      default: {
        return emu[`${item.field}`]
      }
    }
  }

  renderDom(item, key, emu, oriTop, incY) {
    let cn = ''
    let con = null
    let css = item.css
    if (item.css.top > oriTop) {
      css = Object.assign({}, item.css)
      css.top += incY
    }
    switch (item.type) {
      case 1: {
        cn = classNames(styles.line, styles[`line-${item.field}`])
        break
      }
      case 2: {
        cn = classNames(styles.pro, styles.pro_data, {
          [`${styles.qrcode}`]: item.act === 2 || item.act === 3
        })
        con = this.getActRender(item, emu)
        break
      }
      case 4: { //自定义项
        cn = classNames(styles.pro, styles.pro_cust)
        con = item.name
        break
      }
      case 5: { //特殊项LOGO
        cn = classNames(styles.logo, {
          [`${styles.active}`]: item.actived
        })
        const logo = !item.ext.url ? require('static/i/logo.png') : item.ext.url
        con = <img src={logo} width={item.css.width} height={item.css.height} />
        break
      }
      default: {
        return (
          <div>
            BookMan
          </div>
        )
      }
    }
    return (
      <div key={key} className={cn} style={css}>
        {con}
      </div>
    )
  }

  renderTableColumn(column, key, tableHelp, emu, tcLen) {
    const maxWidth = Math.max(column.thCss.width, column.tdCss.width) + 1 //hack border
    const columnCN = classNames(styles.column, {
      [`${styles.column_last}`]: tcLen === key + 1
    })
    const tdLen = emu.items ? emu.items.length : 0
    return (
      <div key={key} className={columnCN} style={{ width: maxWidth }}>
        <div className={styles.thWarper} style={{ height: tableHelp.minTHHeight }}>
          <div className={styles.th} style={column.thCss}>
            {column.title}
          </div>
        </div>
        {tdLen > 0 ? emu.items.map((item, k) => {
          const tdCN = classNames(styles.tdWarper, {
            [`${styles.tdWarper_last}`]: tdLen === k + 1
          })
          return (
            <div key={k} className={tdCN} style={{ height: tableHelp.minTDHeight }}>
              <div className={styles.td} style={column.tdCss}>
                {this.getActRender(column, item)}
              </div>
            </div>
          )
        }) : null}
      </div>
    )
  }

  renderEmus = (emu, index) => {
    //const emu = this.state.emus[index]
    //console.log(emu)
    const { doms, tableColumns, tableStyle, tableHelp, setting, print_setting } = this.state
    const { oriTop, inc } = this.getTableBottomPX(tableStyle, tableHelp, emu.items ? emu.items.length : 0)
    //console.log('table bottom px is %s %s', oriY, incY)
    const tcLen = tableColumns ? tableColumns.length : 0
    let tableWidth = 0
    if (tcLen > 0) {
      for (let i = 0; i < tcLen; i++) {
        tableWidth += Math.max(tableColumns[i].thCss.width, tableColumns[i].tdCss.width) + 1
      }
      tableWidth = Math.ceil(tableWidth * 100) / 100 + 14 //hack for border (1 + 6) * 2
    }
    const roteCN = classNames({
      [`${styles.rotePreview}`]: print_setting.direction === '2'
    })
    const ref = `PrintArea${index}`
    return (
      <div key={index} className={styles.preview} style={{ width: `${setting.pageW}mm`, height: `${setting.pageH}mm` }}>
        <div ref={ref} className={roteCN}>
          {tcLen > 0 ? (
            <div className={styles.tableWarper} style={{ ...tableStyle, width: tableWidth }}>
              <div className={styles.table}>
                {tableColumns.map((item, key) => this.renderTableColumn(item, key, tableHelp, emu, tcLen))}
              </div>
            </div>
          ) : null }
          {doms.map((item0, key) => this.renderDom(item0, key, emu, oriTop, inc))}
        </div>
      </div>
    )
  }
  settingPageW = (e) => {
    this.setState({
      setting: Object.assign({}, this.state.setting, {
        pageW: e * 1
      })
    })
  }
  settingPageH = (e) => {
    this.setState({
      setting: Object.assign({}, this.state.setting, {
        pageH: e * 1
      })
    })
  }

  selectPrintMachine = (e) => {
    const merge = {
      papers: getPagers(e),
      paper: '*',
      machine: e,
      direction: window.CLODOP.GET_PRINTER_NAME(`${e}:Orientation`) || '1'
    }
    this.setState({
      print_setting: Object.assign({}, this.state.print_setting, merge)
    })
  }
  selectPrintPaper = (e) => {
    this.setState({
      print_setting: Object.assign({}, this.state.print_setting, {
        paper: e
      })
    })
  }
  selectPrintDirection = (e) => {
    this.setState({
      print_setting: Object.assign({}, this.state.print_setting, {
        direction: e
      })
    })
  }
  getPrintHtml = (type) => {
    const classnames = type === 1 ? '' : ` class='${styles.print_lodop}'`
    const { setting } = this.state
    let str = `<!DOCTYPE html><html><head><meta http-equiv='X-UA-Compatible' content='IE=Edge;IE=11;IE=10;IE=9;IE=8' /><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link rel='stylesheet' type='text/css' href='./index.css?from=src' /></head><body${classnames}><div class='${styles.preview}' style='width: ${setting.pageW}mm; height: ${setting.pageH}mm'>`
    str += this.refs.PrintArea0.innerHTML
    str += '</div></body></html>'
    return str
  }
  doFastPrintAction = (method) => {
    const Lodop = getLodop()
    if (typeof Lodop === 'object') {
      if (Lodop.blOneByone === true) {
        notification.warning({
          message: '打印失败！',
          description: '有打印窗口正打开...',
          duration: 10
        })
        return
      }
      const {setting, print_setting} = this.state
      const pageW = setting.pageW
      const pageH = setting.pageH
      const direction = print_setting.direction || 0
      const pageType = print_setting.paper || '*'
      const machine = print_setting.machine
      const truePageW = pageW * 10
      const truePageH = pageH * 10
      if (pageType === '*') { //自定义
        const custPaperName = `XY(${pageW}x${pageH}mm)`
        Lodop.PRINT_INIT(`print preview for ${custPaperName}`)
        Lodop.SET_PRINTER_INDEX(machine)
        try {
          Lodop.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', custPaperName)
          Lodop.SET_PRINT_PAGESIZE(direction, truePageW, truePageH, 'CreateCustomPage')
        } catch (e) {
          message.error(`提示：打印机驱动不支持自定义纸张，请选择纸张类型。--${e.toString()}`)
          return
        }
      } else {
        Lodop.SET_PRINTER_INDEX(machine)
        Lodop.SET_PRINT_PAGESIZE(direction, 0, 0, pageType)
      }
      const html = this.getPrintHtml(2)
      const left = this.state.setting.prL
      const top = this.state.setting.prT
      Lodop.ADD_PRINT_HTM(`${top}mm`, `${left}mm`, `${pageW}mm`, `${pageH}mm`, html)
      this.changePrintState(true)
      const printTaskID = Lodop[method]() //PRINT_DESIGN //PREVIEW //PRINT PRINT_SETUP
      Lodop.On_Return = (taskID, value) => {
        console.log(taskID, value)
        if (printTaskID === taskID) {
          this.changePrintState(false)
          if (value) {
            notification.success({
              message: '完成'
            })
          } else {
            notification.info({
              message: '打印结果',
              description: '主动取消或者打印故障'
            })
          }
        }
      }
    } else {
      notification.warning({
        message: '打印失败！',
        description: '控件没有加载',
        duration: 10
      })
    }
  }
  fastPreview = () => {
    this.doFastPrintAction('PREVIEW') //PRINT_DESIGN //PREVIEW //PRINT PRINT_SETUP
  }
  fastPrint = () => {
    if (!window.confirm('确定使用设置的打印机开始打印？\r\n建议提前使用 预览 功能预览。')) {
      return
    }
    this.doFastPrintAction('PRINT')
  }
  doPrint = () => {
    const iframe = this.refs.printIframe
    const printWindow = iframe.contentWindow || iframe
    const docer = iframe.contentWindow.document //as iframe.doc above
    docer.open('about:blank')
    docer.write(this.getPrintHtml(1))
    const timer = setInterval(() => { //fuck this hack
      if (docer.readyState === 'complete') {
        clearInterval(timer)
        printWindow.focus()
        printWindow.print()
      }
    }, 100)
    docer.close()
  }
  selectTpl = (e) => {
    //todo
    ZGet('print/tpl/getPrintSet', {tpl_id: e}, ({d}) => {
      console.log(d)
    })
    this.setState({
      bm: Object.assign({}, this.state.bm, {
        id: e
      })
    })
  }
  render() {
    const { emus, setting, printing, print_msg, print_setting, bm } = this.state
    return (
      <div className={styles.height100}>
        <div className={styles.wraper}>
          <div className={styles.head}>
            <div className={styles.headR}>
              <span className={styles.mr8}>纸张：
                <InputNumber style={{ width: 70 }} size='small' step={0.1} onChange={this.settingPageW} value={setting.pageW} />
                &nbsp;x&nbsp;
                <InputNumber style={{ width: 70 }} size='small' step={0.1} onChange={this.settingPageH} value={setting.pageH} />
                (mm)
              </span>
              <Select style={{ width: 210 }} size='small' value={print_setting.machine} className={styles.mr8} onChange={this.selectPrintMachine}>
                {print_setting.machines.map((item, key) => {
                  return (
                    <Option key={key} value={item.key}>{item.value}</Option>
                  )
                })}
              </Select>
              <Select style={{ width: 150 }} size='small' value={print_setting.paper} className={styles.mr8} onChange={this.selectPrintPaper}>
                {print_setting.papers.map((item, key) => {
                  return (
                    <Option key={key} value={item.key}>{item.value}</Option>
                  )
                })}
              </Select>
              <Select style={{ width: 90 }} size='small' value={print_setting.direction} className={styles.mr8} onChange={this.selectPrintDirection}>
                {print_setting.directions.map((item, key) => {
                  return (
                    <Option key={key} value={item.key}>{item.value}</Option>
                  )
                })}
              </Select>
              {bm.tpls && bm.tpls.length ? (
                <div className={stylesA.tpls}>
                  <Select style={{ width: 90 }} size='small' value={bm.id} onChange={this.selectTpl}>
                    {bm.tpls.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      )
                    })}
                  </Select>
                </div>
              ) : null}
              <Button type='primary' onClick={this.fastPrint} disabled={printing || print_msg !== null}>快捷打印</Button>&nbsp;
              <Button type='ghost' size='small' onClick={this.fastPreview} disabled={printing || print_msg !== null}>预览</Button>&nbsp;
              <Button type='ghost' size='small' onClick={this.doPrint}>普通打印</Button>
            </div>
          </div>
          <div id='J-printer'>
            {emus && emus.length ? emus.map(this.renderEmus) : null}
          </div>
          {print_msg !== null ? (
            <div className={styles.footTips} dangerouslySetInnerHTML={{ __html: print_msg }} />
          ) : null }
        </div>
        <iframe ref='printIframe' className={styles.printIframe} />
      </div>
    )
  }
}

const renderLodopScript = (src, cb) => {
  let oscript = document.getElementById('zh_qbb_cdr_lodop')
  if (oscript) {
    oscript.parentNode.removeChild(oscript)
  }
  const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
  oscript = document.createElement('script')
  oscript.src = src
  oscript.id = 'zh_qbb_cdr_lodop'
  head.insertBefore(oscript, head.firstChild)
  oscript.onload = oscript.onreadystatechange = () => {
    if ((!oscript.readyState || /loaded|complete/.test(oscript.readyState))) {
      setTimeout(cb, 10)
    }
  }
}
const getPagers = function(key) {
  const papers = window.CLODOP.GET_PAGESIZES_LIST(key, '\n').split('\n').map((item) => {
    return {
      key: item,
      value: item
    }
  })
  papers.unshift({ key: '*', value: '纸张:自动' })
  return papers
}
export default connect()(View)
