/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-17 10:07:40
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import styles from './index.scss'
import {Button, Input, Select} from 'antd'
const Option = Select.Option
const Toolbar = React.createClass({
  getInitialState: function() {
    return {
      enabled: 'true'
    }
  },
  componentDidMount() {
    setTimeout(() => {
      this.handleSearch()
    }, 200)
  },
  handleCreateNew() {
    this.props.dispatch({type: 'COMPANY_CLIENT_VIS_SET', payload: 0})
  },
  handleSelect2(value) {
    this.setState({
      enabled: value
    })
  },
  handleSearch() {
    const {enabled} = this.state
    this.props.dispatch({type: 'COMPANY_CLIENTS_FILTER_CONDITIONS_SET', payload: {
      Filter: this.refs.keyword.refs.input.value,
      Enable: enabled
    }})
  },
  render() {
    return (
      <div className={styles.toolbars}>
        <div className={styles.conditionsForm}>
          <div className='pull-right'>
            <Button type='ghost' size='small' icon='plus' onClick={this.handleCreateNew}>新增客户</Button>
          </div>
          <div className={styles.s1}>
            <Input placeholder='搜索关键词' ref='keyword' onPressEnter={this.handleSearch} />
          </div>
          <Select
            className={styles.s2}
            value={this.state.enabled}
            onChange={this.handleSelect2}>
            <Option value='all'>全部状态</Option>
            <Option value='true'>启用</Option>
            <Option value='false'>禁用</Option>
          </Select>
          <Button type='primary' icon='search' className={styles.s3} onClick={this.handleSearch} loading={this.props.loading}>搜索</Button>
          <span className='hide' style={{marginLeft: 10}}>todo</span>
        </div>
      </div>
    )
  }
})
export default connect(state => ({
  loading: state.company_clients_loading
}))(Toolbar)
