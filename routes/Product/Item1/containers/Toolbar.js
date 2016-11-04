/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: HuaZhang <yahveh.zh@gmail.com>
* Date  : 2016-10-27 09:52:36
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {
  connect
} from 'react-redux'
import styles from './index.scss'
import {
  Button,
  Breadcrumb,
  message,
  Popconfirm
} from 'antd'
import {
  startLoading,
  endLoading
} from 'utils/index'
import {ZPost} from 'utils/Xfetch'
const ButtonGroup = Button.Group
export default connect(state => ({
  breads: state.product_cat_breads
}))(React.createClass({
  handleCreateNew1() {
    this.props.dispatch({type: 'PRODUCT_CAT_VIS_SET', payload: -1})
  },
  handleCreateNew2() {
    this.props.dispatch({type: 'PRODUCT_CAT_VIS_SET', payload: -2})
  },
  handleGotoCate(ParentID) {
    const index = this.props.breads.findIndex(x => x.id === ParentID)
    if (index > -1) {
      if (index < this.props.breads.length) {
        this.props.dispatch({type: 'PRODUCT_CAT_BREADS_UPDATE', update: {
          $splice: [[index + 1]]
        }})
      }
      this.props.dispatch({type: 'PRODUCT_CAT_CONDITIONS_SET', payload: {
        ParentID
      }})
    } else {
      message.error('error parent id')
    }
  },
  handleImports() {
    startLoading()
    ZPost('XyComm/Customkind/InsertTmaoKind', () => {
      this.props.dispatch({type: 'PRODUCT_CAT_CONDITIONS_SET', payload: {
        ParentID: 0
      }})
    }).then(endLoading)
  },
  render() {
    return (
      <div className={styles.toolbars}>
        <div className='pull-right'>
          <ButtonGroup>
            <Button type='primary' size='small' icon='plus' onClick={this.handleCreateNew1}>
              添加标准类目
            </Button>
            <Button type='ghost' size='small' onClick={this.handleCreateNew2}>
              添加自定义类目
            </Button>
            <Popconfirm onConfirm={this.handleImports} title={<div style={{maxWidth: 290}}>导入的类目直接作为根类目存在。<br />如果是刚授权的店铺，可能需要一段时间（一般授权完30分钟内）待商品信息完全下来才能导入。<br />从线上拉取类目信息需要一定时间，请耐心等待。</div>}>
              <Button size='small'>
                导入淘宝店铺类目
              </Button>
            </Popconfirm>
          </ButtonGroup>
        </div>
        <Breadcrumb separator='>'>
          {(this.props.breads && this.props.breads.length) ? this.props.breads.map(x => <Breadcrumb.Item key={x.id}><Button size='small' onClick={() => this.handleGotoCate(x.id)}>{x.name}</Button></Breadcrumb.Item>) : null}
        </Breadcrumb>
        <div className='clearfix' />
      </div>
    )
  }
}))
