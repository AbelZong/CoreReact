/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-30 14:46:38
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {endLoading} from 'utils'
import styles from 'components/App.scss'
import Toolbar from './Toolbar'
import Main from './Main'

class Container extends React.Component {
  componentDidMount = () => {
    endLoading()
  }
  render() {
    return (
      <div className={`${styles.content} flex-column`}>
        <Toolbar />
        <Main />
      </div>
    )
  }
}

export default connect()(Container)
