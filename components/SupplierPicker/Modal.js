import React from 'react'
import {Spin, Modal, Radio, Button, Input} from 'antd'
import ScrollerBar from 'components/Scrollbars/index'
import styles from './index.scss'
const RadioGroup = Radio.Group
import {ZGet} from 'utils/Xfetch'

export default React.createClass({
  getInitialState: function() {
    return {
      spinning: false,
      value: null,
      fKey: null,
      dataList: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({
        spinning: true,
        dataList: []
      })
      ZGet({
        uri: 'Common/ScoCompanySimple',
        success: (s, d, m) => {
          this.setState({
            spinning: false,
            dataList: d,
            value: nextProps.value
          })
        }
      })
    }
  },
  handleOK() {
    const {value} = this.state
    const valueName = this.state.dataList.filter(x => x.id === value)[0].sconame
    this.props.onOk(value, valueName)
  },
  handleFilter(e) {
    const val = e.target.value.trim()
    this.setState({
      fKey: val === '' ? null : val
    })
  },
  renderFooter() {
    return (
      <div className={styles.footer}>
        <div className='clearfix'>
          <Button type='primary' onClick={this.handleOK}>确认</Button>
          <Input className={styles.filterInput} placeholder='搜索，按回车确认' onPressEnter={this.handleFilter} />
        </div>
      </div>
    )
  },
  handleRadio(e) {
    this.setState({
      value: e.target.value,
      valueName: e.target.name
    })
  },
  render() {
    const {fKey} = this.state
    const dataList = fKey === null ? this.state.dataList : this.state.dataList.filter(x => x.sconame.indexOf(fKey) !== -1)
    return (
      <Modal title='选择供应商' visible={this.props.visible} onCancel={this.props.onCancel} footer={this.renderFooter()} width={780}>
        <div className={styles.hua}>
          <Spin size='large' spinning={this.state.spinning} />
          {dataList.length > 0 ? (
            <div className={styles.dataList}>
              <ScrollerBar autoHide>
                <RadioGroup onChange={this.handleRadio} value={this.state.value}>
                  {dataList.map((x) => <Radio key={x.id} value={x.id}><span title={x.scosimple}>{x.sconame}</span></Radio>)}
                </RadioGroup>
              </ScrollerBar>
            </div>
          ) : (
            <div>
              NULL
            </div>
          )}
        </div>
      </Modal>
    )
  }
})
