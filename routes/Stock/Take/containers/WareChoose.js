/**
* This file is part of the <智鼠> application.
*
* Version: 0.0.1
* Description:
*
* Author: JieChen
* Date  :
* Last Updated:
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
import React from 'react'
import {connect} from 'react-redux'
import {Modal, Radio, Form} from 'antd'
import {ZGet, ZPost} from 'utils/Xfetch'
import EE from 'utils/EE'
const RadioGroup = Radio.Group
const createForm = Form.create
const FormItem = Form.Item

export default connect(state => ({
  doge: state.stock_take_ware_vis
}))(createForm()((React.createClass({
  getInitialState() {
    return {
      visible: false,
      title: '',
      confirmLoading: false,
      houselist: []
    }
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.doge !== nextProps.doge) {
      if (nextProps.doge < 0) {
        this.setState({
          visible: false,
          confirmLoading: false
        })
      } else if (nextProps.doge === 0) {
        this.setState({
          visible: true,
          title: '',
          confirmLoading: false
        })
      } else {
        const uri = 'Common/GetChildWarehouseList'
        ZGet(uri, null, ({d}) => {
          this.setState({
            visible: true,
            title: `选择仓库`,
            confirmLoading: false,
            houselist: d
          })
        })
      }
    }
  },
  hideModal() {
    this.props.dispatch({ type: 'STOCK_TAKE_WARE_VIS_SET', payload: -1 })
    this.props.form.resetFields()
  },
  handleGridReady(grid) {
    this.grid = grid
  },
  handleCancel() {
    this.props.dispatch({type: 'STOCK_TAKE_WARE_VIS_SET', payload: 0})
  },
  handleOk() {
    this.props.form.validateFieldsAndScroll((errors, v) => {
      if (errors) {
        return
      }
      if (v.Ware !== undefined) {
        let obj = v.Ware.split('-')
        let uri = 'XyCore/StockTake/InsertTakeMain'
        let data = {
          Parent_WhID: obj[0],
          WhID: obj[1]
        }
        ZPost(uri, data, (d) => {
          this.hideModal()
          EE.triggerRefreshMain()
          this.setState({
            confirmLoading: false
          })
        })
      }
    })
  },
  render() {
    const { getFieldDecorator } = this.props.form
    const {visible, title, confirmLoading} = this.state
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px'
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.hideModal} confirmLoading={confirmLoading} width={400} >
        <Form>
          <FormItem>
            {getFieldDecorator('Ware')(
              <RadioGroup>
                {this.state.houselist.map((x) => {
                  return <Radio style={radioStyle} key={x.id} value={`${x.parentid}-${x.id}`}>{x.warehousename}</Radio>
                })}
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}))))

