import React from 'react'
import {connect} from 'react-redux'
import styles from './Users.scss'
import {Button, Input, Select} from 'antd'
const Option = Select.Option

const Toolbar = React.createClass({
  getInitialState: function() {
    return {
      type: '1',
      enabled: 'all'
    }
  },
  componentDidMount() {
    setTimeout(() => {
      this.handleSearch()
    }, 200)
  },
  handleCreateNew() {
    this.props.dispatch({type: 'ADMIN_USERS_MODAL_VIS_SET', payload: 0})
  },
  handleSelect1(value) {
    this.setState({
      type: value
    })
  },
  handleSelect2(value) {
    this.setState({
      enabled: value
    })
  },
  handleSearch() {
    const {type, enabled} = this.state
    this.props.dispatch({type: 'ADMIN_USERS_FILTER_CONDITIONS_SET', payload: {
      FilterType: type,
      Filter: this.refs.keyword.refs.input.value,
      Enable: enabled
    }})
  },
  render() {
    const selectBefore = (
      <Select value={this.state.type} style={{ width: 80 }} onSelect={this.handleSelect1}>
        <Option value='1'>按账号</Option>
        <Option value='2'>用户名</Option>
      </Select>
    )
    return (
      <div className={styles.toolbars}>
        <div className={styles.conditionsForm}>
          <div className={styles.s1}>
            <Input addonBefore={selectBefore} placeholder='搜索关键词' ref='keyword' onPressEnter={this.handleSearch} />
          </div>
          <Select
            className={styles.s2}
            placeholder='账号状态'
            value={this.state.enabled}
            onChange={this.handleSelect2}>
            <Option value='all'>全部账号</Option>
            <Option value='true'>启用</Option>
            <Option value='false'>禁用</Option>
          </Select>
          <Button type='primary' icon='search' className={styles.s3} onClick={this.handleSearch} loading={this.props.loading}>搜索</Button>
        </div>
        <div className='pull-right'>
          <Button type='ghost' size='small' icon='plus' onClick={this.handleCreateNew}>新增用户</Button>
        </div>
      </div>
    )
  }
})

export default connect(state => ({
  loading: state.admin_users_loading
}))(Toolbar)
