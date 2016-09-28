import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Row, Col, Button, Input, InputNumber, Icon, Select } from 'antd'
import { settingPrintRangeTop, settingPrintRangeLeft, addDom, selectPrintMachine } from '../../modules/actionsModify'
import LabelLine from './LabelLine'
import styles from './Side.scss'
const InputGroup = Input.Group
const Option = Select.Option
const custBoxs = [
  { field: 'LineBlock', name: '矩形实线框', type: 1, width: 100, height: 36, act: 0 },
  { field: 'DotteLineBlock', name: '矩形虚线框', type: 1, width: 100, height: 36, act: 0 },
  { field: 'VLine', name: '实竖线', type: 1, width: 10, height: 100, act: 0 },
  { field: 'DotteVLine', name: '虚竖线', type: 1, width: 10, height: 100, act: 0 },
  { field: 'HLine', name: '实横线', type: 1, width: 100, height: 10, act: 0 },
  { field: 'DotteHLine', name: '虚横线', type: 1, width: 100, height: 10, act: 0 }
]

export default class Side extends Component {
  constructor() {
    super()
    this.state = {
      insert_filed: ''
    }
  }
  //设置
  settingPageW(e) {
    this.props.dispatch({ type: 'PM_SETTING_PAGEW_SET', val: e })
  }
  settingPageH(e) {
    this.props.dispatch({ type: 'PM_SETTING_PAGEH_SET', val: e })
  }
  settingPrintRangeTop(e) {
    this.props.dispatch(settingPrintRangeTop(e))
  }
  settingPrintRangeLeft(e) {
    this.props.dispatch(settingPrintRangeLeft(e))
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
  renderCustLabel(item, key) {
    return (
      <LabelLine key={key} item={item}>
        <Button type='dashed' icon='rollback' size='small'>{item.name}</Button>
      </LabelLine>
    )
  }
  renderDataLabel(item, key) {
    return (
      <LabelLine key={key} item={item}>
        <Button type='ghost' size='small'>{item.name}</Button>
      </LabelLine>
    )
  }
  renderTableLabel(item, key) {
    return (
      <LabelLine key={key} item={item}>
        <Button size='small'>{item.name}</Button>
      </LabelLine>
    )
  }

  //插入自定义项 type=4
  insertField() {
    const value = this.refs.inputCustText.refs.input.value
    if (!value) {
      this.refs.inputCustText.refs.input.focus()
      return
    }
    this.refs.inputCustText.refs.input.value = ''
    this.props.dispatch(addDom({
      field: '_',
      type: 4,
      name: value,
      act: 0,
      left: 10,
      top: 10,
      width: 120,
      height: 80
    }))
  }

  _renderPreset(item, key) {
    if (item.type === 3) {
      return (
        <div key={key}>
          <h4 className={styles.set_h4}><Icon type='file-text' />{item.name}</h4>
          <div className={styles.custbox}>
            {item.rows && item.rows.map((row, k) => this.renderTableLabel(row, k))}
          </div>
        </div>
      )
    }
    const cn = classNames(styles.custbox, styles.dataArea)
    return (
      <div key={key}>
        <h4 className={styles.set_h4}><Icon type='file' />{item.name}</h4>
        <div className={cn}>
          {item.rows && item.rows.map((row, k) => this.renderDataLabel(row, k))}
        </div>
      </div>
    )
  }

  render() {
  //自定义的， act 0=text 1=img 2=qrcode 3=barcode
    //const { custBoxs, columnList, dataList } = this.state
    const { setting, presetFields, print_setting } = this.props
    //print_machine, print_machine_select, print_paper_select, print_paper, print_direction_select
    return (
      <div className={styles.side}>
        <h3 className={styles.set_h3}>打印参数设置</h3>
        <div className={styles.setting}>
          <Row>
            <Col span='6' className={styles.tr}>
              <span>打印机:</span>
            </Col>
            <Col span='18'>
              <Select size='small' value={print_setting.machine} onChange={this.selectPrintMachine} style={{ display: 'block' }}>
                {print_setting.machines.map((item, key) => {
                  return (
                    <Option key={key} value={item.key}>{item.value}</Option>
                  )
                })}
              </Select>
            </Col>
          </Row>
          <Row className={styles.mt8}>
            <Col span='6'>
              &nbsp;
            </Col>
            <Col span='18'>
              <Select size='small' value={print_setting.paper} className={styles.mr8} onChange={this.selectPrintPaper} style={{ display: 'block' }}>
                {print_setting.papers.map((item, key) => {
                  return (
                    <Option key={key} value={item.key}>- {item.value}</Option>
                  )
                })}
              </Select>
            </Col>
          </Row>
          <Row className={styles.mt8}>
            <Col span='6' className={styles.tr}>
              <span>方向:</span>
            </Col>
            <Col span='18'>
              <Select size='small' value={print_setting.direction} className={styles.mr8} onChange={this.selectPrintDirection} style={{ display: 'block' }}>
                {print_setting.directions.map((item, key) => {
                  return (
                    <Option key={key} value={item.key}>{item.value}</Option>
                  )
                })}
              </Select>
            </Col>
          </Row>
          <Row className={styles.mt8}>
            <Col span='12'>
              <label className={styles.setting_label}>宽(mm)</label>
              <InputNumber className={styles.setting_input} size='small' step={0.1} onChange={this.settingPageW.bind(this)} value={setting.pageW} />
            </Col>
            <Col span='12'>
              <label className={styles.setting_label}>高(mm)</label>
              <InputNumber className={styles.setting_input} size='small' step={0.1} onChange={this.settingPageH.bind(this)} value={setting.pageH} />
            </Col>
          </Row>
          <Row className={styles.mt5}>
            <Col span='12'>
              <label className={styles.setting_label}>边距上(mm)</label>
              <InputNumber className={styles.setting_input} size='small' step={0.1} onChange={this.settingPrintRangeTop.bind(this)} value={setting.prT} />
            </Col>
            <Col span='12'>
              <label className={styles.setting_label}>边距左(mm)</label>
              <InputNumber className={styles.setting_input} size='small' step={0.1} onChange={this.settingPrintRangeLeft.bind(this)} value={setting.prL} />
            </Col>
          </Row>
        </div>
        {presetFields && presetFields.length ? presetFields.map((item, key) => this._renderPreset(item, key)) : null }
        <h4 className={styles.set_h4}>自定义项</h4>
        <div className={styles.box}>
          <div className='ant-search-input-wrapper'>
            <InputGroup className='ant-search-input'>
              <Input size='small' placeholder='输入自定义文本' ref='inputCustText' defaultValue={this.state.insert_filed} onPressEnter={this.insertField.bind(this)} />
              <div className='ant-input-group-wrap'>
                <Button icon='enter' type='primary' size='small' className='ant-search-btn' onClick={this.insertField.bind(this)} />
              </div>
            </InputGroup>
          </div>
        </div>
        <div className={styles.custbox}>
          {typeof custBoxs !== 'undefined' && custBoxs.length && custBoxs.map((item, key) => this.renderCustLabel(item, key))}
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  setting: state.pm_setting,
  presetFields: state.pm_presetFields,
  print_setting: state.pm_print_setting
}))(Side)
