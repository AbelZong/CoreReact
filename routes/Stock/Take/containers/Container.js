/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: ChenJie <827869959@qq.com>
* Date  : 2016-11-28 PM
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {endLoading} from 'utils'
import stylesApp from 'components/App.scss'
import styles from './index.scss'
import Main from './Main'
import Toolbar from './Toolbar'
import Toolbar2 from './Toolbar2'
import Detailed from './Detailed'

export default React.createClass({
  getInitialState() {
    return {
      styles: {
        display: 'none'
      },
      height: 360
    }
  },
  componentDidMount() {
    endLoading()
  },
  handleGoCancel() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  runRunRun(e) {
    const mdzz = this.refs.MFucker.getBoundingClientRect().top
    const oriTop = e.clientY - mdzz
    this.setState({
      styles: {
        top: oriTop,
        display: 'block'
      }
    })
    const mme = (e) => {
      let top = e.clientY - mdzz - 2
      if (top >= 180 && top <= 660) {
        this.setState({
          styles: {
            top
          }
        })
      }
    }
    const nne = (e) => {
      window.removeEventListener('mousemove', mme, false)
      window.removeEventListener('mouseup', nne, false)
      let top = e.clientY - mdzz
      if (oriTop === top) {
        this.setState({
          styles: {
            display: 'none'
          }
        })
        return
      }
      top = Math.max(180, top)
      top = Math.min(660, top)
      this.setState({
        styles: {
          display: 'none'
        },
        height: top - 16
      })
    }
    window.addEventListener('mousemove', mme, false)
    window.addEventListener('mouseup', nne, false)
  },
  handleLetUsGo(e) {
    e.preventDefault()
    this.runRunRun(e)
  },
  render() {
    return (
      <div className={`${stylesApp.content} flex-column`}>
        <div className={styles.toolbars}><Toolbar /></div>
        <div className={styles.main} ref='MFucker' >
          <div className={styles.listMain} style={{height: this.state.height}}>
            <Main />
          </div>
          <div className={styles.detailMain}>
            <div className={styles.toolbars2}>
              <div className={styles.drager} onMouseDown={this.handleLetUsGo} />
              <Toolbar2 />
            </div>
            <Detailed />
          </div>
          <div className={styles.liner} style={this.state.styles} />
        </div>
      </div>
    )
  }
})
