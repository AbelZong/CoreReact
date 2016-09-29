import React, { Component } from 'react'
import { Spin } from 'antd'
import classNames from 'classnames'
import { connect as Connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {ZGet} from 'utils/Xfetch'
import { initRender, removeEditItem, keybordMoveEditItem } from '../modules/actionsModify'
import Header from './Modify/Header'
import Side from './Modify/Side'
import Main from './Modify/Main'
import SideTpl from './Modify/SideTpl'
import Preview from './Modify/Preview'
import styles from './Modify.scss'
import PageEntering from 'components/ToolPages/Entering'
import {endLoading, getUriParam} from 'utils/index'

@DragDropContext(HTML5Backend)
class Layout extends Component {
  componentWillMount() {
    const my_id = getUriParam('my_id')
    const sys_id = getUriParam('sys_id')
    const type = getUriParam('type')
    window.ZCH = {
      my_id, sys_id, type
    }
    let uri = ''
    let params = null
    switch (true) {
      case my_id > 0: { //加载个人模板
        uri = 'print/tpl/my'
        params = {my_id, type}
        break
      }
      case sys_id > 0: { //加载系统模板，以及模块数据
        uri = 'print/tpl/sys'
        params = { sys_id, type }
        break
      }
      default: { //只加载模块数据
        uri = 'print/tpl/type'
        params = { type }
      }
    }
    if (my_id === null) {
      this.props.dispatch({type: 'PM_ROLELV_SET', payload: 1})
    }
    ZGet(uri, params, (s, d, m) => {
      this.props.dispatch(initRender(d, window.ZCH))
      //dispatch({type: 'ACCESSLEVEL_ALLOW'})
    }, (m, s, d) => {
      this.props.dispatch({type: 'ACCESSLEVEL_FORBID'})
    }).then(() => {
      this.props.dispatch({type: 'ENTERING_STOP'})
      endLoading()
    })
  }
  componentDidMount() {
    document.body.addEventListener('keyup', this.keybordEvent, false)
  }
  componentWillUnmount() {
    document.body.removeEventListener('keyup', this.keybordEvent, false)
  }
  keybordEvent = (e) => {
    switch (e.keyCode) {
      case 46: { //删除
        this.props.dispatch(removeEditItem())
        break
      }
      case 40: { //key: ArrowDown code: ArrowDown keyIdentifier: Down
        this.props.dispatch(keybordMoveEditItem('down'))
        break
      }
      case 38: { //key: ArrowUp code: ArrowUp keyIdentifier: Up
        this.props.dispatch(keybordMoveEditItem('up'))
        break
      }
      case 39: { //key: ArrowRight code: ArrowRight keyIdentifier: Right
        this.props.dispatch(keybordMoveEditItem('right'))
        break
      }
      case 37: { //key: ArrowLeft code: ArrowLeft keyIdentifier: Left
        this.props.dispatch(keybordMoveEditItem('left'))
        break
      }
      default:break
    }
  }

  render() {
    const { entering, enterLoading, sideTplActived, previewed, currentTplID, print_msg } = this.props
    if (entering) {
      return <PageEntering />
    }
    const cnNormal = classNames(styles.normal, {
      [`${styles.blur}`]: enterLoading
    })
    const cnHide = classNames(styles.height100, {
      [`${styles.hide}`]: previewed
    })
    //console.log('render layout')
    return (
      <div className={styles.height100}>
        {enterLoading ? (
          <div className={styles.enterLoading}>
            <div className={styles.loadingText}>
              <Spin size='large' />
            </div>
          </div>
        ) : null }
        <div className={cnHide}>
          <div className={cnNormal}>
            <Header />
            <div className={styles.content}>
              <Main />
              <Side />
            </div>
            <div className={styles.foot}>
              Tips&nbsp;1、修改记得保存&emsp;2、键盘方向键可以微调选中对象的位置&emsp;3、键盘`Delete`删除选中对象
              {print_msg !== null ? (
                <span className={styles.print_msg} dangerouslySetInnerHTML={{ __html: print_msg }} />
              ) : null}
            </div>
            {sideTplActived ? (
              <SideTpl currentTplID={currentTplID} />
            ) : null}
          </div>
        </div>
        {previewed && <Preview />}
      </div>
    )
  }
}

export default Connect(state => ({
  entering: state.entering,
  enterLoading: state.pm_enterLoading,
  previewed: state.pm_previewed,
  sideTplActived: state.pm_sideTplActived,
  currentTplID: state.pm_currentTplID,
  print_msg: state.pm_print_msg
}))(Layout)
