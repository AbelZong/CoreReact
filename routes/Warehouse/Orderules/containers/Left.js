/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-05 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {
  ZGet,
  ZPost
} from 'utils/Xfetch'
import {
  Popconfirm,
  Button,
  Modal
} from 'antd'
import {
  startLoading,
  endLoading
} from 'utils/index'
import Wrapper from 'components/MainWrapper'
import styles from './index.scss'
export default connect(
  state => ({
    on_id: state.wher_ploys_vis
  })
)(Wrapper(React.createClass({
  getInitialState: function() {
    return {
      ploys: [],
      on_id: 0
    }
  },
  componentDidMount() {
    if (this.props.on_id >= 0) {
      this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: -1})
    }
    this.refreshDataCallback()
  },
  refreshDataCallback() {
    startLoading()
    // setTimeout(() => {
    //   this.setState({
    //     ploys: [
    //       {name: '雅鹿男装苍术1', id: 1},
    //         {name: '雅鹿男装苍术2', id: 2},
    //           {name: '雅鹿男装苍术3', id: 3},
    //             {name: '雅鹿男装苍术4', id: 4}
    //     ]
    //   })
    //   endLoading()
    // }, 100)
    ZGet('Warehouse/WarePloyList', ({d}) => {
      this.setState({
        ploys: d
      })
    }).then(endLoading)
  },
  handleModify(id) {
    if (this.props.on_id !== -1) {
      if (this.props.on_id !== id) {
        Modal.confirm({
          title: '当前有编辑策略，是否确定离开?',
          content: '【确定】离开后不会自动保存',
          onOk: () => {
            this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: id})
          }
        })
      }
    } else {
      this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: id})
    }
  },
  handleRemove(id) {
    startLoading()
    ZPost('Warehouse/wareSettingGet', {id}, () => {
      this.refreshDataCallback()
      if (this.props.on_id !== -1) {
        this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: -1})
      }
    }).then(() => {
      endLoading()
    })
  },
  handleAdd() {
    if (this.props.on_id !== -1) {
      if (this.props.on_id !== 0) {
        Modal.confirm({
          title: '当前有编辑策略，是否确定离开?',
          content: '【确定】离开后不会自动保存',
          onOk: () => {
            this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: 0})
          }
        })
      }
    } else {
      this.props.dispatch({type: 'WHER_PLOYS_VIS_SET', payload: 0})
    }
  },
  render() {
    const {ploys} = this.state
    const {on_id} = this.props
    return (
      <div className={`${styles.left} h-scroller`}>
        <div className={styles.add}>
          <Button type='ghost' size='small' onClick={this.handleAdd}>添加新策略</Button>
        </div>
        <ul className={styles.lst}>
          {ploys.map(x => <li key={x.id} className={on_id === x.id ? styles.active : ''}>
            <div className='clearfix'><span onClick={() => this.handleModify(x.id)}>{x.name}&emsp;<a>修改</a></span>
              <Popconfirm title='确认删除？无法恢复' onConfirm={this.handleRemove}>
                <a className='pull-right'>删除</a>
              </Popconfirm>
            </div>
          </li>)}
        </ul>
      </div>
    )
  }
})))
