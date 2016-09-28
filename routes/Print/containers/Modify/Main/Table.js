import React, { Component, PropTypes } from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import { connect as Connect } from 'react-redux'
import ItemTypes from '../ItemTypes'
import DomColumn from './Column'
import styles from './table.scss'

const tableTarget = {
  drop() {
  }
}
const tableSource = {
  beginDrag(props, monitor, line) {
    const id = 'table'
    const left = props.tableStyle.left || 0
    const top = props.tableStyle.top || 0
    return { id, left, top }
  }
}

@DragSource(ItemTypes.BOX, tableSource, (connect, monitor) => ({
  connectDragSourceTable: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget(ItemTypes.TABLE, tableTarget, connect => ({
  connectDropTargetTable: connect.dropTarget()
}))
class Table extends Component {
  static propTypes = {
    connectDragSourceTable: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    children: PropTypes.node
  }

  findColumn(id) {
    const column = this.props.tableColumns.filter(c => c.id === id)[0]
    return { column, index: this.props.tableColumns.indexOf(column) }
  }
  moveColumn(id, atIndex) {
    const { column, index } = this.findColumn(id)
    this.props.dispatch({ type: 'PM_TABLECOLUMN_MOVE', splice: [
      [index, 1],
      [atIndex, 0, column]
    ] })
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   //console.log(nextProps.column, this.props.column, nextProps.column === this.props.column, this.state === nextState)
  //   if (nextProps.tableStyle === this.props.tableStyle && nextProps.tableHelp === this.props.tableHelp && nextProps.tableColumns === this.props.tableColumns && this.state === nextState) {
  //     return false
  //   }
  //   return true
  // }
  renderTableColumn(column, key) {
    //activeColumnFilter={activeColumnFilter} minTHHeight={tableHelp.minTHHeight} minTDHeight={tableHelp.minTDHeight} moveColumn={moveColumn} findColumn={findColumn} onResizeColumn={resizeColumn}
    return (
      <DomColumn key={column.id} id={column.id} column={column} findColumn={this.findColumn.bind(this)} moveColumn={this.moveColumn.bind(this)} />
    )
  }

  render() {
    //console.log('>>> render table')
    const { hideSourceOnDrag, connectDragSourceTable, tableStyle, connectDropTargetTable, isDragging, tableColumns } = this.props
    if (isDragging && hideSourceOnDrag) {
      return null
    }
    const opacity = isDragging ? 1 : 1
    return tableColumns && tableColumns.length ? connectDragSourceTable(connectDropTargetTable(
      <div className={styles.tableWarper} style={{ ...tableStyle, opacity }}>
        <div className={styles.table}>
          {tableColumns.map((item, key) => this.renderTableColumn(item, key))}
        </div>
      </div>
  )) : null
  }
}

export default Connect(state => ({
  tableColumns: state.pm_tableColumns,
  tableStyle: state.pm_tableStyle
}))(Table)
