import React from 'react'
import {connect} from 'react-redux'
import styles from './Wareset.scss'
// import { Input, Button } from 'antd'
// const InputGroup = Input.Group;

const Main = React.createClass({
  render() {
    return (
      <div className={styles.main}>
      引入 components/grid
      </div>
    )
  }
})

export default connect()(Main)
