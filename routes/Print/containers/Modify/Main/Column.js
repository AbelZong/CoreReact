import React, { Component, PropTypes } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { Resizable } from 'react-resizable'
import { connect as Connect } from 'react-redux'
import classNames from 'classnames'
import QRious from 'qrious'
import { utf16to8 } from 'utils/index'
var JsBarcode = require('jsbarcode')
import ItemTypes from '../ItemTypes'
import { Bgif } from 'constants/index'
import styles from './CustLine.scss'
import { activeColumnFilter, resizeColumn } from '../../../modules/actionsModify'

const columnSource = {
  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findColumn(props.id).index
    }
  },
  endDrag(props, monitor) {
    const { id: droppedId, originalIndex } = monitor.getItem()
    const didDrop = monitor.didDrop()
    if (!didDrop) {
      props.moveColumn(droppedId, originalIndex)
    }
  }
}

const columnTarget = {
  canDrop() {
    return false
  },
  hover(props, monitor) {
    const { id: draggedId } = monitor.getItem()
    const { id: overId } = props
    if (draggedId !== overId) {
      const { index: overIndex } = props.findColumn(overId)
      props.moveColumn(draggedId, overIndex)
    }
  }
}

@DropTarget(ItemTypes.TABLE, columnTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.TABLE, columnSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Column extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    column: PropTypes.object.isRequired,
    moveColumn: PropTypes.func.isRequired,
    findColumn: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextProps.column) === JSON.stringify(this.props.column) && nextProps.tableHelp === this.props.tableHelp) {
      return false
    }
    return true
  }

  resizeTHTrigger = (event, { size }) => {
    this.props.dispatch(resizeColumn(this.props.id, size, 'thCss'))
    event.preventDefault()
  }

  resizeTDTrigger = (event, { size }) => {
    this.props.dispatch(resizeColumn(this.props.id, size, 'tdCss'))
    event.preventDefault()
  }

    //改变背景色
  activeTrigger(thOrTd) {
    this.props.dispatch(activeColumnFilter(this.props.id, thOrTd))
  }

  qrcodeSize() {
    const { width, height } = this.props.column.tdCss
    return Math.min(width, height)
  }
  barcodeSize() {
    const { height } = this.props.column.tdCss
    return height
  }

  render() {
    const { column, isDragging, connectDragSource, connectDropTarget, tableHelp } = this.props
    const { minTDHeight, minTHHeight } = tableHelp
    const opacity = isDragging ? 0.35 : 1
    //console.log(opacity, this.props.id, column.name)
    const cnTH = classNames(styles.thWarper, {
      [`${styles.active}`]: column.actived === 1
    })
    const cnTD = classNames(styles.tdWarper, {
      [`${styles.active}`]: column.actived === 2
    })
    let tdActDom = ''
    switch (column.act) {
      case 1: {
        tdActDom = (
          <div className={styles.coderImg}>
            <img className={styles.act0} src={Bgif} width={column.tdCss.width - 2} height={column.tdCss.height - 2} />
          </div>
        )
        break
      }
      case 2: { //二维码
        const size = this.qrcodeSize()
        const value = utf16to8(`{${column.name}}`)
        const qr = new QRious({ value, size })
        tdActDom = (
          <div className={styles.coderImg}>
            <img src={qr.toDataURL()} width={size} />
          </div>
        )
        break
      }
      case 3: { //条形码
        const width = column.ext && column.ext.barcodeWidth ? column.ext.barcodeWidth * 1 : 1
        const size = this.barcodeSize()
        const value = `{${column.field}}`
        const canvas = document.createElement('canvas')
        JsBarcode(canvas, value, {
          width,
          height: size - 4,
          fontSize: 12,
          margin: 2,
          displayValue: false
        })
        const data = canvas.toDataURL()
        tdActDom = (
          <div className={styles.coderImg}>
            <img src={data} />
          </div>
        )
        break
      }
      default: {
        tdActDom = `{${column.name}}`
        break
      }
    }
    return connectDragSource(connectDropTarget(
      <div className={styles.column} style={{ opacity }}>
        <div className={cnTH} style={{ minHeight: minTHHeight }} onClick={this.activeTrigger.bind(this, 1)}>
          <div className={styles.th} style={column.thCss}>
            {column.title}
            {column.actived === 1 ? (
              <Resizable width={column.thCss.width} height={column.thCss.height} onResize={this.resizeTHTrigger.bind(this)}>
                <div />
              </Resizable>
            ) : null }
          </div>
        </div>
        <div className={cnTD} style={{ minHeight: minTDHeight }} onClick={this.activeTrigger.bind(this, 2)}>
          <div className={styles.td} style={column.tdCss}>
            {tdActDom}
            {column.actived === 2 ? (
              <Resizable width={column.tdCss.width} height={column.tdCss.height} onResize={this.resizeTDTrigger.bind(this)}>
                <div />
              </Resizable>
            ) : null }
          </div>
        </div>
      </div>
    ))
  }
}

export default Connect(state => ({
  tableHelp: state.pm_tableHelp
}))(Column)
