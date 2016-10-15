import React from 'react'
import {connect} from 'react-redux'
import styles from './Shop.scss'
import {Button, Input, Select} from 'antd'
import ModifyModal from './ModifyModal'
const Option = Select.Option

const Toolbar = React.createClass({
  getInitialState() {
    return {
      filter: '',
      enabled: 'ALL'
    }
  },
  componentDidMount() {
    setTimeout(() => {
      this.handleSearch()
    }, 200)
  },
  handleCreateNew() {
    this.props.dispatch({type: 'SHOP_MODIFY_VISIABLE', payload: 0})
  },
  handleSelect2(value) {
    this.setState({
      enabled: value
    })
    setTimeout(() => {
      this.handleSearch()
    }, 200)
  },
  handleSearch() {
    const {enabled} = this.state
    this.props.dispatch({type: 'SHOP_LIST',
    payload: {
      Filter: this.refs.keyword.refs.input.value,
      Enable: enabled
    }})
  },
  render() {
    return (
      <div className={styles.toolbars}>
        <div className={styles.conditionsForm}>
          <div className={styles.s1}>
            <Input placeholder='关键字: 店铺名, 掌柜, 站点' ref='keyword' onPressEnter={this.handleSearch} />
          </div>
          <Select
            className={styles.s2}
            placeholder='启用状态'
            value={this.state.enabled}
            onChange={this.handleSelect2}>
            <Option value='ALL'>全部</Option>
            <Option value='TRUE'>启用</Option>
            <Option value='FALSE'>禁用</Option>
          </Select>
          <Button type='primary' icon='search' className={styles.s3} onClick={this.handleSearch} loading={this.props.loading}>搜索</Button>
        </div>
        <div className='pull-right' >
          <Button type='ghost' size='small' icon='plus' onClick={this.handleCreateNew}>新增店铺</Button>
        </div>
        <ModifyModal />
      </div>
    )
  }
})

export default connect(state => ({
  shopconditions: state.shop_list
}))(Toolbar)
