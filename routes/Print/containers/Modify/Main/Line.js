import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import ItemTypes from '../ItemTypes'
import { DragSource } from 'react-dnd'
import { Resizable } from 'react-resizable'
import { connect as Connect } from 'react-redux'
import QRious from 'qrious'
import { utf16to8 } from 'utils/index'
var JsBarcode = require('jsbarcode')
import { activeFilter } from '../../../modules/actionsModify'
import styles from './CustLine.scss'

const boxSource = {
  beginDrag(props, monitor, line) {
    const id = props.id
    const left = props.item.css.left
    const top = props.item.css.top
    line.activeTrigger()
    return { id, left, top }
  }
}

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Line extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    item: PropTypes.object.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired,
    children: PropTypes.node
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isDragging === this.props.isDragging && nextProps.id === this.props.id && JSON.stringify(nextProps.item) === JSON.stringify(this.props.item)) {
      return false
    }
    return true
  }

  //改变背景色
  activeTrigger() {
    const { id, item } = this.props
    if (!item.actived) {
      this.props.dispatch(activeFilter(id))
    }
  }

//改变大小
  resizeTrigger = (event, { size }) => {
    const { id } = this.props
    this.props.dispatch({ type: 'PM_DOM_CSS_MERGE', index: id, merge: size })
    event.preventDefault()
  }

  qrcodeSize() {
    const { width, height } = this.props.item.css
    return Math.min(width, height)
  }
  barcodeSize() {
    const { height } = this.props.item.css
    return height
  }

  //数据项的二维码
  getDom() {
    const { item } = this.props
    switch (item.act) {
      case 2: { //二维码
        const size = this.qrcodeSize()
        const value = utf16to8(`{${item.name}}`)
        const qr = new QRious({ value, size })
        return (
          <div className={styles.coderImg}>
            <img src={qr.toDataURL()} width={size} />
          </div>
        )
      }
      case 3: { //条形码
        const width = item.ext && item.ext.barcodeWidth ? item.ext.barcodeWidth * 1 : 1
        const size = this.barcodeSize()
        const canvas = document.createElement('canvas')
        const value = `{${item.field}}`
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
        return `{${item.name}}`
      }
    }
  }

  _renderLine(cn, item, opacity, con) {
    return this.props.connectDragSource(
      <div className={cn} style={{ ...item.css, opacity }} onClick={this.activeTrigger.bind(this)}>
        {con}
        {item.actived ? (
          <Resizable width={item.css.width} height={item.css.height} onResize={this.resizeTrigger.bind(this)}>
            <div />
          </Resizable>
        ) : null}
      </div>
    )
  }

  render() {
    //console.log('>>>> render Line')
    const { hideSourceOnDrag, item, connectDragSource, isDragging } = this.props
    if (isDragging && hideSourceOnDrag) {
      return null
    }
    const opacity = isDragging ? 0.6 : 1

    switch (item.type) {
      case 1: {
        const cn = classNames(styles.line, styles[`line-${item.field}`], {
          [`${styles.active}`]: item.actived
        })
        return this._renderLine(cn, item, opacity, null)
      }
      case 2: {
        const cn = classNames(styles.pro, styles.pro_data, {
          [`${styles.active}`]: item.actived,
          [`${styles.qrcode}`]: item.act === 2 || item.act === 3
        })
        const dom = this.getDom()
        return this._renderLine(cn, item, opacity, dom)
      }
      case 4: { //自定义项
        const cn = classNames(styles.pro, styles.pro_cust, {
          [`${styles.active}`]: item.actived
        })
        return this._renderLine(cn, item, opacity, item.name)
      }
      case 5: { //特殊项LOGO
        const cn = classNames(styles.logo, {
          [`${styles.active}`]: item.actived
        })
        const logo = !item.ext.url ? require('../../../../../static/i/logo.png') : item.ext.url
        return this._renderLine(cn, item, opacity, (
          <img src={logo} width={item.css.width} height={item.css.height} />
        ))
      }
      default: {
        return connectDragSource(
          <div>
            error1
          </div>
        )
      }
    }
  }
}

export default Connect()(Line)
