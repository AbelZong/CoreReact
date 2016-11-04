/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-11-04 AM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {endLoading} from 'utils'
import styles from 'components/App.scss'
import Main from './Main'
class Container extends React.Component {
  componentDidMount = () => {
    endLoading()
  }
  render() {
    return (
      <div className={`${styles.content} flex-column`}>
        <Main />
      </div>
    )
  }
}
export default Container
