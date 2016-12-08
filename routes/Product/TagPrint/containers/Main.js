import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Icon, Button} from 'antd'
import styles from './index.scss'


const Batch = React.createClass({

  getInitialState() {
    return {
      collapse: false
    }
  },
  render() {
    return (
      <div className={styles.main} ref='main' >
        main
      </div>
    )
  }
})

export default Batch
