import React from 'react'
import {connect} from 'react-redux'
import styles from './Wareset.scss'
import { Input, Button } from 'antd'
const InputGroup = Input.Group
import classNames from 'classnames'

class Toolbar extends React.Component {

  render() {
    const { size, placeholder } = this.props
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.value.trim()
    })
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus
    })
    return (
      <div className={styles.toolbars}>
        <InputGroup className={searchCls}>
          <Input placeholder={placeholder} value={this.state.value} onChange={this.handleInputChange}
            onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
          />
          <div className='ant-input-group-wrap'>
            <Button icon='search' className={btnCls} size={size} onClick={this.handleSearch} />
          </div>
        </InputGroup>
      </div>
    )
  }
}

export default connect()(Toolbar)
