import React from 'react'
import {connect} from 'react-redux'
import { Input, Button, Radio } from 'antd'
import classNames from 'classnames'
import styles from './Shop.scss'

const InputGroup = Input.Group
const RadioGroup = Radio.Group
const SearchInput = React.createClass({
  getInitialState() {
    return {
      value: '',
      shopenable: '',
      focus: false
    }
  },
  handleInputChange(e) {
    this.setState({
      value: e.target.value
    })
  },
  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement,
      value: e.target.value
    })
  },
  handleSearch() {
    this.props.dispatch({ type: 'SHOP_LIST', payload: this.state.value })
  },
  handleRadioChange(e) {
    console.log('radio checked', e.target.value)
    this.setState({
      shopenable: e.target.value
    })
    this.props.dispatch({ type: 'SHOP_ENABLE', payload: e.target.value })
  },
  render() {
    const { style, size, placeholder } = this.props
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.value.trim()
    })
    const searchCls = classNames({
      'ant-search-input': true,
      [`${styles.searchInput}`]: true,
      [`${styles.pullleft}`]: true,
      'ant-search-input-focus': this.state.focus
    })
    const searchRadio = {
      [`${styles.pullleft}`]: true,
      [`${styles.searchRadio}`]: true
    }
    return (
      <div className={styles.search} style={style}>
        <InputGroup className={searchCls} >
          <Input placeholder={placeholder} onChange={this.handleInputChange}
            onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
          />
          <div className='ant-input-group-wrap'>
            <Button icon='search' className={btnCls} size={size} onClick={this.handleSearch} />
          </div>
        </InputGroup>
        <div className={styles.searchTitle}>启用状态: </div>
        <RadioGroup onChange={this.handleRadioChange} className={searchRadio}>
          <Radio key='a' value='ALL'>全部</Radio>
          <Radio key='b' value='TRUE'>启用</Radio>
          <Radio key='c' value='FALSE'>禁用</Radio>
        </RadioGroup>
      </div>
    )
  }
})

export default connect(state => ({
  filter: state.shop_list,
  shopenable: state.shop_enable
}))(SearchInput)
