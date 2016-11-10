/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-09 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  Modal,
  Row,
  Col,
  Button
} from 'antd'
import styles from './index.scss'
import {
  ZGet
} from 'utils/Xfetch'
import {
  startLoading,
  endLoading
} from 'utils/index'
const DEF_STATES = {
  visible: false,
  title: '选择商品类目',
  value: null,
  valueName: '',
  stand0: null,
  stand1: null,
  stand2: null,
  stand3: null,
  stand0_select: null,
  stand1_select: null,
  stand2_select: null,
  stand3_select: null
}
export default React.createClass({
  getInitialState: function() {
    return DEF_STATES
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && this.props.visible !== nextProps.visible) {
      this.setState(Object.assign({}, DEF_STATES, {
        visible: true,
        title: nextProps.value > 0 ? '重新选择商品类目' : '选择商品类目'
      }))
      ZGet('XyComm/Customkind/GetCustomCats', {ParentID: 0}, ({d}) => {
        this.setState(Object.assign({}, DEF_STATES, {
          visible: true,
          stand0: d
        }))
      }, () => {
        this.setState(Object.assign({}, DEF_STATES))
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
  //<Button type='ghost' onClick={this.handleOk}>清除</Button>
  renderFooter() {
    return (
      <div className={styles.footer}>
        <div className='clearfix'>
          <Button onClick={this.handleok}>关闭</Button>
          <Button type='primary' onClick={this.handleOK} disabled={this.state.value < 1}>确定</Button>
        </div>
      </div>
    )
  },
  handleSwitch(x, index) {
    if (x.IsParent) {
      startLoading()
      return ZGet({
        uri: 'XyComm/Customkind/GetCustomCats',
        data: {
          ParentID: x.ID
        },
        success: ({d}) => {
          const _states = {
            [`stand${index}_select`]: x.ID,
            [`stand${index + 1}`]: d,
            value: null,
            valueName: ''
          }
          if (index + 2 <= 3) {
            for (let i = index + 2; i <= 3; i++) {
              _states[`stand${i}`] = null
              _states[`stand${i}_select`] = 0
            }
          }
          this.setState(_states)
        }
      }).then(endLoading)
    } else {
      const _states = {
        [`stand${index}_select`]: x.ID,
        value: x.ID,
        valueName: x.Name
      }
      if (index + 1 <= 3) {
        for (let i = index + 1; i <= 3; i++) {
          _states[`stand${i}`] = null
          _states[`stand${i}_select`] = 0
        }
      }
      this.setState(_states)
    }
  },
  render() {
    const {title, stand0, stand0_select, stand1, stand1_select, stand2, stand2_select, stand3, stand3_select} = this.state
    return (
      <Modal title={title} visible={this.props.visible} onCancel={this.props.onCancel} footer={this.renderFooter()} width={880}>
        <div className={styles.hua}>
          <div className={styles.dataList}>
            <Row className={styles.ss}>
              <Col span={6} className='h-scroller'>
                <ul>
                  {stand0 && stand0.length ? stand0.map(x => <li key={x.ID} className={x.ID === stand0_select ? styles.se : null} onClick={() => this.handleSwitch(x, 0)}>{x.Name}</li>) : null}
                </ul>
              </Col>
              <Col span={6} className='h-scroller'>
                <ul>
                  {stand1 && stand1.length ? stand1.map(x => <li key={x.ID} className={x.ID === stand1_select ? styles.se : null} onClick={() => this.handleSwitch(x, 1)}>{x.Name}</li>) : null}
                </ul>
              </Col>
              <Col span={6} className='h-scroller'>
                <ul>
                  {stand2 && stand2.length ? stand2.map(x => <li key={x.ID} className={x.ID === stand2_select ? styles.se : null} onClick={() => this.handleSwitch(x, 2)}>{x.Name}</li>) : null}
                </ul>
              </Col>
              <Col span={6} className='h-scroller'>
                <ul>
                  {stand3 && stand3.length ? stand3.map(x => <li key={x.ID} className={x.ID === stand3_select ? styles.se : null} onClick={() => this.handleSwitch(x, 3)}>{x.Name}</li>) : null}
                </ul>
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    )
  }
})
