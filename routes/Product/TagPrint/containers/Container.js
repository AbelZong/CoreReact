import React from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'
import {endLoading} from 'utils'
import istyles from './index.scss'
import styles from 'components/App.scss'

import MainWrapper from 'components/MainWrapper'
import Batch from './Batch'
import Main from './Main'
import Brand from './Brand'

class TestContainer extends React.Component {
  state = {
    linum: 1
  }
  componentDidMount() {
    endLoading()
  }
  refreshDataCallback() {
    console.warn('getFirst Data')
  }
  changeDiv(e, i) {
    this.setState({
      linum: i
    })
  }
  render() {
    return (
      <div className={`${styles.content} flex-row`}>
        <div className={`${istyles.left} h-scroller`}>
          <ul className={istyles.lst}>
            <li className={this.state.linum === 1 ? istyles.on : ''} onClick={e => this.changeDiv(e, 1)}>
              打印吊牌/件码
            </li>
            <li className={this.state.linum === 2 ? istyles.on : ''} onClick={e => this.changeDiv(e, 2)}>
              批量导入打印吊牌/件码
            </li>
            <li className={this.state.linum === 3 ? istyles.on : ''} onClick={e => this.changeDiv(e, 3)}>
              店铺绑定品牌打印吊牌
            </li>
          </ul>
        </div>
        <div className={istyles.inline} style={{display: this.state.linum === 1 ? 'inline-flex' : 'none'}}>
          <Main />
        </div>
        <div className={istyles.inline} style={{display: this.state.linum === 2 ? 'inline-flex' : 'none'}}>
          <Batch />
        </div>
        <div className={istyles.inline} style={{display: this.state.linum === 3 ? 'inline-flex' : 'none'}}>
          <Brand />
        </div>
      </div>
    )
  }
}

export default connect()(MainWrapper(TestContainer))
