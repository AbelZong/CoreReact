import React, { Component, PropTypes } from 'react'
import ItemTypes from './ItemTypes'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { connect as Connect } from 'react-redux'
import { addColumn } from '../../modules/actionsModify'

const BoxSource = {
  beginDrag(props) {
    const { item } = props
    item.left = 0
    item.top = 0
    return item
  }
}

@DragSource(ItemTypes.BOX, BoxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
class LabelLine extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired
  }
  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true
    })
    //const img = new Image()
    //img.onload = () => this.props.connectDragPreview(img)
    //img.src = ''
  }
  addColumn() {
    this.props.dispatch(addColumn(this.props.item))
  }
  render() {
    const { item, children } = this.props
    if (item.type === 3) {
      return (
        <span onClick={this.addColumn.bind(this)}>{children}</span>
      )
    }
    const { connectDragSource, isDragging } = this.props
    const opacity = isDragging ? 0.6 : 1
    return connectDragSource(
      <span style={{ opacity }}>
        {children}
      </span>
    )
  }
}

export default Connect()(LabelLine)
