import React, { Component } from 'react'
import { Button, message, Select, InputNumber, notification } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { ZGet } from 'utils/Xfetch'
import QRious from 'qrious'
const JsBarcode = require('jsbarcode')
import update from 'react-addons-update'
import { getLodop } from '3rd/Lodop'
import { utf16to8 } from 'utils/index'
import styles from './Preview.scss'
import { selectPrintMachine } from '../../modules/actionsModify'
const Option = Select.Option

class Preview extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      emus: null,
      printing: false
    }
  }
  componentWillMount() {
    ZGet('print/tpl/emu_data', {
      type: window.ZCH.type
    }, (s, d, m) => {
      this.setState({
        emus: d.emu_data
      })
    }, () => {
      this.props.dispatch({ type: 'PM_PREVIEWED_SET', payload: false })
    })
  }
  componentDidMount() {
    this.cacheState = this.context.store.getState()
    // setTimeout(() => {
    //   const state = this.context.store.getState()
    //   const Lodop = getLodop()
    //   Lodop.SET_PRINTER_INDEX(state.print_setting.machine + '')
    //   Lodop.SET_PRINT_PAGESIZE(1, 0, 100, 'A4')
    //   //Lodop.PREVIEW()
    //   Lodop.On_Return = (TaskID, Value) => {
    //     console.log('%s:%s', TaskID, Value)
    //   }
    //   //Lodop.PREVIEW()
    //   Lodop.GET_VALUE('PRINTSETUP_PAGE_HEIGHT', 0)
    //   //console.log(Math.round(Lodop.GET_VALUE('PRINTSETUP_SIZE_WIDTH', 0)) / 100)
    // }, 1000)
  }
  // componentWillUnmount() {
  //   //console.log('componentWillUnmount')
  // }

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
        // return (
        //   <div className={styles.coderImg}>
        //     <QrCode value={value} size={size} />
        //   </div>
        // )
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
        //return remove attr  height={size}
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
    let css
    if (item.css.top > oriTop) {
      css = Object.assign({}, item.css)
      css.top += incY
    } else {
      css = item.css
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
        con = (
          <img src={logo} width={item.css.width} height={item.css.height} />
        )
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

  renderEmus = (index) => {
    const emu = this.state.emus[index]
    //console.log(emu)
    const { pm_doms, pm_tableColumns, pm_tableStyle, pm_tableHelp } = this.cacheState
    const { setting } = this.props
    const { oriTop, inc } = this.getTableBottomPX(pm_tableStyle, pm_tableHelp, emu.items ? emu.items.length : 0)
    //console.log('table bottom px is %s %s', oriY, incY)
    const tcLen = pm_tableColumns ? pm_tableColumns.length : 0
    let tableWidth = 0
    if (tcLen > 0) {
      for (let i = 0; i < tcLen; i++) {
        tableWidth += Math.max(pm_tableColumns[i].thCss.width, pm_tableColumns[i].tdCss.width) + 1
      }
      tableWidth = Math.ceil(tableWidth * 100) / 100 + 14 //hack for border (1 + 6) * 2
    }
    const { print_setting } = this.props
    const roteCN = classNames({
      [`${styles.rotePreview}`]: print_setting.direction === '2'
    })
    const ref = `PrintArea${index}`
    return (
      <div key={index} className={styles.preview} style={{ width: `${setting.pageW}mm`, height: `${setting.pageH}mm` }}>
        <div ref={ref} className={roteCN}>
          {tcLen > 0 ? (
            <div className={styles.tableWarper} style={{ ...pm_tableStyle, width: tableWidth }}>
              <div className={styles.table}>
                {pm_tableColumns.map((item, key) => this.renderTableColumn(item, key, pm_tableHelp, emu, tcLen))}
              </div>
            </div>
          ) : null }
          {pm_doms.map((item, key) => this.renderDom(item, key, emu, oriTop, inc))}
        </div>
      </div>
    )
  }
  settingPageW = (e) => {
    this.props.dispatch({ type: 'PM_SETTING_PAGEW_SET', val: e })
  }
  settingPageH = (e) => {
    this.props.dispatch({ type: 'PM_SETTING_PAGEH_SET', val: e })
  }
  closePreview = () => {
    this.props.dispatch({ type: 'PM_PREVIEWED_SET', payload: false })
  }

  selectPrintMachine = (e) => {
    this.props.dispatch(selectPrintMachine(e))
  }
  selectPrintPaper = (e) => {
    this.props.dispatch({ type: 'PM_PRINTSETTING_MERGE', merge: {
      paper: e
    } })
  }
  selectPrintDirection = (e) => {
    this.props.dispatch({ type: 'PM_PRINTSETTING_MERGE', merge: {
      direction: e
    } })
  }
  getPrintHtml = (type) => {
    const classnames = type === 1 ? '' : ` class='${styles.print_lodop}'`
    const { setting } = this.props
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
      const {setting, print_setting} = this.props
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
      // switch (direction) {
      //   case '1': {
      //     Lodop.SET_PRINT_MODE('FULL_HEIGHT_FOR_OVERFLOW', true)
      //     break
      //   }
      //   case '2': {
      //     Lodop.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)
      //     break
      //   }
      //   default:break
      // }
      const html = this.getPrintHtml(2)
      console.log(html)
      //document.body.parentNode.innerHTML = html
      const left = this.props.setting.prL
      const top = this.props.setting.prT
      //console.log(top, left, truePageW, truePageW)
      //const html = `<!DOCTYPE html><html><head><meta http-equiv='X-UA-Compatible' content='IE=Edge;IE=11;IE=10;IE=9;IE=8' /><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link rel='stylesheet' type='text/css' href='./index.css' /><body><svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='190'><polygon points='100,10 40,180 190,60 10,60 160,180' style='fill:lime;stroke:purple;stroke-width:5;fill-rule:evenodd;' /></svg><div class='${styles.td}'>sdfsdf</div></body>`
      Lodop.ADD_PRINT_HTM(`${top}mm`, `${left}mm`, `${pageW}mm`, `${pageH}mm`, html)
      //Lodop.SET_PRINT_STYLEA(0, 'HtmWaitMilSecs', 1000)
      //Lodop.SET_PRINT_MODE('CATCH_PRINT_STATUS', true)
      this.changePrintState(true)
      //Lodop.ADD_PRINT_HTM(top, left, truePageW, truePageW, html)
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
    // let iframe = null
    // if (this.iframe === null) {
    //   iframe = document.createElement('iframe')
    //   try {
    //     iframe.style = 'border:0;position:absolute;width:0px;height:0px;left:0px;top:0px;'
    //     document.body.appendChild(iframe)
    //     iframe.doc = null
    //     iframe.doc = iframe.contentDocument ? iframe.contentDocument : ( iframe.contentWindow ? iframe.contentWindow.document : iframe.document)
    //   } catch (e) {
    //     message.error(`${e}. iframes may not be supported in this browser.`)
    //   }
    //   if (iframe.doc === null) {
    //     message.error('打印错误：Cannot find document.')
    //   }
    //   this.iframe = iframe
    // } else {
    //   iframe = this.iframe
    // }
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
  render() {
    if (!this.state.emus) {
      return null //todo加载中
    }
    const emuLens = Array.apply(0, Array(this.state.emus.length))
    //const { setting } = this.cacheState
    const { setting, print_msg, print_setting } = this.props
    const { printing } = this.state
    return (
      <div className={styles.height100}>
        <div className={styles.wraper}>
          <div className={styles.head}>
            <Button type='ghost' size='small' onClick={this.closePreview} icon='rollback'>返回</Button>
            <div className={styles.headR}>
              <span className={styles.mr8}>纸张：宽
                <InputNumber style={{ width: 70 }} size='small' step={0.1} onChange={this.settingPageW} value={setting.pageW} />
                高
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
              <Button type='primary' onClick={this.fastPrint} disabled={printing || print_msg !== null}>快捷打印</Button>&nbsp;
              <Button type='ghost' size='small' onClick={this.fastPreview} disabled={printing || print_msg !== null}>预览</Button>&nbsp;
              <Button type='ghost' size='small' onClick={this.doPrint}>普通打印</Button>
            </div>
          </div>
          <div id='J-printer'>
            {emuLens.map((_, i) => this.renderEmus(i))}
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

export default connect(state => ({
  setting: state.pm_setting,
  printRange: state.pm_printRange,
  print_setting: state.pm_print_setting,
  print_msg: state.pm_print_msg
}))(Preview)
