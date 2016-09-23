import React from 'react'
//import classNames from 'classnames'
import {connect} from 'react-redux'
import {Button} from 'antd'
import appStyles from 'components/App.scss'
//import styles from './Print.scss'
import Wrapper from 'components/MainWrapper'
//import {startLoading, endLoading} from 'utils'
import AdminCollapseBtn from './AdminCollapseBtn'
import AdminTable from './AdminTable'

class AdminPanel extends React.Component {
  state = {
    data: null
  }
  componentWillMount() {
    this.refreshDataCallback()
  }
  componentWillUnmount() {
  }

  refreshDataCallback = () => {
  }
  render() {
    return (
      <div className={`${appStyles.main} flex-column`}>
        <div className={appStyles.toolbar}>
          <div className='flex-row'>
            <AdminCollapseBtn />
            <div className={appStyles.tools}>
              <div className='pull-right'>
                <Button type='ghost' size='small' icon='plus'>新增预设</Button>
              </div>
            </div>
          </div>
        </div>
        <AdminTable />
      </div>
    )
  }
}

export default connect()(Wrapper(AdminPanel))
