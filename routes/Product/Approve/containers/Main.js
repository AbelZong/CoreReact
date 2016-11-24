import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Icon, Button} from 'antd'
import styles from './index.scss'


const Main = React.createClass({

  getInitialState() {
    return {
      collapse: false
    }
  },
  render() {
    console.log(' -- component {Main} render...')
    const {collapse} = this.state
    return (
      <div className={styles.main} ref='main'>
        <div className={styles.title}>
          {collapse
            ? <Button type='ghost' size='small' shape='circle' icon='right' onClick={this.handleCollapseChange} />
            : <Button type='dashed' size='small' shape='circle' icon='left' onClick={this.handleCollapseChange} />}
        </div>
      </div>
    )
  }
})

export default Main
