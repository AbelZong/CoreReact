import React from 'react'
import {connect} from 'react-redux'
import {ZGet} from 'utils/Xfetch'
import { Button } from 'antd'

const Authorization = React.createClass({
  getInitialState() {
    return {
      modal2Visible: false,
      loading: false
    }
  },
  componentWillReceiveProps(nextProps) {
  },
  handleClick() {
    this.setState({ loading: true })
    let url = ''
    let apiuri = ``
    switch (Number(this.props.disable)) {
      case 1: { //天猫
        url = `https://oauth.taobao.com/authorize?response_type=code&client_id=23476390&redirect_uri=http://114.55.11.89/admin/shops&state=1212&view=web`
        apiuri = `Api/Tmall/getToken`
        break
      }
      case 2:
      case 3: { //京东
        url = `https://auth.360buy.com/oauth/authorize?response_type=code&client_id=7888CE9C0F3AAD424FEE8EEAAC99E10E&redirect_uri=http://192.168.30.81:8989/admin/shops`
        apiuri = `Api/JingDong/getToken`
        break
      }
      default: break
    }
    const win = window.open(url)

    const loop = setInterval(() => {
      if (win.closed) {
        clearInterval(loop)
        if (win.document !== undefined) {
          let url = win.document.URL
          if (url !== 'about:blank') {
            let c = url.split('code')[1].split('=')[1]
            //uri = 'Api/JingDong/getToken'
            let data = {
              code: c
            }
            ZGet(apiuri, data, (s, d, m) => {
              this.setState({ loading: false })
              this.props.dispatch({type: 'SHOP_TOKEN_CODE', payload: d.access_token})
            })
          }
        } else {
          this.setState({ loading: false })
        }
        this.setState({ loading: false })
      }
    }, 1000)
  },
  handleCancel() {
    this.setState({ modal2Visible: false })
  },
  render() {
    const {disable} = this.props
    return (
      <div>
        <Button type='primary' disabled={disable === 0} loading={this.state.loading} size='large' style={{margin: '-2px 0 0 35px'}} onClick={this.handleClick}>授权</Button>
      </div>
    )
  }
})
export default connect(state => ({
  disable: state.shop_site_edit_disable,
  code: state.shop_token_code
}))(Authorization)
