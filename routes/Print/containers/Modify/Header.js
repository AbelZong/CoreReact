/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-29 13:45:02
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Checkbox, Button, Input } from 'antd'
import { saveTpl, saveSys, selectPrintOri } from '../../modules/actionsModify'
import Editor from './Editor'
import styles from './Header.scss'
const InputGroup = Input.Group

class Header extends Component {
  checkBoxChange(field, e) {
    this.props.dispatch({ type: field, checked: e.target.checked })
  }
  handleInputChange = (e) => {
    this.props.dispatch({ type: 'PM_TPL_NAME_SET', text: e.target.value })
  }
  handleSave = () => {
    const {my_id, sys_id, type} = window.ZCH
    if (my_id !== null) {
      return this.props.dispatch(saveTpl(my_id, sys_id, type))
    }
    if (sys_id !== null) {
      return this.props.dispatch(saveSys(sys_id, type))
    }
    alert('error method')
  }
  tplHover(flag) {
    this.props.dispatch({ type: 'PM_SIDETPL_ACTIVIED_SET', actived: flag })
  }
  goPreview = () => {
    this.props.dispatch({ type: 'PM_PREVIEWED_SET', payload: true })
  }
  handleLodopChange = (e) => {
    const target = e.target.value
    this.props.dispatch(selectPrintOri(target))
  }
  render() {
    const {lodop_target, roleLv, BGIMG_CHECKED, GRIDLINES_CHECKED, tpl_name} = this.props
    return (
      <div className={styles.head}>
        <Row className={styles.headRow}>
          <Col span={10}>
            <div style={{marginTop: 6}}><Input title='回车确认' size='small' addonBefore='云打印目标' defaultValue={lodop_target} onPressEnter={this.handleLodopChange} /></div>
          </Col>
          <Col span={14} style={{ textAlign: 'right' }}>
            <Checkbox defaultChecked={GRIDLINES_CHECKED} onChange={this.checkBoxChange.bind(this, 'PM_GRIDLINES_CHECKED')}>
              网格线
            </Checkbox>
            <Checkbox defaultChecked={BGIMG_CHECKED} onChange={this.checkBoxChange.bind(this, 'PM_BGIMG_CHECKED')}>
              背景图
            </Checkbox>
            &emsp;
            <Button type='primary' size='small' onClick={this.goPreview}>预览</Button>
            &emsp;
            <div className='ant-search-input-wrapper' style={{ width: 200, textAlign: 'left' }}>
              <InputGroup className='ant-search-input'>
                <Input size='small' placeholder='输入模板名' value={tpl_name} onChange={this.handleInputChange} onPressEnter={this.handleSave} />
                <div className='ant-input-group-wrap'>
                  <Button title='保存模板' icon='save' className='ant-search-btn' size='small' onClick={this.handleSave} />
                </div>
              </InputGroup>
            </div>&emsp;
            {roleLv === 0 && (
              <Button size='small' onMouseEnter={this.tplHover.bind(this, true)}>模板列表</Button>
            )}
          </Col>
        </Row>
        <div className={styles.headRow}>
          <Editor />
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  GRIDLINES_CHECKED: state.pm_GRIDLINES_CHECKED,
  BGIMG_CHECKED: state.pm_BGIMG_CHECKED,
  tpl_name: state.pm_tpl_name,
  roleLv: state.pm_roleLv,
  lodop_target: state.pm_lodop_target
}))(Header)
