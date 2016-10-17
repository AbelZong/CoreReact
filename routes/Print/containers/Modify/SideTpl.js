import React, { Component } from 'react'
import { Row, Col, Button, Spin, Alert } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import styles from './SideTpl.scss'
import { ZGet, ZPost } from 'utils/Xfetch'

class SideTpl extends Component {
  constructor() {
    super()
    this.state = {
      loading: true,
      myTpls: [],
      sysTpls: []
    }
    this.defed_id = 0
  }
  componentWillMount(nextProps) {
    this._updateState({
      loading: {
        $set: true
      }
    })
  }
  componentDidMount() {
    ZGet('print/tpl/sideTpls', { type: window.ZCH.type }, ({d}) => {
      this.setState({
        loading: false,
        myTpls: d.myTpls || [],
        sysTpls: d.sysTpls || []
      })
    })
  }
  _updateState(obj, callback) {
    this.setState(update(this.state, obj), callback)
  }
  tplHover(flag, e) {
    const aa = e.toElement || e.relatedTarget
    if (aa && aa.id === 'ccacheer_tplsider') {
      this.props.dispatch({ type: 'PM_SIDETPL_ACTIVIED_SET', actived: flag })
    }
  }
  findMyTpl(my_id) {
    const { myTpls } = this.state
    const myTpl = myTpls.filter(c => c.id === my_id)[0]
    return { myTpl, index: myTpls.indexOf(myTpl) }
  }
  setDefedClick(my_tpl_id) {
    ZPost('print/side/setdefed', { my_tpl_id }, () => {
      const { index } = this.findMyTpl(my_tpl_id)
      const updateObj = {
        [index]: {
          $merge: {
            defed: true
          }
        }
      }
      if (this.defed_id) {
        if (this.defed_id !== my_tpl_id) {
          const { index: oldIndex } = this.findMyTpl(this.defed_id)
          if (oldIndex > -1) {
            updateObj[oldIndex] = {
              $merge: {
                defed: false
              }
            }
          }
        }
      }
      this._updateState({
        myTpls: updateObj
      }, () => {
        this.defed_id = my_tpl_id
      })
    })
  }
  modifyClick(my_tpl_id) {
    if (window.confirm('确定要离开当前页面编辑模板吗？建议先保存。')) {
      window.location.href = `/page/print/modify?my_id=${my_tpl_id}`
    }
  }
  removeClick(my_tpl_id) {
    if (this.defed_id === my_tpl_id) {
      alert('默认模板无法删除')
      return
    }
    if (window.confirm('确定删除选定的模板？')) {
      ZPost('print/side/remove', { my_tpl_id }, () => {
        const { index } = this.findMyTpl(my_tpl_id)
        this._updateState({
          myTpls: {
            $splice: [[index, 1]]
          }
        })
      })
    }
  }
  renderMyTpl(item, key) {
    const CN = classNames({
      [`${styles.sideTplCurrent}`]: item.id === this.props.currentTplID
    })
    if (item.defed) {
      this.defed_id = item.id
    }
    return (
      <Row key={item.id} className={styles.sideTplRow}>
        <Col span={8} className={CN}>{item.name}</Col>
        <Col span={16} style={{ textAlign: 'right' }}>
          {item.defed ? (
            <div>
              <Button size='small' disabled>已设默认</Button>&nbsp;
              <Button size='small'>编辑</Button>&nbsp;
            </div>
          ) : (
            <div>
              <Button size='small' onClick={this.setDefedClick.bind(this, item.id)}>设为默认</Button>&nbsp;
              <Button size='small' onClick={this.modifyClick.bind(this, item.id)}>编辑</Button>&nbsp;
              <Button size='small' onClick={this.removeClick.bind(this, item.id)}>删除</Button>&nbsp;
            </div>
          )}
        </Col>
      </Row>
    )
  }

  createBySysTpl(sys_tpl_id) {
    if (window.confirm('确定要离开当前页面创建一个新模板吗？建议先保存。')) {
      window.location.href = `/page/print/modify?my_id=0&sys_id=${sys_tpl_id}`
    }
  }
  renderSysTpl(item, key) {
    return (
      <Row key={item.id} className={styles.sideTplRow}>
        <Col span={8}>系统模板：{item.name}</Col>
        <Col span={16} style={{ textAlign: 'right' }}>
          <Button size='small' onClick={this.createBySysTpl.bind(this, item.id)}>复制</Button>&nbsp;
        </Col>
      </Row>
    )
  }

  render() {
    const { myTpls, sysTpls, loading } = this.state
    return (
      <div id='ccacheer_tplsider' className={styles.sideTpl}>
        <div style={{ marginLeft: -480 }} className={styles.sideTplTO} onMouseLeave={this.tplHover.bind(this, false)}>
          <Spin tip='正在读取数据...' spinning={loading}>
            <div className={styles.sideTplTitle}>
              模板列表
            </div>
            <div className={styles.sideTplMy}>
              {myTpls.length ? myTpls.map((item, key) => this.renderMyTpl(item, key))
                : (<Alert message='请先新建一个模板' type='warning' />)
              }
            </div>
            <div className={styles.sideTplSys}>
              {sysTpls.length ? sysTpls.map((item, key) => this.renderSysTpl(item, key))
                : (<Alert message='暂无系统模板' type='info' />)
              }
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}

export default connect()(SideTpl)
