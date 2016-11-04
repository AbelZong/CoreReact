/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-15 17:37:26
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {Spin, Modal, Tree, Button} from 'antd'
import ScrollerBar from 'components/Scrollbars/index'
import styles from './index.scss'
import {listToTree} from 'utils/index'
import {ZGet} from 'utils/Xfetch'
const TreeNode = Tree.TreeNode
const loop = data => data.map((item) => {
  if (item.children && item.children instanceof Array && item.children.length) {
    return (
      <TreeNode key={item.id} title={item.warehousename}>
        {loop(item.children)}
      </TreeNode>
    )
  }
  return <TreeNode key={item.id} title={item.warehousename} />
})
export default React.createClass({
  getInitialState: function() {
    return {
      spinning: false,
      value: null,
      valueName: '',
      dataList: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({
        spinning: true,
        dataList: []
      })
      ZGet({
        uri: 'Common/GetWarehouseAll',
        success: ({d}) => {
          this.setState({
            spinning: false,
            dataList: listToTree(d, {
              parentKey: 'parentid'
            }),
            value: nextProps.value
          })
        }
      })
    }
  },
  handleOK() {
    const {value, valueName} = this.state
    this.props.onOk(value, valueName)
  },
  handleOk() {
    this.setState({
      value: null,
      valueName: ''
    }, () => {
      this.props.onOk(null, '')
    })
  },
  handleok() {
    this.props.onCancel()
  },
  renderFooter() {
    return (
      <div className={styles.footer}>
        <div className='clearfix'>
          <Button onClick={this.handleok}>关闭</Button>
          <Button type='ghost' onClick={this.handleOk}>清除</Button>
          <Button type='primary' onClick={this.handleOK}>确认</Button>
        </div>
      </div>
    )
  },
  handleRadio(e, d) {
    this.setState({
      value: e[0],
      valueName: d.selectedNodes[0].props.title
    })
  },
  render() {
    return (
      <Modal title='选择第三方物流或分仓' visible={this.props.visible} onCancel={this.props.onCancel} footer={this.renderFooter()} width={420}>
        <div className={styles.hua}>
          <Spin size='large' spinning={this.state.spinning} />
          {this.state.dataList.length > 0 ? (
            <div className={styles.dataList}>
              <ScrollerBar autoHide>
                <Tree defaultExpandAll multiple={false} onSelect={this.handleRadio} selectedKeys={[this.state.value]}>
                  {loop(this.state.dataList)}
                </Tree>
              </ScrollerBar>
            </div>
          ) : (
            <div>
              NULL
            </div>
          )}
        </div>
      </Modal>
    )
  }
})
