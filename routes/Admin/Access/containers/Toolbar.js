import React from 'react'
import {
  connect
} from 'react-redux'
import styles from './Access.scss'
import {
  Button,
  Input
} from 'antd'
import ModifyModal from './ModifyModal'
import Wrapper from 'components/MainWrapper'
const Toolbar = React.createClass({
  componentDidMount() {
    setTimeout(() => {
      this.handleSearch()
    }, 200)
  },
  handleCreateNew() {
    this.props.dispatch({type: 'ACCESS_MODIFY_VISIABLE', payload: 0})
  },
  refreshDataCallback() {
    this.handleSearch()
  },
  handleSearch() {
    this.props.dispatch({type: 'ACCESS_LIST',
    payload: {
      Filter: this.refs.keyword.refs.input.value
    }})
  },
  render() {
    return (
      <div className={styles.toolbars}>
        <ModifyModal />
        <div className={styles.conditionsForm}>
          <div className='pull-right'>
            <Button type='ghost' size='small' icon='plus' onClick={this.handleCreateNew}>
              新增权限
            </Button>
          </div>
          <div className={styles.s1}>
            <Input placeholder='在权限名称或标题中搜索' ref='keyword' onPressEnter={this.handleSearch} />
          </div>
          <Button className={styles.s3} type='primary' icon='search' onClick={this.handleSearch} loading={this.props.loading}>
            搜索
          </Button>
          <div className='clearfix' />
        </div>
      </div>
    )
  }
})
export default connect(state => ({
  conditions: state.access_list
}))(Wrapper(Toolbar))
