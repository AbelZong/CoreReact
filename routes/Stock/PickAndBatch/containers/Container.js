/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-12-08 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {endLoading} from 'utils'
import styles from 'components/App.scss'
import Main from './Main'
import Toolbar from './Toolbar'
import LimitModal from './LimitModal'
import LimitSetModal from './LimitSetModal'
import SetPickor from './SetPickor'
import BatchLog from './BatchLog'
import BatchDetail from './BatchDetail'
import BatchUnique from './BatchUnique'
import SaleOut from './SaleOut'

export default React.createClass({
  componentDidMount() {
    endLoading()
  },
  render() {
    return (
      <div className={`${styles.content} flex-column`}>
        <Toolbar />
        <Main />
        <LimitModal />
        <LimitSetModal />
        <SetPickor />
        <BatchLog />
        <BatchDetail />
        <BatchUnique />
        <SaleOut />
      </div>
    )
  }
})
