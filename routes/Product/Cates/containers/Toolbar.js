import React from 'react'
import {
  connect
} from 'react-redux'
import styles from './index.scss'
import {
  Button,
  Breadcrumb,
  message
} from 'antd'
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
            <Button size='small' className='hide'>
              导入淘宝店铺类目
            </Button>
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
