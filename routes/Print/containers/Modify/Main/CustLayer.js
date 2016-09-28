import React, { PropTypes } from 'react'
import { DragLayer } from 'react-dnd'
import classNames from 'classnames'
import styles from './CustLine.scss'

function snapToGrid(x, y) {
  const snappedX = Math.round(x / 32) * 32
  const snappedY = Math.round(y / 32) * 32
  return [snappedX, snappedY]
}

function getItemStyles(props) {
  const { initialOffset, currentOffset } = props
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    }
  }
  let { x, y } = currentOffset
  if (props.snapToGrid) {
    x -= initialOffset.x
    y -= initialOffset.y
    const zhua = snapToGrid(x, y)
    x = zhua.x + initialOffset.x
    y = zhua.y + initialOffset.y
  }
  const transform = `translate(${x}px, ${y}px)`
  return {
    Transform: transform,
    WebkitTransform: transform
  }
}

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))
export default class CustLayer extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    initialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired
  }

  renderItem(type, item) {
    switch (item.type) {
      case 1: {
        const cn = classNames([
          styles.line,
          styles[`line-${item.field}`],
          styles.active
        ])
        return (
          <div className={cn} />
        )
      }
      case 2: {
        const cn = classNames([
          styles.pro,
          styles.pro_data,
          styles.active
        ])
        return (
          <div className={cn}>{`{${item.name}}`}</div>
        )
      }
      default:
        return null
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props
    if (!isDragging || !item.type) {
      return null
    }
    return (
      <div className={styles.dragLayer}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    )
  }
}
