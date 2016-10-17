import React from 'react'
import {endLoading} from 'utils'
import stylesApp from 'components/App.scss'
import Toolbar from './Toolbar'
import Toolbar2 from './Toolbar2'
import List from './List'
import Test from './Test'
import ModifyModal from './ModifyModal'
import CheckinModal from './CheckinModal'
import styles from './index.scss'

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
        <div className={styles.main} ref='MFucker'>
          <div className={styles.listMain} style={{height: this.state.height}}><List /></div>
          <div className={styles.detailMain}>
            <div className={styles.toolbars2}>
              <div className={styles.drager} onMouseDown={this.handleLetUsGo} /><Toolbar2 />
            </div><Test />
          </div>
          <div className={styles.liner} style={this.state.styles} />
        </div>
        <ModifyModal />
        <CheckinModal />
      </div>
    )
  }
})
