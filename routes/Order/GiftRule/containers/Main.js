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

export default connect()(React.createClass({
  refreshDataCallback() {
    this._firstBlood()
  },
  _firstBlood(_data) {
    const conditions = _data || this.props.conditions || {}
    this.grid.showLoading()
    const uri = 'admin/power'
    const data = Object.assign({
      Page: 1,
      PageSize: this.grid.getPageSize()
    }, conditions)
    ZGet(uri, data, ({d}) => {
      this.grid.setDatasource({
        total: d.total,
        rowData: d.list,
        page: d.page,
        getRows: (params) => {
          if (params.page === 1) {
            this._firstBlood()
          } else {
            const qData = Object.assign({
              Page: params.page,
              PageSize: params.pageSize
            }, this.props.conditions)
            ZGet(uri, qData, ({d}) => {
              params.success(d.list)
            }, ({m}) => {
              params.fail(m)
            })
          }
        }
      })
    })
  },
  render() {
    return (
      <div className={styles.main}>
	  sdf
      </div>
    )
  }
}))

