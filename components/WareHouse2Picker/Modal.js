/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-01 13:44:10
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Spin, Modal, Radio, Button} from 'antd'
import ScrollerBar from 'components/Scrollbars/index'
import styles from './index.scss'
import {ZGet} from 'utils/Xfetch'
const RadioGroup = Radio.Group
export default React.createClass({
  getInitialState: function() {
    return {
      spinning: false,
      value: null,
      valueName: '',
      dataList: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && this.props.visible !== nextProps.visible) {
      this.setState({
        spinning: true,
        dataList: []
      })
      ZGet({
        uri: 'Warehouse/wareLst',
        success: ({d}) => {
          const lst = d.Lst && d.Lst instanceof Array ? d.Lst : []
          if (this.props.withLocal) {
            lst.unshift({
              id: 0,
              coid: 0,
              warename: '本仓'
              //warename: <span style={{color: 'green'}}>{`{本仓}`}</span>
            })
          }
          this.setState({
            spinning: false,
            dataList: lst,
            value: nextProps.value
          })
        },
        error: () => {
          this.setState({
            spinning: false
          })
        }
      })
    }
  },
  handleOK() {
    const {value, valueName} = this.state
    this.props.onOk(value, valueName)
  },
  handleOk() {
    this.setState({
      value: null,
      valueName: ''
    }, () => {
      this.props.onOk(null, '')
    })
  },
  handleok() {
    this.props.onCancel()
  },
  renderFooter() {
    return (
      <div className={styles.footer}>
        <div className='clearfix'>
          <Button onClick={this.handleok}>关闭</Button>
          <Button type='ghost' onClick={this.handleOk}>清除</Button>
          <Button type='primary' onClick={this.handleOK}>确认</Button>
        </div>
      </div>
    )
  },
  handleRadio(e) {
    this.setState({
      value: e.target.value,
      valueName: this.state.dataList.filter(x => x.id === e.target.value)[0].warename
    })
  },
  render() {
    return (
      <Modal title='选择第三方物流或分仓' visible={this.props.visible} onCancel={this.props.onCancel} footer={this.renderFooter()} width={320}>
        <div className={styles.hua}>
          <Spin size='large' spinning={this.state.spinning} />
          {this.state.dataList.length > 0 ? (
            <div className={styles.dataList}>
              <ScrollerBar autoHide>
                <RadioGroup onChange={this.handleRadio} value={this.state.value}>
                  {this.state.dataList.map(x => <Radio key={x.id} value={x.id}>{x.warename}</Radio>)}
                </RadioGroup>
              </ScrollerBar>
            </div>
          ) : (
            <div />
          )}
        </div>
      </Modal>
    )
  }
})
