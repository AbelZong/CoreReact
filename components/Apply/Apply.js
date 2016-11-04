/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-09-01 13:47:19
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Icon} from 'antd'
import { Link } from 'react-router'
import {endLoading} from 'utils'
import styles from './Apply.scss'

class Register extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
    this.timer = null
  }

  componentDidMount() {
    endLoading()
  }

  componentWillUnMount() {
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <div className={styles.zhang}>
            <Link to='/go/login'><Icon type='rollback' />返回</Link> 暂不对外开放申请，敬请关注
          </div>
        </div>
      </div>
    )
  }
}

export default Register
