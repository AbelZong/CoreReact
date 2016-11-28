/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-28 09:29:06
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import styles from './index.scss'
import {Icon, Popconfirm} from 'antd'
import {ZGet, ZPost} from 'utils/Xfetch'

export default React.createClass({
  getInitialState() {
    return {
      exprs: []
    }
  },
  componentWillMount() {
    this._firstBlood()
  },
  refreshDataCallback() {
    this._firstBlood()
  },
  _firstBlood() {
    this.setState({
      exprs: [
        {ID: '1', Name: '圆通快递', Detail: {
          'ID': '1',
          'StartWeight': '10',
          'StartFee': '10',
          'AddWeight': '10',
          'AddFee': '10',
          'CalcType': 'start_and_more',
          'WeightOff': '10',
          'items': [
            {
              'Destination': {
                '江苏': '苏州市,淮安市'
              },
              'StartWeight': '1',
              'StartFee': '1',
              'AddWeight': '1',
              'AddFee': '1',
              'Ranges': [
                {
                  'MinWeight': '1',
                  'MaxWeight': '2',
                  'StartWeight': '3',
                  'StartFee': '3',
                  'AddWeight': '3',
                  'AddFee': '3'
                }
              ]
            }
          ]
        }},
        {ID: '2', Name: 'EMS', Detail: null},
        {ID: '3', Name: '顺丰速运', Detail: null}
      ]
    })
    // ZGet('', ({d}) => {
    //   this.setState(d)
    // })
  },
  render() {
    return (
      <div className={styles.main}>
        {this.state.exprs.length ? this.state.exprs.map(x => <Tt key={x.ID} {...x} />) : (
          <div className='mt20 tc'>请先设置 物流（快递）公司 信息</div>
        )}
      </div>
    )
  }
})
const Tt = connect()(React.createClass({
  render() {
    return (
      <div className={styles.Tt}>
        <h3>{this.props.Name}</h3>
        <div className='flex-row'>
          <div className={styles.l}>
            左边
          </div>
          <div className={styles.r}>
            右边<br />边
          </div>
        </div>
      </div>
    )
  }
}))
