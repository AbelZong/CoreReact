import React from 'react'
import {connect} from 'react-redux'
import { Icon, Button } from 'antd'
import appStyles from 'components/App.scss'

class AdminSide extends React.Component {
  state = {
    activeID: -1
  }

  render() {
    return (
      <aside className={appStyles.aside}>
        <div className={appStyles.box}>
          <div className={appStyles.header}>
            <span className={appStyles.name}>模板类型</span>
          </div>
          <div className={appStyles.toolbar}>
            <div className={appStyles.r}>
              <Button type='ghost' size='small' icon='plus'>新增类型</Button>
            </div>
          </div>
          <div className={appStyles.inner}>
            <ul className={appStyles.items}>
              <li><span className={appStyles.name}>汇总拣货单</span>
                <div className={appStyles.operators}><Icon type='edit' /><Icon type='delete' /></div>
              </li>
              <li><span className={appStyles.name}>汇总拣货单</span>
                <div className={appStyles.operators}><Icon type='edit' /><Icon type='delete' /></div>
              </li>
              <li><span className={appStyles.name}>汇总拣货单</span>
                <div className={appStyles.operators}><Icon type='edit' /><Icon type='delete' /></div>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    )
  }
}

export default connect()(AdminSide)
