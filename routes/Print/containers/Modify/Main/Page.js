/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-28 17:09:19
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { connect as Connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { addDom } from '../../../modules/actionsModify'
import DomLine from './Line'
import ItemTypes from '../ItemTypes'
import styles from './Page.scss'
import DomTable from './Table'

const boxTarget = {
  // hover(props, monitor, component) {
  //   var clientOffset = monitor.getClientOffset()
  //   var componentRect = findDOMNode(component).getBoundingClientRect()
  //   console.log(componentRect)
  // },
  drop(props, monitor, component) {
    const item = monitor.getItem()
    switch (typeof item.id) {
      case 'undefined': {
        const delta = monitor.getClientOffset()
        const componectRect = findDOMNode(component).getBoundingClientRect() //todu optimization
        item.left = delta.x - componectRect.left
        item.top = delta.y - componectRect.top
        component.createDom(item)
        break
      }
      case 'string': {
        if (item.id === 'table') {
          const delta = monitor.getDifferenceFromInitialOffset()
          const left = Math.round(item.left + delta.x)
          const top = Math.round(item.top + delta.y)
          component.moveTable(left, top)
        }
        break
      }
      default: {
        const delta = monitor.getDifferenceFromInitialOffset()
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        component.moveDom(item.id, left, top)
        break
      }
    }
  }
}

@DropTarget(ItemTypes.BOX, boxTarget, connect => ({
  connectDropTargetPage: connect.dropTarget()
}))
class Page extends Component {
  static propTypes = {
    connectDropTargetPage: PropTypes.func.isRequired
  }

  //创建
  createDom(item) {
    this.props.dispatch(addDom(item))
  }
    //移动
  moveDom(id, left, top) {
    this.props.dispatch({ type: 'PM_DOM_CSS_MERGE', index: id, merge: {
      left,
      top
    } })
  }
  moveTable(left, top) {
    this.props.dispatch({ type: 'PM_TABLESTYLE_SET', val: {
      left,
      top
    } })
  }

  //渲染自定义item
  renderItem(item, key) {
    return (
      <DomLine id={key} key={item.id} item={item} hideSourceOnDrag={false} />
    )
  }
  render() {
    const { doms, connectDropTargetPage, setting, printRange, GRIDLINES_CHECKED } = this.props //connectDropTargetTable
    // const roteCN = classNames({
    //   [`${styles.rotePreview}`]: print_setting.direction === '2',
    // })
    return connectDropTargetPage(
      <div id='page' className={styles.page} style={{ width: `${setting.pageW}mm`, height: `${setting.pageH}mm` }}>
        <DomTable hideSourceOnDrag={false} />
        {doms && doms.length ? doms.map((item, key) => this.renderItem(item, key)) : null}
        <div className={styles.page_print} style={printRange} >
          {GRIDLINES_CHECKED ? (
            <div className={styles.page_lines} />
          ) : null }
        </div>
      </div>
      )
  }
}

export default Connect(state => ({
  setting: state.pm_setting,
  printRange: state.pm_printRange,
  doms: state.pm_doms,
  GRIDLINES_CHECKED: state.pm_GRIDLINES_CHECKED,
  BGIMG_CHECKED: state.pm_BGIMG_CHECKED
}))(Page)
