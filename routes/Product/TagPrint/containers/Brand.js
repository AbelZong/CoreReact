import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Icon, Button} from 'antd'
import styles from './index.scss'


const Brand = React.createClass({

  getInitialState() {
    return {
      collapse: false
    }
  },
  render() {
    return (
      <div className={styles.main} ref='Brand' >
        Brand
      </div>
    )
  }
})

export default Brand
