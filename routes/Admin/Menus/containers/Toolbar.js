import React from 'react'
import {connect} from 'react-redux'
import styles from './Menus.scss'
import {Button} from 'antd'
import ModifyModal from './ModifyModal'

const Toolbar = React.createClass({
  handleCreateNew() {
    this.props.dispatch({type: 'ADMIN_MENUS_MODAL_VIS_SET', payload: 0})
  },
  render() {
    return (
      <div className={styles.toolbars}>
        <div className='pull-right'>
          <Button type='ghost' size='small' icon='plus' onClick={this.handleCreateNew}>新增菜单</Button>
        </div>
        <ModifyModal />
      </div>
    )
  }
})

export default connect()(Toolbar)
